export default function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a person relaxing in a chair during a warm, supportive conversation"
    >
      {/* soft backdrop blobs */}
      <circle cx="250" cy="235" r="205" fill="var(--pine)" opacity="0.08" />
      <circle cx="330" cy="150" r="90" fill="var(--sage)" opacity="0.16" />
      <circle cx="120" cy="330" r="70" fill="var(--clay)" opacity="0.10" />

      {/* rug + floor */}
      <ellipse cx="255" cy="404" rx="160" ry="16" fill="var(--pine)" opacity="0.08" />
      <line x1="50" y1="404" x2="460" y2="404" stroke="var(--ink)" strokeWidth="2" opacity="0.12" />

      {/* plant, clean rounded leaves instead of branch lines */}
      <g className="illus-plant">
        <rect x="96" y="352" width="56" height="12" rx="4" fill="var(--pine-deep)" />
        <rect x="118" y="300" width="12" height="56" rx="4" fill="var(--pine-deep)" />
        <ellipse cx="124" cy="300" rx="10" ry="34" fill="var(--pine)" transform="rotate(-18 124 300)" />
        <ellipse cx="124" cy="300" rx="10" ry="34" fill="var(--pine)" transform="rotate(18 124 300)" />
        <ellipse cx="124" cy="290" rx="10" ry="38" fill="var(--pine)" />
        <ellipse cx="124" cy="288" rx="7" ry="24" fill="var(--clay)" opacity="0.8" />
      </g>

      {/* armchair */}
      <g className="illus-chair">
        <rect x="222" y="268" width="168" height="100" rx="20" fill="var(--pine-deep)" />
        <rect x="204" y="244" width="42" height="128" rx="18" fill="var(--pine)" />
        <rect x="386" y="244" width="42" height="128" rx="18" fill="var(--pine)" />
        <rect x="230" y="336" width="152" height="24" rx="10" fill="var(--pine-deep)" />
        <rect x="226" y="232" width="156" height="54" rx="20" fill="var(--pine)" />
      </g>

      {/* seated figure, abstract/faceless */}
      <g className="illus-figure">
        <path
          d="M258 372 Q252 320 306 316 Q360 320 354 372 Z"
          fill="var(--clay-deep)"
        />
        <circle cx="306" cy="278" r="26" fill="var(--clay)" />
        {/* resting arm + mug */}
        <path d="M340 320 Q368 322 372 350" stroke="var(--clay-deep)" strokeWidth="14" fill="none" strokeLinecap="round" />
        <rect x="364" y="350" width="24" height="20" rx="5" fill="var(--stone-soft)" stroke="var(--pine-deep)" strokeWidth="2" />
        <path d="M388 356 q9 0 9 7 q0 7 -9 7" fill="none" stroke="var(--pine-deep)" strokeWidth="2" />
      </g>

      {/* conversation bubble, floating above */}
      <g className="illus-bubble">
        <path
          d="M118 150 h108 a16 16 0 0 1 16 16 v40 a16 16 0 0 1 -16 16 h-70 l-22 20 v-20 h-16 a16 16 0 0 1 -16 -16 v-40 a16 16 0 0 1 16 -16 Z"
          fill="var(--stone-soft)"
          stroke="var(--line)"
          strokeWidth="1.5"
        />
        <circle cx="152" cy="188" r="7" fill="var(--clay)" />
        <circle cx="178" cy="188" r="7" fill="var(--sage)" />
        <circle cx="204" cy="188" r="7" fill="var(--pine)" />
      </g>

      {/* confirmed-session badge, floating top right */}
      <g className="illus-badge">
        <circle cx="410" cy="120" r="34" fill="var(--sage)" />
        <path
          d="M396 120 l10 10 l20 -22"
          stroke="var(--white)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* tiny decorative accents */}
      <circle className="illus-dot" cx="70" cy="140" r="5" fill="var(--clay)" opacity="0.7" />
      <circle className="illus-dot" cx="430" cy="240" r="6" fill="var(--pine)" opacity="0.6" />
      <circle className="illus-dot" cx="60" cy="250" r="4" fill="var(--sage)" opacity="0.8" />
    </svg>
  );
}
