import { useEffect, useState } from 'react'
import { Users, HeartHandshake, Hourglass, ShieldCheck, Wallet } from 'lucide-react'
import { supabase } from '../lib/supabase'

function currentMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function StatCard({ icon: Icon, value, label, sub, accent = 'text-maroon-deep' }) {
  return (
    <div className="ledger-plaque flex flex-col gap-3 p-5">
      <span className={`grid h-9 w-9 place-items-center rounded-sm bg-cream ${accent}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className={`font-display text-2xl font-bold ${accent}`}>{value}</p>
        <p className="eyebrow mt-0.5 text-stone">{label}</p>
        {sub && <p className="mt-1 text-xs text-stone">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const month = currentMonthStart()
      const [
        { count: memberCount },
        { data: monthDues },
        { data: verifiedDonations },
        { count: pendingVerification },
        { data: thisMonthDonations },
      ] = await Promise.all([
        supabase.from('members').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('dues').select('status, amount').eq('due_month', month),
        supabase.from('donations').select('amount').eq('status', 'verified'),
        supabase.from('donations').select('*', { count: 'exact', head: true }).eq('status', 'declared'),
        supabase
          .from('donations')
          .select('amount')
          .eq('status', 'verified')
          .gte('created_at', month),
      ])

      const unpaidThisMonth = (monthDues || []).filter((d) => d.status !== 'verified').length
      const collectedThisMonthDues = (monthDues || []).filter((d) => d.status === 'verified').reduce((s, d) => s + Number(d.amount), 0)
      const totalRaised = (verifiedDonations || []).reduce((sum, d) => sum + Number(d.amount), 0)
      const raisedThisMonth = (thisMonthDonations || []).reduce((sum, d) => sum + Number(d.amount), 0)

      setStats({
        members: memberCount || 0,
        unpaidThisMonth,
        totalRaised,
        pendingVerification: pendingVerification || 0,
        collectedThisMonthDues,
        raisedThisMonth,
      })
    }
    load()

    const channel = supabase
      .channel('overview-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dues' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-stone">A quick look at members, dues, and donations.</p>

      {!stats ? (
        <p className="mt-8 text-stone">Loading…</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Users} value={stats.members} label="Active Members" />
            <StatCard
              icon={Hourglass}
              value={stats.unpaidThisMonth}
              label="Unpaid This Month"
              accent={stats.unpaidThisMonth > 0 ? 'text-red-700' : 'text-green-700'}
            />
            <StatCard
              icon={ShieldCheck}
              value={stats.pendingVerification}
              label="Awaiting Verification"
              accent={stats.pendingVerification > 0 ? 'text-red-700' : 'text-green-700'}
            />
            <StatCard icon={HeartHandshake} value={`₹${stats.totalRaised.toLocaleString('en-IN')}`} label="Verified Donations (All Time)" />
          </div>

          <div className="mt-8 ledger-plaque p-6">
            <div className="flex items-center gap-2.5">
              <Wallet size={18} className="text-saffron" />
              <h2 className="font-display text-lg font-semibold text-maroon-deep">This Month</h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <span className="ledger-number">Dues Collected</span>
                <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">
                  ₹{stats.collectedThisMonthDues.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="ledger-number">Donations Received</span>
                <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">
                  ₹{stats.raisedThisMonth.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
