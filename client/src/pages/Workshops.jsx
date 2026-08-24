import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import WorkshopsIllustration from "../components/WorkshopsIllustration.jsx";
import WorkshopIcon from "../components/WorkshopIcon.jsx";
import "../styles/workshops.css";

const workshops = [
  {
    title: "Choosing Your Career Path",
    format: "Group · 90 minutes · Online",
    desc: "A practical framework for stream, course, or career decisions — for students and young professionals feeling stuck between options.",
    icon: "compass",
  },
  {
    title: "Understanding Your Anxiety",
    format: "Group · 90 minutes · Online",
    desc: "A practical session on how anxiety shows up in the body and mind, and three tools to work with it in real time — not just talk about it.",
    icon: "brain",
  },
  {
    title: "Time Management Workshop",
    format: "Group · 90 minutes · Online",
    desc: "Learn practical techniques to manage time effectively, prioritize tasks, and improve productivity. This workshop helps participants develop healthy habits to reduce stress and achieve a better work-life balance.",
    icon: "clock",
  },
  {
    title: "Resilience Workshop",
    format: "Group · 90 minutes · Online",
    desc: "Develop practical strategies to build resilience and maintain emotional well-being in both personal and professional life. Participants will learn evidence-based techniques to manage stress, improve coping skills, and enhance overall productivity and balance.",
    icon: "shield",
  },
];

export default function Workshops() {
  return (
    <>
      <section className="workshops-hero">
        <div className="container workshops-hero-grid">
          <div className="reveal" style={{ "--d": "0s" }}>
            <span className="eyebrow">Workshops</span>
            <h1>Group sessions for shared, practical growth</h1>
            <p className="workshops-sub">
              For people who learn well alongside others — covering emotional wellbeing and
              career direction. Each workshop is small, structured, and built around tools you can
              use immediately — not lectures.
            </p>
          </div>
          <div className="workshops-hero-visual reveal" style={{ "--d": "0.15s" }}>
            <WorkshopsIllustration />
          </div>
        </div>
      </section>

      <section className="workshops-list">
        <div className="container">
          {workshops.map((w, i) => (
            <Reveal className="workshop-row" key={w.title} style={{ "--d": `${i * 0.06}s` }}>
              <div className="workshop-row-head">
                <WorkshopIcon type={w.icon} />
                <div>
                  <h3>{w.title}</h3>
                  <span className="workshop-format">{w.format}</span>
                </div>
              </div>
              <p>{w.desc}</p>
              <Link to="/contact" className="btn btn-secondary">
                Ask About This
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="workshops-cta">
        <Reveal className="container workshops-cta-inner">
          <h2>Want to bring a workshop to your team or college?</h2>
          <p>I run custom sessions for organisations, colleges, and small groups.</p>
          <Link to="/contact" className="btn btn-primary">
            Get in Touch
          </Link>
        </Reveal>
      </section>
    </>
  );
}
