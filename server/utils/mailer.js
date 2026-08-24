import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, "../assets/logo-icon.png");
const LOGO_CID = "calmspace-logo";

// Embedding the logo as an inline attachment (referenced via cid:) works
// reliably across email clients even before the site has a public domain —
// unlike a plain <img src="https://..."> tag, which needs the site to
// already be deployed and reachable.
const logoAttachment = {
  filename: "logo.png",
  path: LOGO_PATH,
  cid: LOGO_CID,
};

// Gmail SMTP transporter, created lazily so it always reads env vars that
// have definitely finished loading (see the comment in server.js about
// ES module import ordering) rather than whatever was present at import time.
let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function verifyMailer() {
  try {
    await getTransporter().verify();
    console.log("[OK] Email transporter ready");
  } catch (err) {
    console.error("[WARNING] Email transporter failed to verify:", err.message);
    console.error(
      "   Check EMAIL_USER / EMAIL_APP_PASSWORD in your .env (see .env.example for setup steps)."
    );
  }
}

const brandFooter = `
  <p style="margin-top:24px;font-size:13px;color:#5B7370;">
    The Calm Space — Dr. Kanchan Shukla Pandey, Counselling Psychologist &amp; Career Counsellor<br/>
    +91-8123025658 · kanchan.s.pandey@gmail.com
  </p>
`;

// Wraps every email body with the logo + wordmark centered at the top, so
// the brand mark shows up consistently without repeating this markup in
// every template. Mirrors the site's icon + live-text lockup rather than
// relying on a flattened image alone (email clients render images small and
// inconsistently, so real text is the more reliable part of the mark).
function wrapEmail(bodyHtml) {
  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#22383A;">
      <div style="text-align:center;margin-bottom:20px;">
        <img src="cid:${LOGO_CID}" width="56" height="56" alt="" style="display:block;margin:0 auto 8px;" />
        <div style="font-family:Georgia,serif;font-style:italic;font-weight:bold;font-size:22px;color:#24484C;">The Calm Space</div>
      </div>
      ${bodyHtml}
    </div>
  `;
}

async function send({ to, from, subject, html }) {
  await getTransporter().sendMail({
    from,
    to,
    subject,
    html: wrapEmail(html),
    attachments: [logoAttachment],
  });
}

export async function sendBookingConfirmationToClient(booking) {
  const html = `
    <h2 style="color:#24484C;text-align:center;">Your session is confirmed</h2>
    <p>Hi ${booking.name},</p>
    <p>Thank you for booking a session. Here are your details:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#5B7370;">Session type</td><td style="padding:6px 0;font-weight:bold;">${booking.sessionType}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Date</td><td style="padding:6px 0;font-weight:bold;">${booking.date}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Time</td><td style="padding:6px 0;font-weight:bold;">${booking.timeSlot}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Amount paid</td><td style="padding:6px 0;font-weight:bold;">₹${booking.amount} (${booking.paymentStatus})</td></tr>
    </table>
    <p>You'll receive a calendar invite / call link separately before the session. If you need to reschedule, just reply to this email or call +91-8123025658.</p>
    <p>Looking forward to speaking with you.</p>
    <p style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;font-size:14px;">
      After your session, I'd love to hear how it went —
      <a href="${process.env.CLIENT_URL || ""}/feedback" style="color:#E0794F;font-weight:bold;">share your feedback here</a>.
    </p>
    ${brandFooter}
  `;
  await send({
    to: booking.email,
    from: `"The Calm Space — Dr. Kanchan Shukla Pandey" <${process.env.EMAIL_USER}>`,
    subject: "Your session at The Calm Space is confirmed",
    html,
  });
}

export async function sendBookingNotificationToClinic(booking) {
  const html = `
    <h2 style="color:#24484C;text-align:center;">New session booked</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#5B7370;">Client</td><td style="padding:6px 0;font-weight:bold;">${booking.name}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Email</td><td style="padding:6px 0;">${booking.email}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Phone</td><td style="padding:6px 0;">${booking.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Session type</td><td style="padding:6px 0;">${booking.sessionType}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Date / Time</td><td style="padding:6px 0;">${booking.date} · ${booking.timeSlot}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Reason for visit</td><td style="padding:6px 0;">${booking.reasonForVisit || "-"}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Amount</td><td style="padding:6px 0;">₹${booking.amount} (${booking.paymentStatus})</td></tr>
    </table>
  `;
  await send({
    to: process.env.CLINIC_NOTIFY_EMAIL || process.env.EMAIL_USER,
    from: `"Website Booking" <${process.env.EMAIL_USER}>`,
    subject: `New booking: ${booking.name} — ${booking.date} ${booking.timeSlot}`,
    html,
  });
}

export async function sendContactNotification(msg) {
  const html = `
    <h2 style="color:#24484C;text-align:center;">New contact form message</h2>
    <p><strong>${msg.name}</strong> (${msg.email}${msg.phone ? ", " + msg.phone : ""})</p>
    <p style="color:#5B7370;">Subject: ${msg.subject || "-"}</p>
    <p style="white-space:pre-wrap;border-left:3px solid #E0794F;padding-left:12px;">${msg.message}</p>
  `;
  await send({
    to: process.env.CLINIC_NOTIFY_EMAIL || process.env.EMAIL_USER,
    from: `"Website Contact Form" <${process.env.EMAIL_USER}>`,
    subject: `New contact message from ${msg.name}`,
    html,
  });
}

export async function sendContactAutoReply(msg) {
  const html = `
    <h2 style="color:#24484C;text-align:center;">Thanks for reaching out</h2>
    <p>Hi ${msg.name},</p>
    <p>I've received your message and will get back to you within 1–2 business days. If it's urgent, feel free to call or WhatsApp +91-8123025658.</p>
    ${brandFooter}
  `;
  await send({
    to: msg.email,
    from: `"The Calm Space — Dr. Kanchan Shukla Pandey" <${process.env.EMAIL_USER}>`,
    subject: "Thanks for reaching out",
    html,
  });
}

export async function sendFeedbackNotification(feedback) {
  const stars = "★".repeat(feedback.rating) + "☆".repeat(5 - feedback.rating);
  const html = `
    <h2 style="color:#24484C;text-align:center;">New client feedback received</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#5B7370;">From</td><td style="padding:6px 0;font-weight:bold;">${feedback.name}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Email</td><td style="padding:6px 0;">${feedback.email || "-"}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Session type</td><td style="padding:6px 0;">${feedback.sessionType || "-"}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">Rating</td><td style="padding:6px 0;color:#E0794F;font-weight:bold;">${stars}</td></tr>
      <tr><td style="padding:6px 0;color:#5B7370;">OK to display on site?</td><td style="padding:6px 0;">${feedback.consentToDisplay ? "Yes" : "No — keep private"}</td></tr>
    </table>
    <p style="white-space:pre-wrap;border-left:3px solid #E0794F;padding-left:12px;">${feedback.message}</p>
    <p style="color:#5B7370;font-size:13px;">
      This won't appear on the website until it's approved. Approve it by opening this link in a
      browser (replace YOUR_ADMIN_SECRET with the real value from your .env):<br/>
      https://your-backend-url/api/feedback/${feedback._id}/approve?key=YOUR_ADMIN_SECRET
    </p>
  `;
  await send({
    to: process.env.CLINIC_NOTIFY_EMAIL || process.env.EMAIL_USER,
    from: `"Website Feedback" <${process.env.EMAIL_USER}>`,
    subject: `New feedback from ${feedback.name} (${feedback.rating}★)`,
    html,
  });
}
