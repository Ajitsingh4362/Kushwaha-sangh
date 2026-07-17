export default function PageHero({ eyebrow, title, blurb }) {
  return (
    <section className="relative overflow-hidden bg-maroon-deep py-16 text-center text-cream-paper">
      <div className="bg-noise absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-3xl px-5">
        {eyebrow && <p className="eyebrow text-gold-light">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        {blurb && <p className="mx-auto mt-4 max-w-xl text-cream/75">{blurb}</p>}
      </div>
      <div className="ledger-rule absolute bottom-0 left-0 right-0 opacity-40" />
    </section>
  )
}
