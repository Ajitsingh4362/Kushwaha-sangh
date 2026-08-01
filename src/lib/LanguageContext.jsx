import { createContext, useContext, useEffect, useState } from 'react'
import { hi } from '../data/translations'

const LanguageContext = createContext({ lang: 'en', t: (s) => s, toggleLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('kushwaha-lang') || 'en')

  useEffect(() => {
    localStorage.setItem('kushwaha-lang', lang)
  }, [lang])

  function t(text) {
    if (lang === 'en') return text
    return hi[text] || text
  }

  function toggleLang() {
    setLang((l) => (l === 'en' ? 'hi' : 'en'))
  }

  return <LanguageContext.Provider value={{ lang, t, toggleLang }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
