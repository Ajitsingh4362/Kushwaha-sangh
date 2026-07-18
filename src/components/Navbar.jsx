import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { site, navigation } from '../data/content'
import logo from '../assets/logo.png'

function NavItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false)

  if (item.children) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-1 py-2 text-sm font-medium tracking-wide transition-colors ${
              isActive ? 'text-saffron' : 'text-cream/90 hover:text-saffron'
            }`
          }
        >
          {item.label}
          <ChevronDown size={14} strokeWidth={2.5} />
        </NavLink>
        {open && (
          <div className="absolute left-0 top-full min-w-[200px] border border-gold/30 bg-maroon-deep shadow-lg">
            {item.children.map((child) => (
              <Link
                key={child.label}
                to={child.to}
                onClick={onNavigate}
                className="block px-4 py-2.5 text-sm text-cream/90 hover:bg-maroon hover:text-saffron"
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
        `py-2 text-sm font-medium tracking-wide transition-colors ${
          isActive ? 'text-saffron' : 'text-cream/90 hover:text-saffron'
        }`
      }
    >
      {item.label}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-maroon-deep/98 backdrop-blur border-b border-gold/25">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt={`${site.name} logo`} className="h-16 w-16 rounded-full object-contain" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold text-cream-paper">{site.name}</span>
            <span className="eyebrow text-gold-light/80">{site.tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <Link
          to="/donate"
          className="hidden rounded-sm border border-saffron bg-saffron px-4 py-2 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light lg:block"
        >
          Donate
        </Link>

        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="text-cream-paper lg:hidden"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gold/25 bg-maroon-deep px-5 pb-5 lg:hidden">
          <nav className="flex flex-col divide-y divide-gold/10">
            {navigation.map((item) => (
              <div key={item.label} className="py-1">
                <NavItem item={item} onNavigate={() => setMobileOpen(false)} />
                {item.children && (
                  <div className="ml-3 flex flex-col border-l border-gold/20 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.to}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-sm text-cream/80"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <Link
            to="/donate"
            onClick={() => setMobileOpen(false)}
            className="mt-4 block rounded-sm border border-saffron bg-saffron px-4 py-2 text-center text-sm font-semibold text-maroon-deep"
          >
            Donate
          </Link>
        </div>
      )}
    </header>
  )
}
