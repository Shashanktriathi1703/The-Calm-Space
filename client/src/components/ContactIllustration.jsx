export default function ContactIllustration() {
  return (
    <svg
      className="page-illustration contact-illustration"
      viewBox="0 0 360 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a person reaching out with a message, phone, and mail icon"
    >
      {/* backdrop */}
      <circle cx="180" cy="200" r="160" fill="var(--pine)" opacity="0.07" />
      <circle cx="270" cy="120" r="60" fill="var(--sage)" opacity="0.16" />
      <circle cx="80" cy="300" r="50" fill="var(--clay)" opacity="0.10" />

      {/* standing figure, faceless */}
      <g className="illus-figure">
        <path d="M130 360 Q124 280 180 274 Q236 280 230 360 Z" fill="var(--pine-deep)" />
        <circle cx="180" cy="234" r="28" fill="var(--clay)" />
        {/* raised arm holding phone */}
        <path d="M212 290 Q248 276 252 244" stroke="var(--pine-deep)" strokeWidth="14" fill="none" strokeLinecap="round" />
        <rect x="238" y="216" width="28" height="46" rx="7" fill="var(--stone-soft)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="252" cy="252" r="2.5" fill="var(--ink)" />
      </g>

      {/* floating message bubble */}
      <g className="illus-bubble">
        <path
          d="M60 130 h96 a14 14 0 0 1 14 14 v36 a14 14 0 0 1 -14 14 h-58 l-20 18 v-18 h-18 a14 14 0 0 1 -14 -14 v-36 a14 14 0 0 1 14 -14 Z"
          fill="var(--stone-soft)"
          stroke="var(--line)"
          strokeWidth="1.5"
        />
        <line x1="80" y1="160" x2="150" y2="160" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" />
        <line x1="80" y1="178" x2="126" y2="178" stroke="var(--sage)" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* floating envelope */}
      <g className="illus-envelope">
        <rect x="252" y="330" width="60" height="42" rx="6" fill="var(--clay)" />
        <path d="M254 332 L282 356 L310 332" stroke="var(--white)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* floor */}
      <line x1="30" y1="374" x2="330" y2="374" stroke="var(--ink)" strokeWidth="2" opacity="0.12" />
    </svg>
  );
}
