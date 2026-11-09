import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LiveDonationsPanel() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  function loadDonations() {
    supabase
      .from('donations')
      .select('donor_name, is_anonymous, amount, created_at')
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setDonations(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadDonations()

    const channel = supabase
      .channel('public-donations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, loadDonations)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0)

  if (loading) return null
  if (donations.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-5 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">लाइव खाता</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">हाल के दान</h2>

        <div className="ledger-plaque mt-8 divide-y divide-gold/15 p-2">
          {donations.map((d, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium text-ink">{d.is_anonymous ? 'गुप्त दानदाता' : d.donor_name || 'एक शुभचिंतक'}</span>
              <span className="font-ledger text-gold-deep">₹{Number(d.amount).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-stone">
          समिति द्वारा दर्ज। यहाँ दिखाए गए आँकड़े सीधे हमारे रिकॉर्ड से लिए जाते हैं।
        </p>
      </div>
    </section>
  )
}
