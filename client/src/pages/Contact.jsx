import { useState } from "react";
import api from "../api/client.js";
import Reveal from "../components/Reveal.jsx";
import ContactIllustration from "../components/ContactIllustration.jsx";
import "../styles/contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="contact-section">
      <div className="container contact-grid">
        <div className="reveal" style={{ "--d": "0s" }}>
          <span className="eyebrow">Contact</span>
          <h1>Have a question before you book?</h1>
          <p className="contact-sub">
            Send a message and I'll get back to you within 1–2 business days. For anything
            urgent, call or WhatsApp directly.
          </p>

          <div className="contact-details">
            <div>
              <span className="contact-label">Phone</span>
              <a href="tel:+918123025658">+91-8123025658</a>
            </div>
            <div>
              <span className="contact-label">Email</span>
              <a href="mailto:kanchan.s.pandey@gmail.com">kanchan.s.pandey@gmail.com</a>
            </div>
            <div>
              <span className="contact-label">WhatsApp</span>
              <a href="https://wa.me/918123025658" target="_blank" rel="noreferrer">
                Message on WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-illustration-wrap reveal" style={{ "--d": "0.2s" }}>
            <ContactIllustration />
          </div>
        </div>

        <form className="contact-form reveal" style={{ "--d": "0.12s" }} onSubmit={submit}>
          <div className="form-row">
            <label>
              Name
              <input required value={form.name} onChange={update("name")} placeholder="Your name" />
            </label>
            <label>
              Email(`kanchan.s.pandey@gmail.com`)
              <input
                // required
                type="email"
                value={"kanchan.s.pandey@gmail.com"}
                onChange={update("email")}
                placeholder="kanchan.s.pandey@gmail.com"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Phone (WhatsApp)
              <input value={form.phone} onChange={update("phone")} placeholder="+91 ..." />
            </label>
            <label>
              Subject
              <input value={form.subject} onChange={update("subject")} placeholder="What's this about?" />
            </label>
          </div>
          <label>
            Message
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={update("message")}
              placeholder="Tell me a little about what's bringing you here..."
            />
          </label>

          <button className="btn btn-primary btn-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "sent" && (
            <p className="form-note form-note-success">
              Message sent — thank you. I'll reply within 1–2 business days.
            </p>
          )}
          {status === "error" && (
            <p className="form-note form-note-error">
              Something went wrong sending your message. Please try again or email directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
