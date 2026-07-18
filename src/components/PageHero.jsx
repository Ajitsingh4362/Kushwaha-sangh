import { CornerFlourish, OrnamentDivider } from './Ornament'

export default function PageHero({ eyebrow, title, blurb }) {
  return (
    <section className="relative overflow-hidden bg-maroon-deep py-16 text-center text-cream-paper sm:py-20">
      <div className="bg-noise absolute inset-0 opacity-40" />

      {/* Repeating diamond lattice motif for texture */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 22px, currentColor 22px, currentColor 23px), repeating-linear-gradient(-45deg, transparent, transparent 22px, currentColor 22px, currentColor 23px)',
          color: '#C0973B',
        }}
      />

      {/* Soft radial glow behind the heading */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/20 blur-3xl" />

      <CornerFlourish className="absolute left-4 top-4 h-10 w-10 text-gold/70 sm:left-8 sm:top-8" />
      <CornerFlourish className="absolute right-4 top-4 h-10 w-10 -scale-x-100 text-gold/70 sm:right-8 sm:top-8" />
      <CornerFlourish className="absolute bottom-4 left-4 h-10 w-10 -scale-y-100 text-gold/70 sm:bottom-8 sm:left-8" />
      <CornerFlourish className="absolute bottom-4 right-4 h-10 w-10 -scale-x-100 -scale-y-100 text-gold/70 sm:bottom-8 sm:right-8" />

      <div className="relative mx-auto max-w-3xl px-5">
        {eyebrow && <p className="eyebrow text-gold-light">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        <OrnamentDivider className="mx-auto mt-5 h-4 w-40 text-gold-light/70" />
        {blurb && <p className="mx-auto mt-5 max-w-xl text-cream/75">{blurb}</p>}
      </div>
      <div className="ledger-rule absolute bottom-0 left-0 right-0 opacity-40" />
    </section>
  )
}
