import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { PersonPlaque } from '../components/LedgerCard'
import { supabase } from '../lib/supabase'

export default function Committee() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      supabase
        .from('committee_members')
        .select('*')
        .order('display_order')
        .order('created_at')
        .then(({ data }) => {
          setMembers(data || [])
          setLoading(false)
        })
    }
    load()

    const channel = supabase
      .channel('public-committee-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'committee_members' }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const president = members.find((m) => m.tier === 'president')
  const officers = members.filter((m) => m.tier === 'officer')
  const executives = members.filter((m) => m.tier === 'member')

  return (
    <>
      <PageHero
        eyebrow="पदाधिकारी"
        title="समिति"
        blurb="संघ के रोज़मर्रा के कामकाज को संभालने वाले पदाधिकारी और कार्यकारिणी सदस्य।"
      />

      {loading ? (
        <p className="py-16 text-center text-stone">समिति की जानकारी लोड हो रही है…</p>
      ) : members.length === 0 ? (
        <p className="py-16 text-center text-stone">समिति की जानकारी जल्द ही यहाँ दिखाई देगी।</p>
      ) : (
        <>
          {president && (
            <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
              <div className="mx-auto max-w-xs">
                <PersonPlaque
                  name={president.name}
                  designation={president.designation}
                  regNo={president.reg_no}
                  photoUrl={president.photo_url}
                  featured
                />
              </div>
            </section>
          )}

          {officers.length > 0 && (
            <section className="bg-cream-deep/60 py-16">
              <div className="mx-auto max-w-6xl px-5 lg:px-8">
                <p className="eyebrow text-center text-maroon/70">पदाधिकारी</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  {officers.map((o) => (
                    <PersonPlaque key={o.id} name={o.name} designation={o.designation} regNo={o.reg_no} photoUrl={o.photo_url} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {executives.length > 0 && (
            <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
              <p className="eyebrow text-center text-maroon/70">कार्यकारिणी समिति</p>
              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {executives.map((m) => (
                  <PersonPlaque key={m.id} name={m.name} designation={m.designation} regNo={m.reg_no} photoUrl={m.photo_url} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
