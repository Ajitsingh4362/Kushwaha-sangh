import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, HeartHandshake, LogOut, Bell, ExternalLink, Menu, IdCard, ClipboardCheck, UsersRound, ImageIcon, Megaphone, CalendarHeart, Wallet } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import logo from '../assets/logo.png'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/applications', label: 'Applications', icon: ClipboardCheck },
  { to: '/admin/members', label: 'All Members', icon: IdCard },
  { to: '/admin/dues', label: 'Member Dues', icon: Users },
  { to: '/admin/donations', label: 'Donations', icon: HeartHandshake },
  { to: '/admin/committee', label: 'Committee', icon: UsersRound },
  { to: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { to: '/admin/programs', label: 'Programs', icon: CalendarHeart },
  { to: '/admin/expenses', label: 'Expenses', icon: Wallet },
  { to: '/admin/notices', label: 'Notice Board', icon: Megaphone },
]

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { session } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform bg-maroon-deep text-cream-paper transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-gold/20 px-5 py-5">
          <img src={logo} alt="Kushwaha Sangh" className="h-11 w-11 rounded-full object-contain" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Kushwaha Sangh</p>
            <p className="eyebrow text-gold-light/70">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-cream-paper/10 text-saffron' : 'text-cream/80 hover:bg-cream-paper/5'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gold/20 p-3">
          <p className="truncate px-3 py-1 text-xs text-cream/60">{session?.user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium text-cream/80 transition hover:bg-cream-paper/5"
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-gold/20 bg-cream-paper px-5 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="text-maroon-deep lg:hidden">
              <Menu size={24} />
            </button>
            <p className="text-sm text-stone">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold-deep">
              <Bell size={16} />
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-sm border border-gold/40 px-3.5 py-2 text-sm font-medium text-maroon-deep hover:border-saffron"
            >
              <ExternalLink size={15} /> View Site
            </a>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
