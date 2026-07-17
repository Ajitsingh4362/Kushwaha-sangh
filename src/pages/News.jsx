import { CalendarDays } from 'lucide-react'
import PageHero from '../components/PageHero'
import { newsItems } from '../data/content'

export default function News() {
  return (
    <>
      <PageHero
        eyebrow="Announcements"
        title="News &amp; Notices"
        blurb="Circulars, updates and events from the Sangh."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="space-y-6">
          {newsItems.map((item) => (
            <article key={item.title} className="ledger-plaque animate-rise p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gold-deep">
                <CalendarDays size={15} />
                <time>
                  {new Date(item.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold text-maroon-deep">{item.title}</h2>
              <p className="mt-2 leading-relaxed text-stone">{item.summary}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-stone">
          Once the admin panel is connected, the committee can publish new notices directly from
          here without a developer.
        </p>
      </section>
    </>
  )
}
