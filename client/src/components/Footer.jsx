import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col footer-brand">
          <Logo size={96} />
          <p className="footer-brand-sub">Dr. Kanchan Shukla Pandey — Counselling Psychologist &amp; Career Counsellor</p>
          <p>Personalized counselling and career guidance for real, practical growth.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/about">About</Link>
          <Link to="/booking">Book a Session</Link>
          <Link to="/workshops">Workshops</Link>
          <Link to="/feedback">Share Feedback</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Get in Touch</h4>
          <a href="mailto:kanchan.s.pandey@gmail.com">kanchan.s.pandey@gmail.com</a>
          <a href="tel:+918123025658">+91-8123025658</a>
          <a href="https://wa.me/918123025658" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} The Calm Space — Dr. Kanchan Shukla Pandey. All rights reserved.</span>
        <span>Counselling Psychologist &amp; Career Counsellor</span>
      </div>
    </footer>
  );
}
