import express from "express";
import Feedback from "../models/Feedback.js";
import { sendFeedbackNotification } from "../utils/mailer.js";

const router = express.Router();

// POST /api/feedback — client submits feedback after a session.
// Saved immediately; the owner is emailed; nothing is shown publicly until approved.
router.post("/", async (req, res) => {
  try {
    const { name, email, sessionType, rating, message, consentToDisplay } = req.body;
    if (!name || !rating || !message) {
      return res.status(400).json({ error: "name, rating and message are required" });
    }

    const feedback = await Feedback.create({
      name,
      email,
      sessionType,
      rating,
      message,
      consentToDisplay: consentToDisplay !== false,
    });

    sendFeedbackNotification(feedback).catch((e) =>
      console.error("Feedback notification email failed:", e.message)
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// GET /api/feedback/approved — public list, used for homepage testimonials.
// Only feedback that is both approved AND consented to display is returned.
router.get("/approved", async (req, res) => {
  try {
    const feedback = await Feedback.find({ approved: true, consentToDisplay: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .select("name sessionType rating message createdAt");
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// Approve a feedback entry so it can appear on the homepage.
// Supports both GET (so the link in the notification email is clickable
// directly from a browser — no Postman/curl needed) and PATCH (for anyone
// who prefers to call this programmatically).
async function approveHandler(req, res) {
  try {
    if (!process.env.ADMIN_SECRET || req.query.key !== process.env.ADMIN_SECRET) {
      return res.status(403).send("Invalid or missing admin key.");
    }
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!feedback) return res.status(404).send("Feedback not found.");

    // Browser-friendly confirmation when opened as a link; JSON when called programmatically
    if (req.method === "GET") {
      res.send(
        `<p style="font-family:sans-serif">Approved — "${feedback.message.slice(0, 80)}${feedback.message.length > 80 ? "…" : ""}" by ${feedback.name} will now show on the homepage.</p>`
      );
    } else {
      res.json({ feedback });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to approve feedback.");
  }
}

router.get("/:id/approve", approveHandler);
router.patch("/:id/approve", approveHandler);

// GET /api/feedback/pending?key=ADMIN_SECRET — see what's waiting for approval
router.get("/pending", async (req, res) => {
  try {
    if (!process.env.ADMIN_SECRET || req.query.key !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Invalid or missing admin key" });
    }
    const feedback = await Feedback.find({ approved: false }).sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending feedback" });
  }
});

export default router;
