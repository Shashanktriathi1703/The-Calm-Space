import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number },
    reasonForVisit: { type: String, trim: true },
    sessionType: {
      type: String,
      enum: ["Individual Counselling", "Career Counselling", "Follow-up Session"],
      default: "Individual Counselling",
    },
    date: { type: String, required: true }, // "2026-08-10"
    timeSlot: { type: String, required: true }, // "10:00 AM - 11:00 AM"
    notes: { type: String, trim: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// Prevent double-booking of the same slot on the same date once paid/confirmed
bookingSchema.index({ date: 1, timeSlot: 1 }, { unique: false });

export default mongoose.model("Booking", bookingSchema);
