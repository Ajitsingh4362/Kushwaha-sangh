import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Users } from 'lucide-react'
import { site, stats, pillars, newsItems } from '../data/content'
import { StatPlaque } from '../components/LedgerCard'
import heroBanner from '../assets/hero-banner.jpg'
import DonateQRButton from '../components/DonateQRButton'
import Activities from '../components/Activities'

export default function Home() {
  return (
    <>
      {/* HERO — just the image */}
      <section className="relative overflow-hidden bg-maroon-deep">
        <img
          src={heroBanner}
          alt="Sitamarhi Kushwaha Sangh community gathering"
          className="h-full w-full object-cover"
        />
        <div className="ledger-rule absolute bottom-0 left-0 right-0 opacity-40" />
      </section>

      <DonateQRButton />

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

      <Activities />

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
