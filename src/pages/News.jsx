import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import PageHero from '../components/PageHero'
import { newsItems } from '../data/content'
import { supabase } from '../lib/supabase'

export default function News() {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    function load() {
      supabase
        .from('notices')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .then(({ data }) => setNotices(data || []))
    }
    load()

    const channel = supabase
      .channel('public-notices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const combined = [
    ...notices.map((n) => ({
      key: `notice-${n.id}`,
      title: n.title,
      summary: n.body,
      date: n.created_at,
      image: n.image_url,
    })),
    ...newsItems.map((item, i) => ({ key: `seed-${i}`, ...item })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      <PageHero
        eyebrow="Announcements"
        title="News &amp; Notices"
        blurb="Circulars, updates and events from the Sangh."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="space-y-6">
          {combined.map((item) => (
            <article key={item.key} className="ledger-plaque animate-rise overflow-hidden p-0">
              {item.image && <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />}
              <div className="p-6">
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
                {item.summary && <p className="mt-2 leading-relaxed text-stone">{item.summary}</p>}
              </div>
            </article>
          ))}
          {combined.length === 0 && <p className="text-center text-stone">No news or notices yet.</p>}
        </div>
      </section>
    </>
  )
}
