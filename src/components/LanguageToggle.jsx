import { Languages } from 'lucide-react'
import { useLanguage } from '../lib/LanguageContext'

export default function LanguageToggle({ className = '' }) {
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
