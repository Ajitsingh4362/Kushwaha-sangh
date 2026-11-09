import { useEffect, useState } from 'react'
import { PersonPlaque } from './LedgerCard'
import { supabase } from '../lib/supabase'
import { nameToHindi, designationToHindi } from '../lib/toHindi'

// Office-bearers (अध्यक्ष, सचिव, कोषाध्यक्ष …) and executive members,
// as managed in the admin panel's Committee section.
export default function CommitteeSection() {
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

  if (loading || members.length === 0) return null

  const plaque = (m, featured = false) => (
    <PersonPlaque
      key={m.id}
      name={nameToHindi(m.name)}
      designation={designationToHindi(m.designation)}
      regNo={m.reg_no}
      photoUrl={m.photo_url}
      featured={featured}
    />
  )
  const president = members.find((m) => m.tier === 'president')
  const officers = members.filter((m) => m.tier === 'officer')
  const executives = members.filter((m) => m.tier === 'member')

  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
        <div className="text-center">
          <p className="eyebrow text-maroon/70">पदाधिकारी</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">संघ की समिति</h2>
        </div>

        {president && <div className="mx-auto mt-8 max-w-[15rem]">{plaque(president, true)}</div>}

        {officers.length > 0 && (
          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-3">{officers.map((o) => plaque(o))}</div>
        )}

        {executives.length > 0 && (
          <>
            <p className="eyebrow mt-12 text-center text-maroon/70">कार्यकारिणी समिति</p>
            <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {executives.map((m) => plaque(m))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
