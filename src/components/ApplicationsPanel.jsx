import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ApplicationsPanel() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function loadData() {
    setLoading(true)
    supabase
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setApplications(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('applications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'membership_applications' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleApprove(app) {
    setError('')
    setSaving(true)

    const { error: insertError } = await supabase.from('members').insert({
      name: app.name,
      phone: app.phone,
      email: app.email,
      address: app.address,
      occupation: app.occupation,
      date_of_birth: app.date_of_birth,
      source: 'website',
    })

    if (insertError) {
      setSaving(false)
      if (insertError.code === '23505') {
        setError(`${app.name}'s phone number is already registered as a member — approve skipped.`)
      } else {
        setError('Could not approve this application. Please try again.')
      }
      return
    }

    await supabase
      .from('membership_applications')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', app.id)

    setSaving(false)
    loadData()
  }

  async function handleReject(app) {
    setSaving(true)
    await supabase
      .from('membership_applications')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', app.id)
    setSaving(false)
    loadData()
  }

  const pending = applications.filter((a) => a.status === 'pending')
  const reviewed = applications.filter((a) => a.status !== 'pending')

  if (loading) return <p className="text-stone">Loading applications…</p>

  return (
    <div className="space-y-8">
      {error && <p className="border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-saffron" />
          <h3 className="font-display text-lg font-semibold text-maroon-deep">
            Pending Review ({pending.length})
          </h3>
        </div>
        <div className="mt-4 space-y-4">
          {pending.map((a) => (
            <div key={a.id} className="ledger-plaque flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="text-sm">
                <p className="font-display text-base font-semibold text-maroon-deep">{a.name}</p>
                <p className="mt-1 text-stone">
                  {[a.phone, a.email].filter(Boolean).join(' · ')}
                </p>
                {a.address && <p className="text-stone">{a.address}</p>}
                {a.occupation && <p className="text-stone">Occupation: {a.occupation}</p>}
                <p className="mt-1 text-xs text-stone">
                  Applied {new Date(a.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(a)}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-4 py-2 text-xs font-semibold text-cream-paper disabled:opacity-60"
                >
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button
                  onClick={() => handleReject(a)}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-sm border border-gold/50 px-4 py-2 text-xs font-medium text-ink hover:border-red-400 disabled:opacity-60"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
          {pending.length === 0 && (
            <p className="ledger-plaque p-5 text-center text-sm text-stone">No applications waiting for review.</p>
          )}
        </div>
      </div>

      {reviewed.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold text-maroon-deep">Reviewed</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Phone</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Reviewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {reviewed.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 pr-4 font-medium text-ink">{a.name}</td>
                    <td className="py-3 pr-4 text-stone">{a.phone}</td>
                    <td className="py-3 pr-4">
                      {a.status === 'approved' ? (
                        <span className="text-xs font-medium text-green-700">Approved</span>
                      ) : (
                        <span className="text-xs font-medium text-red-700">Rejected</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-stone">
                      {a.reviewed_at && new Date(a.reviewed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
