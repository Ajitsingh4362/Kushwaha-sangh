const lines = [
  'Ekta aur Sangathan hi hamari Shakti hai',
  'Together we rise, together we serve',
  'Education today, empowerment tomorrow',
  'No one has ever become poor by giving',
  'Every member matters, every voice counts',
  'Small contributions, lasting change',
  'Community first, always',
  'Building a future our children can be proud of',
]

export default function MarqueeStrip() {
  const track = [...lines, ...lines]

  return (
    <div className="overflow-hidden border-y border-gold/30 bg-maroon-deep py-3">
      <div className="flex w-max animate-[scroll-x_32s_linear_infinite] items-center gap-10">
        {track.map((line, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-sm tracking-wide text-cream-paper sm:text-base">
            {line}
            <span className="text-gold" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
