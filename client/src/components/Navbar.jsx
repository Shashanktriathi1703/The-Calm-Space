import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/about", label: "About" },
    { to: "/workshops", label: "Workshops" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <Logo size={72} />
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <ThemeToggle className="nav-theme-toggle" />
          <Link to="/booking" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
            Book a Session
          </Link>
        </nav>
      </div>
    </header>
  );
}
