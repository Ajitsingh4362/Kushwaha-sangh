const activityPlaceholders = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  label: `Activity ${i + 1}`,
}))

export default function Activities() {
  // Duplicate the list so the CSS animation can loop seamlessly.
  const track = [...activityPlaceholders, ...activityPlaceholders]

  return (
    <section className="overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">Moments &amp; Milestones</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">Activities</h2>
      </div>

      <div className="group relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-[scroll-x_28s_linear_infinite] gap-5 group-hover:[animation-play-state:paused]">
          {track.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex h-40 w-60 shrink-0 flex-col items-center justify-center gap-1.5 border border-dashed border-gold/50 bg-cream-deep/50 text-center text-stone/70"
            >
              <span className="text-xs">{item.label}</span>
              <span className="text-[0.65rem]">Replace with a real photo</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
