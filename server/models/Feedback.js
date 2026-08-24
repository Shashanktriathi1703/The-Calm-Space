import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    sessionType: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true },

    // Whether the client agreed this feedback may be shown publicly on the website
    consentToDisplay: { type: Boolean, default: true },

    // Feedback is NOT shown on the site until manually approved — protects
    // against anything sensitive or low-quality going live automatically.
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
