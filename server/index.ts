import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  initializeDonation,
  verifyPayment,
  getPublicDonors,
  paystackWebhook,
} from "./routes/donations";
import {
  adminLogin,
  getAllDonors,
  addManualDonation,
  updateDonor,
  deleteDonor,
  getDashboardStats,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Public Donation Routes
  app.post("/api/donate/init", initializeDonation);
  app.post("/api/donate/verify", verifyPayment);
  app.get("/api/donors", getPublicDonors);
  app.post("/api/paystack/webhook", paystackWebhook);

  // Admin Routes
  app.post("/api/admin/login", adminLogin);
  app.get("/api/admin/donors", getAllDonors);
  app.post("/api/admin/donors/manual-add", addManualDonation);
  app.put("/api/admin/donors/:id", updateDonor);
  app.delete("/api/admin/donors/:id", deleteDonor);
  app.get("/api/admin/dashboard/stats", getDashboardStats);

  return app;
}
