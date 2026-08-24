import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { sendContactNotification, sendContactAutoReply } from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email and message are required" });
    }

    const msg = await ContactMessage.create({ name, email, phone, subject, message });

    sendContactNotification(msg).catch((e) => console.error("Notify email failed:", e.message));
    sendContactAutoReply(msg).catch((e) => console.error("Auto-reply email failed:", e.message));

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
