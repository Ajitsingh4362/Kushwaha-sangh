import { useEffect, useState } from 'react'
import { Plus, Globe, CheckCircle2, Landmark, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

function DonationRow({ d, onVerify, saving }) {
  return (
    <tr>
      <td className="py-3 pr-4 text-stone">
        {new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3 pr-4 font-medium text-ink">
        {d.is_anonymous ? 'Anonymous' : d.members?.name || d.donor_name || '—'}
      </td>
      <td className="py-3 pr-4 text-xs text-stone">
        {[d.donor_email, d.donor_phone].filter(Boolean).join(' / ') || '—'}
      </td>
      <td className="py-3 pr-4 text-ink">₹{Number(d.amount).toLocaleString('en-IN')}</td>
      <td className="py-3">
        {d.status === 'verified' ? (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle2 size={14} /> Verified
          </span>
        ) : (
          <button
            onClick={() => onVerify(d.id)}
            disabled={saving}
            className="rounded-sm border border-gold/50 px-3 py-1.5 text-xs font-medium text-ink hover:border-saffron disabled:opacity-60"
          >
            Mark Verified
          </button>
        )}
      </td>
    </tr>
  )
}

export default function DonationsPanel() {
  const [donations, setDonations] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showManualForm, setShowManualForm] = useState(false)
  const [donorType, setDonorType] = useState('member')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState({
    member_id: '',
    donor_name: '',
    amount: '',
    is_anonymous: false,
    note: '',
  })

  function loadData() {
    setLoading(true)
    Promise.all([
      supabase.from('donations').select('*, members(name)').order('created_at', { ascending: false }),
      supabase.from('members').select('id, name').order('name'),
    ]).then(([{ data: donationsData }, { data: membersData }]) => {
      setDonations(donationsData || [])
      setMembers(membersData || [])
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('donations-tab-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function markVerified(id) {
    setSaving(true)
    await supabase.from('donations').update({ status: 'verified' }).eq('id', id)
    setSaving(false)
    loadData()
  }

  async function handleAddManual(e) {
    e.preventDefault()
    if (!form.amount) return
    if (donorType === 'member' && !form.member_id) return
    setSaving(true)

    const selectedMember = members.find((m) => m.id === form.member_id)

    await supabase.from('donations').insert({
      member_id: donorType === 'member' ? form.member_id : null,
      donor_name: form.is_anonymous ? null : donorType === 'member' ? selectedMember?.name : form.donor_name || null,
      is_anonymous: form.is_anonymous,
      amount: parseFloat(form.amount),
      note: form.note || null,
      payment_method: 'manual',
      status: 'verified',
    })

    setForm({ member_id: '', donor_name: '', amount: '', is_anonymous: false, note: '' })
    setSaving(false)
    loadData()
  }

  function matchesSearchAndStatus(d) {
    const q = search.toLowerCase()
    const name = d.is_anonymous ? 'anonymous' : (d.members?.name || d.donor_name || '').toLowerCase()
    const contact = [d.donor_email, d.donor_phone].filter(Boolean).join(' ').toLowerCase()
    const matchesSearch = !q || name.includes(q) || contact.includes(q)
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter
    return matchesSearch && matchesStatus
  }

  // Website submissions = anything that came through the public "Donate Now" flow
  const websiteDonations = donations.filter((d) => d.payment_method === 'upi_qr').filter(matchesSearchAndStatus)
  const manualDonations = donations.filter((d) => d.payment_method !== 'upi_qr').filter(matchesSearchAndStatus)

  const verifiedTotal = donations.filter((d) => d.status === 'verified').reduce((sum, d) => sum + Number(d.amount), 0)
  const pendingCount = websiteDonations.filter((d) => d.status === 'declared').length

  if (loading) return <p className="text-stone">Loading donations…</p>

  return (
    <div className="space-y-10">
      {/* SEARCH & FILTER */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            placeholder="Search donor name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[240px] border border-gold/40 bg-cream-paper py-1.5 pl-8 pr-3 text-sm text-ink focus:border-saffron"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gold/40 bg-cream-paper px-3 py-1.5 text-sm text-ink focus:border-saffron"
        >
          <option value="all">All statuses</option>
          <option value="verified">Verified</option>
          <option value="declared">Awaiting verification</option>
        </select>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Verified Total</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">
            ₹{verifiedTotal.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">From Website</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{websiteDonations.length}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className={`ledger-number ${pendingCount > 0 ? 'text-red-700' : ''}`}>Awaiting Verification</span>
          <p className={`mt-1 font-display text-2xl font-bold ${pendingCount > 0 ? 'text-red-700' : 'text-maroon-deep'}`}>
            {pendingCount}
          </p>
        </div>
      </div>

      {/* WEBSITE SUBMISSIONS — the primary, live-updating feed */}
      <div>
        <div className="flex items-center gap-2.5">
          <Globe size={18} className="text-saffron" />
          <h3 className="font-display text-lg font-semibold text-maroon-deep">Donations from the Website</h3>
        </div>
        <p className="mt-1 text-sm text-stone">
          These come in automatically from the &ldquo;Donate Now&rdquo; form on the site. Check each payment
          against the bank/UPI statement, then click <strong>Mark Verified</strong>.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Donor</th>
                <th className="py-2 pr-4 font-medium">Contact</th>
                <th className="py-2 pr-4 font-medium">Amount</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/15">
              {websiteDonations.map((d) => (
                <DonationRow key={d.id} d={d} onVerify={markVerified} saving={saving} />
              ))}
              {websiteDonations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-stone">
                    {donations.filter((d) => d.payment_method === 'upi_qr').length === 0
                      ? 'No website donations yet — they\u2019ll appear here the moment someone uses \u201cDonate Now\u201d on the site.'
                      : 'No donations match your search/filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL / CASH ENTRIES — secondary, collapsed by default */}
      <div className="border-t border-gold/25 pt-8">
        <button
          type="button"
          onClick={() => setShowManualForm((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-maroon-deep"
        >
          <Landmark size={16} className="text-saffron" />
          Record a Cash / Offline Donation
          {showManualForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showManualForm && (
          <form onSubmit={handleAddManual} className="ledger-plaque mt-4 space-y-4 p-6">
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={donorType === 'member'}
                  onChange={() => setDonorType('member')}
                  className="accent-maroon"
                />
                A Sangh member
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  checked={donorType === 'other'}
                  onChange={() => setDonorType('other')}
                  className="accent-maroon"
                />
                Someone else
              </label>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              {donorType === 'member' ? (
                <div className="min-w-[200px] flex-1">
                  <label htmlFor="member_id" className="mb-1.5 block text-sm font-medium text-maroon-deep">
                    Member
                  </label>
                  <select
                    id="member_id"
                    value={form.member_id}
                    onChange={(e) => setForm((v) => ({ ...v, member_id: e.target.value }))}
                    className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
                  >
                    <option value="">Select a member…</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Field
                  id="donor_name"
                  label="Donor Name"
                  type="text"
                  value={form.donor_name}
                  disabled={form.is_anonymous}
                  onChange={(e) => setForm((v) => ({ ...v, donor_name: e.target.value }))}
                  className="min-w-[160px] flex-1"
                />
              )}
              <Field
                id="amount"
                label="Amount (₹)"
                type="number"
                value={form.amount}
                onChange={(e) => setForm((v) => ({ ...v, amount: e.target.value }))}
                className="w-32"
              />
              <Field
                id="note"
                label="Note (optional)"
                type="text"
                value={form.note}
                onChange={(e) => setForm((v) => ({ ...v, note: e.target.value }))}
                className="min-w-[160px] flex-1"
              />
              <label className="flex items-center gap-2 pb-2.5 text-sm text-stone">
                <input
                  type="checkbox"
                  checked={form.is_anonymous}
                  onChange={(e) => setForm((v) => ({ ...v, is_anonymous: e.target.checked }))}
                  className="accent-maroon"
                />
                Anonymous
              </label>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </form>
        )}
      </div>

      {manualDonations.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold text-maroon-deep">Cash / Offline History</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Donor</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {manualDonations.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 pr-4 text-stone">
                      {new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 pr-4 font-medium text-ink">
                      {d.is_anonymous ? 'Anonymous' : d.members?.name || d.donor_name || '—'}
                    </td>
                    <td className="py-3 pr-4 text-ink">₹{Number(d.amount).toLocaleString('en-IN')}</td>
                    <td className="py-3 text-stone">{d.note || '—'}</td>
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
