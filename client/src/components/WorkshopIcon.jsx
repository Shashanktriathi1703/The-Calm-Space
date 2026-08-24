const ICONS = {
  compass: (
    <>
      <circle cx="24" cy="24" r="15" fill="none" stroke="var(--white)" strokeWidth="2.5" />
      <path d="M29 19 L21 21 L19 29 L27 27 Z" fill="var(--white)" />
    </>
  ),
  brain: (
    <>
      <path
        d="M16 20 a8 8 0 0 1 8 -8 a6 6 0 0 1 6 6 a7 7 0 0 1 4 6.5 a6 6 0 0 1 -3 5.2 a7 7 0 0 1 -7 5.3 a8 8 0 0 1 -8 -8 a6 6 0 0 1 0 -6.9 Z"
        fill="none"
        stroke="var(--white)"
        strokeWidth="2.2"
      />
      <line x1="24" y1="15" x2="24" y2="33" stroke="var(--white)" strokeWidth="1.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="24" cy="24" r="15" fill="none" stroke="var(--white)" strokeWidth="2.5" />
      <line x1="24" y1="24" x2="24" y2="15" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="24" y1="24" x2="31" y2="27" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  shield: (
    <path
      d="M24 10 L36 15 V24 C36 32 30 37 24 39 C18 37 12 32 12 24 V15 Z M18 24 L22 28 L30 19"
      fill="none"
      stroke="var(--white)"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  waves: (
    <>
      <path d="M12 20 q6 -8 12 0 t12 0" fill="none" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 28 q6 -8 12 0 t12 0" fill="none" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  lotus: (
    <>
      <path d="M24 34 C14 34 12 24 16 18 C19 24 22 27 24 34 Z" fill="var(--white)" />
      <path d="M24 34 C34 34 36 24 32 18 C29 24 26 27 24 34 Z" fill="var(--white)" />
      <path d="M24 34 C24 22 20 16 24 12 C28 16 24 22 24 34 Z" fill="var(--white)" opacity="0.85" />
    </>
  ),
};

export default function WorkshopIcon({ type = "compass" }) {
  return (
    <svg className="workshop-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="var(--pine)" />
      {ICONS[type] || ICONS.compass}
    </svg>
  );
}
