// A restrained, hand-drawn-feeling paisley/leaf motif used sparingly
// as a section divider — a nod to community-hall textile borders
// without leaning on any specific religious iconography.
export function OrnamentDivider({ className = '' }) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M0 12 H90" />
        <path d="M150 12 H240" />
        <path d="M120 12 c0 -7 6 -10 10 -10 c5 0 6 5 2 7 c5 -3 10 0 8 5 c-2 4 -8 4 -10 0 c-1 4 -6 6 -10 3 c-4 -3 -3 -8 0 -5Z" />
        <circle cx="105" cy="12" r="2" />
        <circle cx="135" cy="12" r="2" />
      </g>
    </svg>
  )
}

export function CornerFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <path
        d="M4 4 C 4 26, 26 4, 4 4 M4 4 C 26 4, 4 26, 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M8 20 Q 8 8 20 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="20" cy="8" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
