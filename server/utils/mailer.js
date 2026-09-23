import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.join(__dirname, "../assets/logo-icon.png");
const LOGO_CID = "calmspace-logo";

// Embedding the logo as an inline attachment (referenced via cid:) works
// reliably across email clients even before the site has a public domain --
// unlike a plain <img src="https://..."> tag, which needs the site to
// already be deployed and reachable. Resend needs the raw bytes up front
// (base64), unlike Nodemailer which could just take a file path.
const logoAttachment = {
  filename: "logo.png",
  content: fs.readFileSync(LOGO_PATH).toString("base64"),
  contentId: LOGO_CID,
};

// Resend client, created lazily so it always reads env vars that have
// definitely finished loading (see the comment in server.js about ES module
// import ordering) rather than whatever was present at import time.
//
// Why Resend instead of Gmail SMTP: Gmail-over-SMTP from shared cloud IPs
// (Render, Heroku, etc.) routinely times out or gets silently throttled by
// Google -- there's no fix on our end for that, since it's Google treating
// the *host's* IP reputation as suspicious, not our credentials. Resend
// sends over plain HTTPS (port 443), which is never blocked, so this class
// of failure just doesn't happen.
let resend = null;
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// The address every email is sent "from". Until you verify your own domain
// in the Resend dashboard (Domains -> Add Domain), Resend only lets you send
// from their shared onboarding@resend.dev sandbox address, and only to the
// email you signed up to Resend with -- real clients booking sessions won't
// receive anything until a real domain is verified. Set EMAIL_FROM once
// that's done, e.g. EMAIL_FROM="The Calm Space <hello@thecalmspace.com>".
const FROM_ADDRESS = process.env.EMAIL_FROM || "The Calm Space <onboarding@resend.dev>";

// Replies to these auto-generated emails should land in a real inbox, so
// route them to the clinic's actual Gmail regardless of what FROM_ADDRESS is.
const REPLY_TO = process.env.EMAIL_USER || undefined;

export async function verifyMailer() {
  if (!process.env.RESEND_API_KEY) {
    console.error("[WARNING] RESEND_API_KEY is not set -- emails will fail to send.");
    console.error("   Get a key at https://resend.com/api-keys and add it to your env vars.");
    return;
  }
  try {
    // Resend has no SMTP-style handshake to "verify" ahead of time, so we
    // do the next best thing: confirm the API key itself is accepted by
    // making a cheap, read-only call. A key scoped to "Sending access"
    // (the safer, recommended scope) is *not* allowed to call /domains at
    // all -- that's a 401 "restricted_api_key" error, not a sign the key is
    // bad. We treat that specific error as a pass rather than a failure,
    // since it actually confirms the key is real (a garbage key gets a
    // plain "invalid API key" error instead, which we still fail on below).
    const { error } = await getResend().domains.list();
    if (error && error.name !== "restricted_api_key") {
      throw new Error(error.message || "Resend rejected the API key");
    }
    console.log(
      error
        ? "[OK] Resend API key present (sending-only scope -- can't verify domains from here, that's fine)"
        : "[OK] Resend API key verified"
    );
    if (!process.env.EMAIL_FROM) {
      console.warn(
        "[WARNING] EMAIL_FROM is not set -- sending from the onboarding@resend.dev sandbox, " +
          "which can only reach the email address your Resend account is signed up with. " +
          "Verify a domain in Resend and set EMAIL_FROM to send real client emails."
      );
    } else if (/@gmail\.com|@yahoo\.com|@outlook\.com|@hotmail\.com/i.test(process.env.EMAIL_FROM)) {
      console.error(
        "[WARNING] EMAIL_FROM looks like a personal inbox (Gmail/Yahoo/Outlook). Resend can only " +
          "send from a domain you've verified yourself -- it will reject every send with " +
          "'domain is not verified' until this is a real address on your own domain, or removed " +
          "entirely to fall back to the onboarding@resend.dev sandbox."
      );
    }
  } catch (err) {
    console.error("[WARNING] Resend API key failed to verify:", err.message);
    console.error("   Check RESEND_API_KEY in your env vars (see .env.example for setup steps).");
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

// Callers pass a distinct display name (e.g. "Website Booking") but the
// actual email address always has to be one Resend will accept: either the
// verified-domain address in EMAIL_FROM, or the onboarding@resend.dev
// sandbox. Domain verification is per-domain, not per-address, so any local
// part in front of "@" is fine once the domain itself is verified.
function buildFrom(displayName) {
  const match = FROM_ADDRESS.match(/<(.+)>/);
  const email = match ? match[1] : FROM_ADDRESS;
  return `${displayName} <${email}>`;
}

async function send({ to, from, subject, html }) {
  const { error } = await getResend().emails.send({
    from,
    to,
    replyTo: REPLY_TO,
    subject,
    html: wrapEmail(html),
    attachments: [logoAttachment],
  });
  if (error) {
    throw new Error(error.message || "Resend failed to send the email");
  }
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
    from: buildFrom("The Calm Space — Dr. Kanchan Shukla Pandey"),
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
    from: buildFrom("Website Booking"),
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
    from: buildFrom("Website Contact Form"),
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
    from: buildFrom("The Calm Space — Dr. Kanchan Shukla Pandey"),
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
    from: buildFrom("Website Feedback"),
    subject: `New feedback from ${feedback.name} (${feedback.rating}★)`,
    html,
  });
}
