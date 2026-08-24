/**
 * Star rating. Two modes:
 * - interactive (pass `value` + `onChange`): clickable input for the feedback form
 * - read-only (pass `value` only): display, used on testimonial cards
 */
export default function StarRating({ value = 0, onChange, size = 22 }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  return (
    <div className={`star-rating ${interactive ? "star-rating-interactive" : ""}`} role={interactive ? "radiogroup" : undefined} aria-label="Rating out of 5">
      {stars.map((n) => (
        <button
          type="button"
          key={n}
          className={`star ${n <= value ? "star-filled" : ""}`}
          style={{ fontSize: size }}
          onClick={interactive ? () => onChange(n) : undefined}
          disabled={!interactive}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={interactive ? n <= value : undefined}
        >
          ★
        </button>
      ))}
    </div>
  );
}
