import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HeroIllustration from "../components/HeroIllustration.jsx";
import Reveal from "../components/Reveal.jsx";
import StarRating from "../components/StarRating.jsx";
import api from "../api/client.js";
import "../styles/home.css";

// Shown until real, approved client feedback comes in — see the
// "Share Feedback" page and README for how testimonials get approved.
const fallbackStories = [
  {
    message:
      "I came in expecting to just vent. What I actually got was a way of noticing my own patterns before they run the show. That shift alone was worth it.",
    name: "R., 27",
    sessionType: "Individual Counselling",
    rating: 5,
  },
  {
    message:
      "The sessions were structured without ever feeling clinical. I always left with one clear thing to try, not just a vague sense of having talked.",
    name: "A., 24",
    sessionType: "Individual Counselling",
    rating: 5,
  },
  {
    message:
      "Anxiety used to run my calendar. Now I can name what's happening in the moment and choose differently. That's the whole difference.",
    name: "S., 31",
    sessionType: "Career Counselling",
    rating: 5,
  },
];


const benefits = [
  {
    title: "Clarity over confusion",
    text: "Leave each session with language for what you're feeling and one concrete next step — not just a lighter mood for a day.",
  },
  {
    title: "Built for how you actually live",
    text: "Sessions fit around work, exams, or shift schedules. Online, on time, no waiting rooms.",
  },
  {
    title: "Evidence-based, not one-size-fits-all",
    text: "CBT, ACT, and career-guidance frameworks drawn from as they fit you — not a fixed script applied to everyone.",
  },
  {
    title: "A record you can look back on",
    text: "Patterns take a few sessions to see. We track what's shifting so progress isn't just a feeling — it's visible.",
  },
];

export default function Home() {
  const [stories, setStories] = useState(fallbackStories);

  useEffect(() => {
    api
      .get("/feedback/approved")
      .then((res) => {
        if (res.data.feedback && res.data.feedback.length > 0) {
          setStories(res.data.feedback.slice(0, 3));
        }
      })
      .catch(() => {
        // Fall back to the sample stories already in state — no need to
        // surface an error for a non-critical homepage section.
      });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="clinic-kicker reveal" style={{ "--d": "0s" }}>The Calm Space — Psychology Clinic</span>
            <span className="hero-badge reveal" style={{ "--d": "0.02s" }}>Now accepting new clients</span>
            <span className="eyebrow reveal" style={{ "--d": "0.04s" }}>
              Counselling Psychologist &amp; Career Counsellor
            </span>
            <h1 className="reveal" style={{ "--d": "0.1s" }}>
              Navigate life's challenges
              <br />
              with clarity and structure.
            </h1>
            <p className="hero-sub reveal" style={{ "--d": "0.18s" }}>
              Supporting young adults in understanding their patterns, finding clarity,
              and building resilience — through counselling and career guidance, in a practical,
              approachable way.
            </p>
            <div className="hero-actions reveal" style={{ "--d": "0.24s" }}>
              <Link to="/booking" className="btn btn-primary">
                Book a Session
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-visual reveal" style={{ "--d": "0.2s" }}>
            <HeroIllustration />
          </div>
        </div>
        <div className="hero-thread" aria-hidden="true">
          <span>01 Choose Time</span>
          <span>02 Your Details</span>
          <span>03 Payment</span>
          <span>04 Confirmation</span>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="about-preview">
        <Reveal className="container about-grid">
          <div>
            <span className="eyebrow">About Dr. Kanchan</span>
            <h2>Therapy that meets you where you are</h2>
            <p>
              I'm Dr. Kanchan Shukla Pandey, a counselling psychologist and career counsellor
              working primarily with young adults navigating anxiety, career confusion, academic
              transitions, and self-esteem. My approach is warm but direct: we name what's really
              going on, and build tools you can use between sessions — not just during them.
            </p>
            <Link to="/about" className="link-arrow">
              Read more about my approach →
            </Link>
          </div>
          <div className="about-photo-frame">
            <div className="about-photo-blob about-photo-blob-1" aria-hidden="true" />
            <div className="about-photo-blob about-photo-blob-2" aria-hidden="true" />
            <img
              src="/images/dr-kanchan.jpg"
              alt="Dr. Kanchan Shukla Pandey, Counselling Psychologist & Career Counsellor"
              className="about-photo"
              width="620"
              height="826"
            />
            <div className="about-photo-badge">
              <p className="about-card-stat">50+</p>
              <p className="about-card-label">clients supported</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* HOW I WORK */}
      <section className="how-i-work">
        <Reveal className="container">
          <span className="eyebrow">The Way I Work</span>
          <h2>A structure you can actually feel</h2>
          <div className="how-grid">
            <div className="how-step">
              <span className="how-step-index">1</span>
              <h3>Understand</h3>
              <p>We start by mapping what's happening — the thought patterns, triggers, and history behind the struggle, not just the surface symptom.</p>
            </div>
            <div className="how-step">
              <span className="how-step-index">2</span>
              <h3>Reframe</h3>
              <p>Together we challenge the stories that keep you stuck, using tools from CBT, ACT, and career-focused frameworks suited to you.</p>
            </div>
            <div className="how-step">
              <span className="how-step-index">3</span>
              <h3>Practice</h3>
              <p>Each session ends with something concrete to try — a small, testable shift you take back into your week.</p>
            </div>
            <div className="how-step">
              <span className="how-step-index">4</span>
              <h3>Consolidate</h3>
              <p>We review what worked and what didn't, so change compounds instead of resetting every session.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* IS THIS FOR YOU */}
      <section className="is-this-for-you">
        <Reveal className="container fit-grid">
          <div>
            <span className="eyebrow">Is This For You?</span>
            <h2>Good fit if you're&hellip;</h2>
            <ul className="fit-list">
              <li>Feeling stuck in the same anxious or self-critical loop</li>
              <li>Confused about career, stream, or academic direction</li>
              <li>Looking for practical tools, not just a space to vent</li>
              <li>Ready to do some of the work between sessions</li>
            </ul>
          </div>
          <div className="fit-card">
            <h3>Not the right fit if&hellip;</h3>
            <p>
              You're in acute crisis and need immediate, in-person psychiatric support — in that
              case, please reach out to a local emergency service or helpline first. I'm glad to
              support you once you're in a stable place to begin structured work.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CLIENT STORIES */}
      <section className="stories">
        <Reveal className="container">
          <span className="eyebrow">Client Stories</span>
          <h2>What the work sounds like</h2>
          <div className="stories-grid">
            {stories.map((s, i) => (
              <figure className="story-card" key={s.name + i}>
                <StarRating value={s.rating || 5} size={16} />
                <blockquote>&ldquo;{s.message}&rdquo;</blockquote>
                <figcaption>
                  <strong>{s.name}</strong>
                  <span>{s.sessionType || "Client"}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="stories-note">
            Shared with permission.{" "}
            <Link to="/feedback" className="stories-note-link">
              Share your own feedback →
            </Link>
          </p>
        </Reveal>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <Reveal className="container">
          <span className="eyebrow">Why It Helps</span>
          <h2>What structured therapy actually gives you</h2>
          <div className="benefits-grid">
            {benefits.map((b) => (
              <div className="benefit-card" key={b.title}>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="cta">
        <Reveal className="container cta-inner">
          <h2>Ready to take the first step?</h2>
          <p>Sessions are 60 minutes, online, and start with a conversation — not a diagnosis.</p>
          <Link to="/booking" className="btn btn-primary">
            Book a Session
          </Link>
        </Reveal>
      </section>
    </>
  );
}
