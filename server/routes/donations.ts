import { RequestHandler } from "express";
import crypto from "crypto";
import {
  InitDonationRequest,
  InitDonationResponse,
  WebhookVerificationResponse,
  PublicDonor,
} from "@shared/api";
import {
  createDonation,
  getPublicDonors as getPublicDonorsDb,
  updateDonationByReference,
} from "../db";
import { getUSDtoGHSRate } from "../utils/exchange-rate";

const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || "";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

export const initializeDonation: RequestHandler = async (req, res) => {
  try {
    const { fullName, email, amount, message } = req.body as InitDonationRequest;

    // Validate input
    if (!fullName || !email || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation data",
      });
    }

    // Convert USD to GHS (Ghana Cedis) for Paystack processing
    // Get live exchange rate (with fallback to 11.14 GHS)
    const USD_TO_GHS_RATE = await getUSDtoGHSRate();
    const amountInGHS = amount * USD_TO_GHS_RATE;
    const amountInPesewas = Math.round(amountInGHS * 100); // Convert GHS to pesewas (smallest unit)
    
    console.log(`Converting $${amount} USD → GH₵ ${amountInGHS.toFixed(2)} (Rate: ${USD_TO_GHS_RATE})`);

    // Create request to Paystack
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email,
          amount: amountInPesewas,
          currency: "GHS",
          channels: ["card"], // Only accept card payments
          metadata: {
            donor_name: fullName,
            message: message || null,
            payment_type: "online",
            usd_amount: amount, // Store original USD amount for database
          },
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    console.log("Paystack Response:", paystackData);

    if (!paystackData.status) {
      console.error("Paystack Error:", paystackData);
      return res.status(400).json({
        success: false,
        message: "Failed to initialize Paystack payment",
        error: paystackData.message,
      });
    }

    const response: InitDonationResponse = {
      authorizationUrl: paystackData.data.authorization_url,
      accessCode: paystackData.data.access_code,
      reference: paystackData.data.reference,
    };

    res.json(response);
  } catch (error) {
    console.error("Error initializing donation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Reference is required",
      });
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Save donation to database using original USD amount from metadata
    const metadata = verifyData.data.metadata || {};
    const amountInDollars = metadata.usd_amount || (verifyData.data.amount / 100 / 11.14); // Fallback conversion
    
    await createDonation(
      metadata.donor_name || verifyData.data.customer.first_name + " " + verifyData.data.customer.last_name,
      verifyData.data.customer.email,
      amountInDollars,
      metadata.message || null,
      "online",
      reference
    );

    const response: WebhookVerificationResponse = {
      status: true,
      message: "Payment verified successfully",
      data: verifyData.data,
    };

    res.json(response);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPublicDonors: RequestHandler = async (req, res) => {
  try {
    // Return donors without amounts from database
    const publicDonors = await getPublicDonorsDb();
    res.json(publicDonors);
  } catch (error) {
    console.error("Error getting donors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const paystackWebhook: RequestHandler = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const { event, data } = req.body;

    if (event === "charge.success") {
      const { reference, metadata, customer, amount } = data;

      // Use original USD amount from metadata (stored during initialization)
      const amountInDollars = metadata.usd_amount || (amount / 100 / 11.14); // Fallback conversion

      // Save donation to database
      await createDonation(
        metadata.donor_name || customer.first_name + " " + customer.last_name,
        customer.email,
        amountInDollars,
        metadata.message || null,
        "online",
        reference
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
