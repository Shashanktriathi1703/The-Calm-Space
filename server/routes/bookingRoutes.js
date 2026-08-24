import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import {
  sendBookingConfirmationToClient,
  sendBookingNotificationToClinic,
} from "../utils/mailer.js";

const router = express.Router();

// Created lazily (on first request) rather than at import time. ES module
// imports are evaluated before dotenv.config() runs, so building this at
// the top of the file would read the env vars before they're loaded.
let razorpay = null;
function getRazorpay() {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are missing. Check your .env file (or your host's environment variables)."
      );
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

const WORKING_HOURS = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

// GET /api/bookings/slots?date=2026-08-10
router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date is required" });

    const day = new Date(date + "T00:00:00").getDay(); // 0 = Sunday
    if (day === 0) {
      return res.json({ date, slots: [] }); // closed Sundays
    }

    const takenBookings = await Booking.find({
      date,
      status: "confirmed",
      paymentStatus: { $ne: "failed" },
    }).select("timeSlot -_id");

    const taken = new Set(takenBookings.map((b) => b.timeSlot));
    const slots = WORKING_HOURS.filter((slot) => !taken.has(slot));

    res.json({ date, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

// POST /api/bookings/create-order  { date, timeSlot }
// Creates a Razorpay order for the session price and returns it to the client.
router.post("/create-order", async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    if (!date || !timeSlot) {
      return res.status(400).json({ error: "date and timeSlot are required" });
    }

    const already = await Booking.findOne({
      date,
      timeSlot,
      status: "confirmed",
      paymentStatus: { $ne: "failed" },
    });
    if (already) {
      return res.status(409).json({ error: "This slot has just been booked. Please pick another." });
    }

    const amount = Number(process.env.SESSION_PRICE_INR || 1500);

    const order = await getRazorpay().orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ order, amount, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// POST /api/bookings/verify-and-book
// Verifies Razorpay signature, saves the booking, and sends confirmation emails.
router.post("/verify-and-book", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      details, // { name, email, phone, age, reasonForVisit, sessionType, notes }
      date,
      timeSlot,
      amount,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const booking = await Booking.create({
      ...details,
      date,
      timeSlot,
      amount,
      currency: "INR",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "confirmed",
    });

    // Fire-and-forget emails; booking is already saved either way.
    sendBookingConfirmationToClient(booking).catch((e) =>
      console.error("Client email failed:", e.message)
    );
    sendBookingNotificationToClinic(booking).catch((e) =>
      console.error("Clinic email failed:", e.message)
    );

    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
});

export default router;
