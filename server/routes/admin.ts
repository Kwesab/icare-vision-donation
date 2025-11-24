import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminLoginRequest, AdminLoginResponse, ManualDonationRequest, DashboardStats, Donor } from "@shared/api";
import {
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation,
  getDashboardStats as getDbDashboardStats,
  getAdminByUsername,
} from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

function generateJWT(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "24h" });
}

function verifyJWT(token: string): { adminId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string };
  } catch {
    return null;
  }
}

export const adminLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body as AdminLoginRequest;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find admin in database
    const [admin] = await getAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password using bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = generateJWT(admin.id.toString());

    const response: AdminLoginResponse = {
      token,
      admin: {
        id: admin.id.toString(),
        username: admin.username,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllDonors: RequestHandler = async (req, res) => {
  try {
    // Check JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !verifyJWT(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const allDonors = await getAllDonations();
    res.json(allDonors);
  } catch (error) {
    console.error("Error getting donors:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addManualDonation: RequestHandler = async (req, res) => {
  try {
    // Check JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !verifyJWT(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { donor_name, donor_email, amount, message } =
      req.body as ManualDonationRequest;

    if (!donor_name || !donor_email || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation data",
      });
    }

    const [newDonor] = await createDonation(
      donor_name,
      donor_email,
      amount,
      message || null,
      "cash"
    );

    res.json({
      success: true,
      message: "Donation added successfully",
      data: newDonor,
    });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateDonor: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !verifyJWT(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const { donor_name, donor_email, amount, message } = req.body;

    const [updatedDonor] = await updateDonation(parseInt(id), {
      donor_name,
      donor_email,
      amount,
      message,
    });

    if (!updatedDonor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.json({
      success: true,
      message: "Donor updated successfully",
      data: updatedDonor,
    });
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteDonor: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !verifyJWT(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    const [deletedDonor] = await deleteDonation(parseInt(id));

    if (!deletedDonor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.json({
      success: true,
      message: "Donor deleted successfully",
      data: deletedDonor,
    });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !verifyJWT(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const stats = await getDbDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
