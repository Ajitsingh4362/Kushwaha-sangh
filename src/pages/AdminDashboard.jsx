import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, HeartHandshake, ClipboardList } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import PageHero from '../components/PageHero'
import { StatPlaque } from '../components/LedgerCard'
import MembersDuesPanel from '../components/MembersDuesPanel'
import DonationsPanel from '../components/DonationsPanel'

function currentMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function useDashboardStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const month = currentMonthStart()
      const [{ count: memberCount }, { data: monthDues }, { data: verifiedDonations }, { count: pendingVerification }] =
        await Promise.all([
          supabase.from('members').select('*', { count: 'exact', head: true }).eq('active', true),
          supabase.from('dues').select('paid').eq('due_month', month),
          supabase.from('donations').select('amount').eq('status', 'verified'),
          supabase.from('donations').select('*', { count: 'exact', head: true }).eq('status', 'declared'),
        ])

      const unpaidThisMonth = (monthDues || []).filter((d) => !d.paid).length
      const totalRaised = (verifiedDonations || []).reduce((sum, d) => sum + Number(d.amount), 0)

      setStats({
        members: memberCount || 0,
        unpaidThisMonth,
        totalRaised,
        pendingVerification: pendingVerification || 0,
      })
    }
    load()
  }, [])

  return stats
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('dues')
  const navigate = useNavigate()
  const { session } = useAuth()
  const stats = useDashboardStats()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  const tabs = [
    { id: 'dues', label: 'Member Dues', icon: Users },
    { id: 'donations', label: 'Donations', icon: HeartHandshake },
  ]

  return (
    <>
      <PageHero eyebrow="Committee Only" title="Admin Dashboard" blurb="Manage member dues and record donations." />

      <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/30 pb-5">
          <p className="text-sm text-stone">
            Signed in as <span className="font-medium text-ink">{session?.user?.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-sm border border-gold/40 px-3.5 py-2 text-sm font-medium text-stone transition hover:border-maroon hover:text-maroon"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatPlaque id="MEM" value={String(stats.members)} label="Active Members" />
            <StatPlaque id="DUE" value={String(stats.unpaidThisMonth)} label="Unpaid This Month" />
            <StatPlaque id="FUND" value={`₹${stats.totalRaised.toLocaleString('en-IN')}`} label="Verified Donations" />
            <StatPlaque id="CHK" value={String(stats.pendingVerification)} label="Awaiting Verification" />
          </div>
        )}

        <div className="ledger-plaque mt-8 p-5 text-sm leading-relaxed text-stone">
          <p className="flex items-center gap-2 font-medium text-maroon-deep">
            <ClipboardList size={16} className="text-saffron" /> How this works, in short
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Go to <strong>Member Dues</strong> and add each member once, with their monthly amount.</li>
            <li>At the start of every month, click <strong>&ldquo;Generate This Month&rsquo;s Dues&rdquo;</strong> — this creates that month&rsquo;s row for everyone automatically.</li>
            <li>As people pay, click <strong>&ldquo;Mark Paid&rdquo;</strong> next to their name.</li>
            <li>Go to <strong>Donations</strong> whenever someone donates — pick their name if they&rsquo;re a member, or add a one-off donor. Entries from the public &ldquo;Donate Now&rdquo; QR flow need a manual &ldquo;Verify&rdquo; once you&rsquo;ve confirmed the payment.</li>
          </ol>
        </div>

        <div className="mt-8 flex gap-2 border-b border-gold/30">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? 'border-saffron text-maroon-deep'
                  : 'border-transparent text-stone hover:text-maroon-deep'
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">{tab === 'dues' ? <MembersDuesPanel /> : <DonationsPanel />}</div>
      </section>
    </>
  )
}
