import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown, Languages } from 'lucide-react'
import { site, navigation } from '../data/content'
import logo from '../assets/logo.png'
import { useDonateModal } from '../lib/DonateModalContext'
import { useLanguage } from '../lib/LanguageContext'

function NavItem({ item, onNavigate, mobile = false }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

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
            {t(item.label)}
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
                  {t(child.label)}
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
          className="flex items-center gap-1 py-2 text-sm font-medium tracking-wide text-blue-900"
        >
          {t(item.label)}
          <ChevronDown size={14} strokeWidth={2.5} />
        </NavLink>
        {open && (
          <div className="absolute left-0 top-full min-w-[200px] border border-gold/30 bg-maroon-deep shadow-lg">
            {item.children.map((child) => (
              <Link
                key={child.label}
                to={child.to}
                onClick={onNavigate}
                className="block px-4 py-2.5 text-sm text-blue-900"
              >
                {t(child.label)}
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
          'text-blue-900'
        }`
      }
    >
      {t(item.label)}
    </NavLink>
  )
}

function LanguageToggle({ className = '' }) {
  const { lang, toggleLang } = useLanguage()
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Switch language"
      className={`flex items-center gap-1.5 rounded-sm border border-gold/40 px-2.5 py-1.5 text-xs font-semibold text-blue-900 transition hover:border-saffron ${className}`}
    >
      <Languages size={14} />
      {lang === 'en' ? 'हिंदी' : 'English'}
    </button>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openModal } = useDonateModal()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-maroon-deep/98 backdrop-blur border-b border-gold/25">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt={`${site.name} logo`} className="h-16 w-16 rounded-full object-contain" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold uppercase text-blue-900">{site.name}</span>
            <span className="eyebrow text-gold-light/80">{t('COMMUNITY WELFARE ASSOCIATION')}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <button
            type="button"
            onClick={openModal}
            className="rounded-sm border border-saffron bg-saffron px-4 py-2 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
          >
            {t('Donate')}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-blue-900"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gold/25 bg-cream px-5 pb-5 lg:hidden">
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
            {t('Donate')}
          </button>
        </div>
      )}
    </header>
  )
}
