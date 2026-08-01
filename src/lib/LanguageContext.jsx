import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// The full page is translated by the Google Translate widget (see
// index.html), driven by the `googtrans` cookie below — not by a manual
// per-string dictionary. `t()` is kept as a pass-through so existing call
// sites (Navbar, Footer, DonateQRButton, PayDuesButton) don't need to
// change; Google Translate rewrites the rendered English text in place.
const LanguageContext = createContext({ lang: 'en', t: (s) => s, toggleLang: () => {} })

function readLangFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/(\w+)/)
  return match ? match[1] : 'en'
}

function setLangCookie(lang) {
  const value = lang === 'hi' ? '/en/hi' : '/en/en'
  // Single cookie, current host only. A second domain-scoped variant
  // risks two conflicting cookie values on some hosts, which is what
  // made the toggle flaky — so we keep this to one write.
  document.cookie = `googtrans=${value};path=/`
}

// This app is a client-side-routed SPA: Google Translate only scans the
// DOM once, on full page load. Navigating between pages afterwards
// doesn't reload the page, so newly rendered content stays untranslated
// unless we nudge the widget again. Re-firing a change on its hidden
// <select> makes it re-scan the current DOM without a reload.
function retriggerTranslation() {
  const select = document.querySelector('select.goog-te-combo')
  if (select) {
    select.dispatchEvent(new Event('change'))
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => readLangFromCookie())
  const location = useLocation()

  function t(text) {
    return text
  }

  function toggleLang() {
    const next = lang === 'en' ? 'hi' : 'en'
    setLangCookie(next)
    setLang(next)
    // Google Translate reads the cookie on load, so a fresh page load is
    // the reliable way to translate (or restore) the full DOM.
    window.location.reload()
  }

  // Re-apply translation after client-side navigation, with a short
  // retry loop since the Google widget's <select> may not exist yet
  // on very first load.
  useEffect(() => {
    if (lang !== 'hi') return
    let attempts = 0
    const id = setInterval(() => {
      attempts += 1
      const select = document.querySelector('select.goog-te-combo')
      if (select) {
        retriggerTranslation()
        clearInterval(id)
      } else if (attempts > 20) {
        clearInterval(id)
      }
    }, 150)
    return () => clearInterval(id)
  }, [location.pathname, lang])

  return <LanguageContext.Provider value={{ lang, t, toggleLang }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
