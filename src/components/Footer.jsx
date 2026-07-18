import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { site, navigation } from '../data/content'
import logo from '../assets/logo.png'

// lucide-react no longer ships brand/logo marks, so these three
// social icons are simple hand-drawn SVGs kept consistent in weight
// with the rest of the icon set.
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 8.5h2.5V5.3c-.43-.06-1.9-.18-3.14-.18-3.1 0-4.86 1.8-4.86 5.1v2.6H5.5V16h3v8h3.4v-8h3.16l.5-3.2h-3.66v-2.2c0-.93.26-1.6 1.6-1.6Z" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-maroon-deep text-cream/85">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt={`${site.name} logo`} className="h-16 w-16 rounded-full object-contain" />
            <span className="font-display text-xl font-semibold text-cream-paper">{site.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">{site.mission}</p>
          <div className="mt-5 flex gap-4">
            <a href={site.socials.facebook} aria-label="Facebook" className="text-cream/70 hover:text-saffron">
              <FacebookIcon />
            </a>
            <a href={site.socials.instagram} aria-label="Instagram" className="text-cream/70 hover:text-saffron">
              <InstagramIcon />
            </a>
            <a href={site.socials.youtube} aria-label="YouTube" className="text-cream/70 hover:text-saffron">
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-cream/75 hover:text-saffron">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light">Reach Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-cream/75">
            <li className="flex items-start gap-2.5">
              <MapPin size={17} className="mt-0.5 shrink-0 text-saffron" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={17} className="shrink-0 text-saffron" />
              <span>{site.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={17} className="shrink-0 text-saffron" />
              <span>{site.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ledger-rule opacity-40" />

      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>Regd. Community Welfare Association · Est. {site.established}</span>
      </div>
    </footer>
  )
}
