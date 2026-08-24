export default function AboutIllustration() {
  return (
    <svg
      className="page-illustration about-illustration"
      viewBox="0 0 480 420"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a person sitting calmly with a journal, surrounded by symbols of growth and reflection"
    >
      {/* backdrop */}
      <circle cx="240" cy="210" r="190" fill="var(--pine)" opacity="0.08" />
      <circle cx="330" cy="120" r="70" fill="var(--sage)" opacity="0.16" />

      {/* sun rays behind figure */}
      <g className="illus-rays" opacity="0.5">
        <circle cx="240" cy="180" r="86" fill="none" stroke="var(--sage)" strokeWidth="2" strokeDasharray="4 10" />
      </g>

      {/* growth sprout, left */}
      <g className="illus-sprout">
        <rect x="118" y="330" width="10" height="46" rx="4" fill="var(--pine-deep)" />
        <path d="M123 330 C100 316 96 292 108 274" stroke="var(--pine)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M123 330 C146 312 150 288 138 268" stroke="var(--pine)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M123 330 C121 300 123 276 123 258" stroke="var(--pine)" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>

      {/* seated figure, cross-legged, reading a journal */}
      <g className="illus-figure">
        <path d="M186 372 Q182 320 240 316 Q298 320 294 372 Z" fill="var(--clay-deep)" />
        <circle cx="240" cy="270" r="27" fill="var(--clay)" />
        {/* legs, cross-legged */}
        <path d="M196 372 Q200 350 240 350 Q280 350 284 372 Z" fill="var(--pine-deep)" opacity="0.9" />
        {/* journal */}
        <rect x="214" y="330" width="52" height="36" rx="4" fill="var(--stone-soft)" stroke="var(--pine-deep)" strokeWidth="2" />
        <line x1="240" y1="330" x2="240" y2="366" stroke="var(--pine-deep)" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* floating heart, emotional wellbeing */}
      <g className="illus-heart">
        <path
          d="M356 152 C356 140 372 140 372 154 C372 140 388 140 388 152 C388 168 372 180 372 180 C372 180 356 168 356 152 Z"
          fill="var(--clay)"
        />
      </g>

      {/* floating lightbulb, motivation / insight */}
      <g className="illus-bulb">
        <circle cx="108" cy="150" r="20" fill="var(--sage)" />
        <rect x="101" y="168" width="14" height="10" rx="3" fill="var(--pine-deep)" />
        <line x1="108" y1="126" x2="108" y2="118" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" />
        <line x1="86" y1="150" x2="78" y2="150" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" />
        <line x1="130" y1="150" x2="138" y2="150" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* floor + rug */}
      <ellipse cx="240" cy="392" rx="150" ry="14" fill="var(--pine)" opacity="0.1" />
      <line x1="60" y1="392" x2="420" y2="392" stroke="var(--ink)" strokeWidth="2" opacity="0.12" />
    </svg>
  );
}
