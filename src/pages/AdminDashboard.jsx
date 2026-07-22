import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHero from '../components/PageHero'
import MembersDuesPanel from '../components/MembersDuesPanel'
import DonationsPanel from '../components/DonationsPanel'

export default function AdminDashboard() {
  const [tab, setTab] = useState('dues')
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  return (
    <>
      <PageHero eyebrow="Committee Only" title="Admin Dashboard" blurb="Manage member dues and record donations." />

      <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/30 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('dues')}
              className={`px-4 py-2 text-sm font-medium ${
                tab === 'dues' ? 'border-b-2 border-saffron text-maroon-deep' : 'text-stone'
              }`}
            >
              Member Dues
            </button>
            <button
              onClick={() => setTab('donations')}
              className={`px-4 py-2 text-sm font-medium ${
                tab === 'donations' ? 'border-b-2 border-saffron text-maroon-deep' : 'text-stone'
              }`}
            >
              Donations
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-stone hover:text-maroon"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        <div className="mt-8">{tab === 'dues' ? <MembersDuesPanel /> : <DonationsPanel />}</div>
      </section>
    </>
  )
}
