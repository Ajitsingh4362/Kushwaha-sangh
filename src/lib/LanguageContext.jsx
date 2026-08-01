import { createContext, useContext, useEffect, useState } from 'react'

// The full page is translated by the Google Translate widget (see
// index.html), driven by the `googtrans` cookie below — not by a manual
// per-string dictionary. `t()` is kept as a pass-through so existing call
// sites (Navbar, Footer, DonateQRButton, PayDuesButton) don't need to
// change; Google Translate rewrites the rendered English text in place.
const LanguageContext = createContext({ lang: 'en', t: (s) => s, toggleLang: () => {} })

function readLangFromCookie() {
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/)
  return match ? match[1] : 'en'
}

function setLangCookie(lang) {
  const value = lang === 'hi' ? '/en/hi' : '/en/en'
  // Set on both the exact host and the parent domain so it sticks
  // whether the site is served from the apex or a subdomain.
  document.cookie = `googtrans=${value};path=/`
  document.cookie = `googtrans=${value};path=/;domain=.${window.location.hostname}`
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => readLangFromCookie())

  function t(text) {
    return text
  }

  function toggleLang() {
    const next = lang === 'en' ? 'hi' : 'en'
    setLangCookie(next)
    setLang(next)
    // Google Translate reads the cookie on load, so the page needs a
    // reload to translate (or restore) the full DOM.
    window.location.reload()
  }

  return <LanguageContext.Provider value={{ lang, t, toggleLang }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
