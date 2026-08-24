export default function BookingIllustration() {
  return (
    <svg
      className="page-illustration booking-illustration"
      viewBox="0 0 360 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a calendar with a confirmed date and a clock, representing scheduling a session"
    >
      {/* backdrop */}
      <circle cx="180" cy="150" r="140" fill="var(--pine)" opacity="0.07" />
      <circle cx="80" cy="80" r="46" fill="var(--clay)" opacity="0.10" />

      {/* calendar */}
      <g className="illus-calendar">
        <rect x="90" y="70" width="180" height="160" rx="14" fill="var(--stone-soft)" stroke="var(--pine-deep)" strokeWidth="2.5" />
        <rect x="90" y="70" width="180" height="40" rx="14" fill="var(--pine)" />
        <rect x="120" y="56" width="10" height="28" rx="4" fill="var(--pine-deep)" />
        <rect x="230" y="56" width="10" height="28" rx="4" fill="var(--pine-deep)" />

        {/* grid dots */}
        <circle cx="120" cy="140" r="6" fill="var(--line)" />
        <circle cx="150" cy="140" r="6" fill="var(--line)" />
        <circle cx="180" cy="140" r="6" fill="var(--line)" />
        <circle cx="210" cy="140" r="6" fill="var(--line)" />
        <circle cx="240" cy="140" r="6" fill="var(--line)" />

        <circle cx="120" cy="170" r="6" fill="var(--line)" />
        <circle cx="150" cy="170" r="6" fill="var(--line)" />
        <circle cx="180" cy="170" r="10" fill="var(--clay)" className="illus-selected-day" />
        <circle cx="210" cy="170" r="6" fill="var(--line)" />
        <circle cx="240" cy="170" r="6" fill="var(--line)" />

        <circle cx="120" cy="200" r="6" fill="var(--line)" />
        <circle cx="150" cy="200" r="6" fill="var(--line)" />
        <circle cx="180" cy="200" r="6" fill="var(--line)" />
        <circle cx="210" cy="200" r="6" fill="var(--line)" />
        <circle cx="240" cy="200" r="6" fill="var(--line)" />
      </g>

      {/* floating clock */}
      <g className="illus-clock">
        <circle cx="290" cy="200" r="34" fill="var(--sage)" />
        <line x1="290" y1="200" x2="290" y2="182" stroke="var(--white)" strokeWidth="4" strokeLinecap="round" />
        <line x1="290" y1="200" x2="303" y2="206" stroke="var(--white)" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* floating confirmed badge */}
      <g className="illus-badge">
        <circle cx="66" cy="200" r="24" fill="var(--pine)" />
        <path d="M54 200 l9 9 l17 -19" stroke="var(--white)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}
