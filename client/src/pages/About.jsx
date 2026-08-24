import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import AboutIllustration from "../components/AboutIllustration.jsx";
import "../styles/about.css";

const focusAreas = [
  "Anxiety",
  "Emotion Regulation",
  "Motivation",
  "Self-Esteem",
  "Career Direction",
  "Life Transitions",
];

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="reveal" style={{ "--d": "0s" }}>
            <span className="tagline">A Safe Space For Healing</span>
            <span className="eyebrow">About</span>
            <h1>Dr. Kanchan Shukla Pandey</h1>
            <p className="about-hero-sub">
              Counselling Psychologist &amp; Career Counsellor working with young adults on
              anxiety, self-esteem, career direction, and life transitions — through structured,
              evidence-based, and genuinely warm sessions.
            </p>
          </div>
          <div className="about-hero-visual reveal" style={{ "--d": "0.1s" }}>
            <AboutIllustration />
          </div>
        </div>
        <Reveal className="container about-hero-card-wrap" style={{ "--d": "0.2s" }}>
          <div className="about-hero-card">
            <dl>
              <div>
                <dt>Focus</dt>
                <dd>Young adults</dd>
              </div>
              <div>
                <dt>Approach</dt>
                <dd>CBT · REBT · SFBT · Mindfulness</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Online, 60-minute sessions</dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </section>

      <section className="about-story">
        <Reveal className="container about-story-grid">
          <div>
            <h2>My Approach</h2>
            <p>
              I believe that every individual has the ability to grow, heal, and lead a
              fulfilling life with the right support. My approach is compassionate,
              collaborative, and tailored to your unique needs and experiences.
            </p>
            <p>
              I use evidence-based approaches, including CBT, REBT, SFBT, Art Based Therapy, Play
              Therapy, and Mindfulness, to help you understand your thoughts, manage emotions, and
              develop healthier coping strategies. Together, we will explore the challenges you
              are facing, build self-awareness, and work toward practical, lasting change.
            </p>
            <p>
              My goal is to provide a safe, confidential, and non-judgmental space where you feel
              heard, supported, and empowered to navigate life's challenges with greater
              confidence and emotional well-being.
            </p>

            <blockquote className="about-quote">
              &ldquo;Part of getting to know yourself is to unknow yourself — to let go of the
              limiting stories you've told yourself.&rdquo;
            </blockquote>

            <div className="focus-tags">
              {focusAreas.map((f) => (
                <span className="focus-tag" key={f}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2>Credentials &amp; Training</h2>
            <ul className="creds-list">
              <li>Doctorate in Psychology</li>
              <li>Certified in Career Counselling &amp; Guidance</li>
              <li>Certificate Program in Advance Child Psychology</li>
              <li>Certificate Program in Graphology</li>
              <li>Certified Yoga Trainer</li>
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="about-cta">
        <Reveal className="container about-cta-inner">
          <h2>Curious if this is the right fit?</h2>
          <p>The first session is about understanding your situation — no commitment beyond that.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/booking" className="btn btn-primary">
              Book a Session
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Ask a Question First
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
