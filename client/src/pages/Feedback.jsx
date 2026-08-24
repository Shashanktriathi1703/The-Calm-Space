import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import StarRating from "../components/StarRating.jsx";
import "../styles/feedback.css";

export default function Feedback() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    sessionType: "",
    rating: 0,
    message: "",
    consentToDisplay: true,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) return;
    setStatus("sending");
    try {
      await api.post("/feedback", form);
      setStatus("sent");
      setForm({ name: "", email: "", sessionType: "", rating: 0, message: "", consentToDisplay: true });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <section className="feedback-section">
        <div className="container feedback-thanks">
          <div className="confirmation-check">✓</div>
          <h1>Thank you for sharing that.</h1>
          <p>
            Your feedback means a lot and helps others feel more confident reaching out too. If
            you agreed to let it be shown on the site, it'll appear here after a quick review.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="feedback-section">
      <div className="container feedback-grid">
        <div className="reveal" style={{ "--d": "0s" }}>
          <span className="eyebrow">Share Feedback</span>
          <h1>How was your session?</h1>
          <p className="feedback-sub">
            Whether you've just finished a session or a workshop, I'd love to hear how it went.
            Your feedback helps me keep improving — and, with your permission, helps other people
            feel a little more comfortable reaching out.
          </p>
        </div>

        <form className="feedback-form reveal" style={{ "--d": "0.1s" }} onSubmit={submit}>
          <div className="form-row">
            <label>
              Your name
              <input required value={form.name} onChange={update("name")} placeholder="Your name" />
            </label>
            <label>
              Email (optional)
              <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
            </label>
          </div>

          <label>
            What did you attend? (optional)
            <select value={form.sessionType} onChange={update("sessionType")}>
              <option value="">Select one</option>
              <option>Individual Counselling</option>
              <option>Career Counselling</option>
              <option>Follow-up Session</option>
              <option>Workshop</option>
            </select>
          </label>

          <label>
            Your rating
            <StarRating value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} size={30} />
          </label>

          <label>
            Your feedback
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={update("message")}
              placeholder="What stood out, what helped, what could be better..."
            />
          </label>

          <label className="feedback-consent">
            <input
              type="checkbox"
              checked={form.consentToDisplay}
              onChange={(e) => setForm((f) => ({ ...f, consentToDisplay: e.target.checked }))}
            />
            <span>
              I'm okay with this being shown on the website as a testimonial (first name and
              general context only — never your email or personal details).
            </span>
          </label>

          <button className="btn btn-primary btn-full" disabled={status === "sending" || !form.rating}>
            {status === "sending" ? "Sending..." : "Submit Feedback"}
          </button>

          {!form.rating && (
            <p className="feedback-hint">Select a star rating above to submit.</p>
          )}
          {status === "error" && (
            <p className="form-note form-note-error">
              Something went wrong submitting your feedback. Please try again or email directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
