// Must be the first import: its side effect (populating process.env) needs
// to run before any other module below is evaluated, since ES module
// imports are all evaluated before this file's own code runs.
import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { verifyMailer } from "./utils/mailer.js";

const app = express();

// Render (like most PaaS hosts) sits your app behind one reverse proxy that
// forwards the real client IP via X-Forwarded-For. Without telling Express
// to trust that one hop, express-rate-limit can't safely tell users apart
// by IP -- it throws exactly the ERR_ERL_UNEXPECTED_X_FORWARDED_FOR warning
// you're seeing, and in the worst case would rate-limit every visitor
// together. `1` means "trust exactly one proxy hop," which matches Render's
// setup; using `true` instead would trust the whole chain and let a client
// forge its own X-Forwarded-For to dodge rate limiting.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

// Basic abuse protection on write-heavy endpoints
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("[OK] MongoDB connected");
    verifyMailer();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("[ERROR] MongoDB connection error:", err.message);
    process.exit(1);
  });
