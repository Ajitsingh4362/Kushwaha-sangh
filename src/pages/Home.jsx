import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Users } from 'lucide-react'
import { site, stats, pillars, newsItems } from '../data/content'
import { StatPlaque } from '../components/LedgerCard'
import { OrnamentDivider } from '../components/Ornament'

export default function Home() {
  return (
    <>
      {/* HERO — the thesis: a registry stamp affirming the Sangh's standing + mission */}
      <section className="relative overflow-hidden bg-maroon-deep text-cream-paper">
        <div className="bg-noise absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28 lg:px-8">
          <div>
            <p className="eyebrow text-gold-light">Est. {site.established} · Regd. Community Welfare Association</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/80">{site.mission}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/membership"
                className="flex items-center gap-2 rounded-sm bg-saffron px-6 py-3 font-semibold text-maroon-deep transition hover:bg-saffron-light"
              >
                Become a Member <ArrowRight size={18} />
              </Link>
              <Link
                to="/donate"
                className="flex items-center gap-2 rounded-sm border border-gold/70 px-6 py-3 font-semibold text-cream-paper transition hover:bg-cream-paper/10"
              >
                Support Our Work
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="ledger-plaque animate-stamp -rotate-3 p-8 text-center">
              <div className="ledger-number">Official Registry</div>
              <div className="mt-3 grid h-20 w-20 mx-auto place-items-center rounded-full border-2 border-gold-deep bg-maroon-deep">
                <span className="font-display text-2xl font-bold text-gold">KS</span>
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-maroon-deep">{site.name}</p>
              <OrnamentDivider className="mx-auto mt-3 h-4 w-32 text-gold-deep/70" />
              <p className="mt-3 text-sm text-stone">
                Serving the community since {site.established} through welfare, education and mutual support.
              </p>
            </div>
          </div>
        </div>
        <div className="ledger-rule absolute bottom-0 left-0 right-0 opacity-40" />
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <StatPlaque key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-maroon/70">What We Do</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep sm:text-4xl">
              Samaj Welfare Programs
            </h2>
            <p className="mt-3 text-stone">
              The three pillars our members and donors support most directly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <Link
                key={p.id}
                to={`/welfare#${p.id}`}
                className="ledger-plaque animate-rise group flex flex-col p-7 transition hover:-translate-y-1"
              >
                <span className="font-ledger text-sm text-gold-deep/70">{p.number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-maroon-deep">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">{p.blurb}</p>
                <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-saffron">
                  Learn more
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS PREVIEW */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-maroon/70">Stay Informed</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">Latest News</h2>
          </div>
          <Link to="/news" className="flex items-center gap-1.5 text-sm font-medium text-saffron hover:underline">
            View all notices <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {newsItems.slice(0, 3).map((item) => (
            <article key={item.title} className="border-l-2 border-gold/50 pl-5">
              <time className="font-ledger text-xs uppercase tracking-wide text-stone">
                {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </time>
              <h3 className="mt-1.5 font-display text-lg font-semibold text-maroon-deep">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      {/* DONATE BANNER */}
      <section className="bg-maroon-deep py-14 text-cream-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center lg:flex-row lg:justify-between lg:text-left lg:px-8">
          <div className="flex items-center gap-4">
            <HeartHandshake size={40} className="shrink-0 text-saffron" />
            <div>
              <h2 className="font-display text-2xl font-bold">Every contribution keeps a program running</h2>
              <p className="mt-1 text-cream/70">Support the hostel, health fund, and achiever scholarships.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/donate"
              className="rounded-sm bg-saffron px-6 py-3 font-semibold text-maroon-deep hover:bg-saffron-light"
            >
              Donate Now
            </Link>
            <Link
              to="/membership"
              className="flex items-center gap-2 rounded-sm border border-gold/60 px-6 py-3 font-semibold hover:bg-cream-paper/10"
            >
              <Users size={18} /> Join Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
