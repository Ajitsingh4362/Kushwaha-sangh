import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { navigation } from '../data/content'
import logo from '../assets/logo.png'
import { useDonateModal } from '../lib/DonateModalContext'

function NavItem({ item, onNavigate, mobile = false }) {
  const [open, setOpen] = useState(false)

  if (item.children) {
    if (mobile) {
      return (
        <div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-1 py-2 text-sm font-medium tracking-wide text-blue-900"
          >
            {item.label}
            <ChevronDown size={16} strokeWidth={2.5} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="ml-3 flex flex-col border-l border-gold/20 pl-3">
              {item.children.map((child) => (
                <Link
                  key={child.label}
                  to={child.to}
                  onClick={onNavigate}
                  className="py-2 text-sm text-blue-900/80"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <NavLink
          to={item.to}
          className="flex items-center gap-1 whitespace-nowrap py-2 text-sm font-medium tracking-wide text-blue-900"
        >
          {item.label}
          <ChevronDown size={14} strokeWidth={2.5} />
        </NavLink>
        {open && (
          <div className="absolute left-0 top-full min-w-[200px] border border-gold/40 bg-cream-paper py-1 shadow-lg">
            {item.children.map((child) => (
              <Link
                key={child.label}
                to={child.to}
                onClick={onNavigate}
                className="block px-4 py-2.5 text-sm text-blue-900 transition-colors hover:bg-saffron/15 hover:text-maroon-deep"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `whitespace-nowrap py-2 text-sm font-medium tracking-wide transition-colors ${
          'text-blue-900'
        }`
      }
    >
      {item.label}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openModal } = useDonateModal()

  return (
    <header className="sticky top-0 z-40 bg-maroon-deep/98 backdrop-blur border-b border-gold/25">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 sm:px-5 xl:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <img src={logo} alt="सीतामढ़ी कुशवाहा संघ का लोगो" className="h-14 w-14 shrink-0 rounded-full object-contain sm:h-16 sm:w-16" />
          <span className="whitespace-nowrap font-display text-[1.4rem] font-bold leading-tight text-blue-900 sm:text-[1.7rem] xl:text-[1.85rem]">सीतामढ़ी कुशवाहा संघ</span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {navigation.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={openModal}
            className="rounded-sm border border-saffron bg-saffron px-4 py-2 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
          >
            दान करें
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <button
            aria-label={mobileOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-blue-900"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gold/25 bg-cream px-5 pb-5 xl:hidden">
          <nav className="flex flex-col divide-y divide-gold/10">
            {navigation.map((item) => (
              <div key={item.label} className="py-1">
                <NavItem item={item} onNavigate={() => setMobileOpen(false)} mobile />
              </div>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false)
              openModal()
            }}
            className="mt-4 block w-full rounded-sm border border-saffron bg-saffron px-4 py-2 text-center text-sm font-semibold text-maroon-deep"
          >
            दान करें
          </button>
        </div>
      )}
    </header>
  )
}
