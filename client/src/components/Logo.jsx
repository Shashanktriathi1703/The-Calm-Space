/**
 * Brand mark for The Calm Space (Dr. Kanchan Shukla Pandey's practice).
 *
 * Renders the actual client-provided badge artwork (circular logo with the
 * "Calm Space" script wordmark, tagline and laurel baked in) rather than a
 * cropped-icon substitute. The badge is a self-contained emblem -- it
 * already carries its own white backing and border ring -- so it reads
 * cleanly at navbar size without needing an extra chip or a duplicate text
 * lockup next to it. `showWordmark` is available for spots (like a footer)
 * where an additional plain-text name is useful.
 */
export default function Logo({ size = 64, showWordmark = false, onDark = false, className = "" }) {
  return (
    <span className={`logo-lockup ${className}`}>
      <span className="logo-badge" style={{ width: size, height: size }}>
        <img
          src="/images/logo.png"
          alt="The Calm Space — Psychology Clinic"
          width={size}
          height={size}
        />
      </span>
      {showWordmark && (
        <span className={`logo-wordmark ${onDark ? "logo-wordmark-light" : ""}`}>The Calm Space</span>
      )}
    </span>
  );
}
