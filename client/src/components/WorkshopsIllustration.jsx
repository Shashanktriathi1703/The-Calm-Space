export default function WorkshopsIllustration() {
  return (
    <svg
      className="page-illustration workshops-illustration"
      viewBox="0 0 480 340"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a small group sitting together around a shared board during a workshop"
    >
      {/* backdrop */}
      <ellipse cx="240" cy="170" rx="220" ry="150" fill="var(--pine)" opacity="0.07" />
      <circle cx="90" cy="80" r="60" fill="var(--clay)" opacity="0.10" />
      <circle cx="400" cy="90" r="50" fill="var(--sage)" opacity="0.16" />

      {/* shared board */}
      <g className="illus-board">
        <rect x="168" y="60" width="144" height="104" rx="10" fill="var(--stone-soft)" stroke="var(--pine-deep)" strokeWidth="2" />
        <line x1="188" y1="90" x2="260" y2="90" stroke="var(--pine)" strokeWidth="6" strokeLinecap="round" />
        <line x1="188" y1="110" x2="292" y2="110" stroke="var(--sage)" strokeWidth="6" strokeLinecap="round" />
        <line x1="188" y1="130" x2="244" y2="130" stroke="var(--clay)" strokeWidth="6" strokeLinecap="round" />
        <rect x="220" y="164" width="40" height="14" rx="4" fill="var(--pine-deep)" />
      </g>

      {/* three abstract seated people around the board */}
      <g className="illus-person-a">
        <path d="M84 300 Q80 258 122 254 Q164 258 160 300 Z" fill="var(--pine-deep)" />
        <circle cx="122" cy="222" r="22" fill="var(--pine)" />
      </g>

      <g className="illus-person-b">
        <path d="M210 314 Q206 268 250 264 Q294 268 290 314 Z" fill="var(--clay-deep)" />
        <circle cx="250" cy="230" r="24" fill="var(--clay)" />
      </g>

      <g className="illus-person-c">
        <path d="M336 300 Q332 258 374 254 Q416 258 412 300 Z" fill="var(--pine-deep)" />
        <circle cx="374" cy="222" r="22" fill="var(--sage)" />
      </g>

      {/* floor */}
      <line x1="40" y1="316" x2="440" y2="316" stroke="var(--ink)" strokeWidth="2" opacity="0.12" />

      {/* floating idea + clock accents */}
      <g className="illus-idea">
        <circle cx="420" cy="220" r="18" fill="var(--sage)" />
        <line x1="420" y1="196" x2="420" y2="188" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" />
        <line x1="398" y1="220" x2="390" y2="220" stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="illus-clock">
        <circle cx="52" cy="200" r="20" fill="var(--stone-soft)" stroke="var(--pine-deep)" strokeWidth="2.5" />
        <line x1="52" y1="200" x2="52" y2="188" stroke="var(--pine-deep)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="52" y1="200" x2="61" y2="203" stroke="var(--pine-deep)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
