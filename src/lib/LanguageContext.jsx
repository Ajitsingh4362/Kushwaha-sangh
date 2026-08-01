import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// The full page is translated by the Google Translate widget (see
// index.html). `t()` is kept as a pass-through so existing call sites
// (Navbar, Footer, DonateQRButton, PayDuesButton) don't need to change;
// Google Translate rewrites the rendered English text in place.
const LanguageContext = createContext({ lang: 'en', t: (s) => s, toggleLang: () => {} })

const STORAGE_KEY = 'kushwaha-lang'

// Finds Google's auto-generated hidden <select> and switches it directly.
// This is the standard, popup-free way to drive the widget: setting a
// cookie and reloading the page raced with Google's own script and
// briefly showed its banner/UI, so we drive the select in place instead.
function applyGoogleTranslate(lang) {
  const select = document.querySelector('select.goog-te-combo')
  if (!select) return false
  select.value = lang
  select.dispatchEvent(new Event('change'))
  return true
}

// Retries for a short window in case the widget script hasn't finished
// injecting its <select> yet (it loads async, from Google's servers).
function applyGoogleTranslateWithRetry(lang, maxAttempts = 30) {
  let attempts = 0
  const id = setInterval(() => {
    attempts += 1
    if (applyGoogleTranslate(lang) || attempts >= maxAttempts) {
      clearInterval(id)
    }
  }, 200)
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en')
  const location = useLocation()

  function t(text) {
    return text
  }

  function toggleLang() {
    const next = lang === 'en' ? 'hi' : 'en'
    setLang(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyGoogleTranslateWithRetry(next)
  }

  // Keep <html lang="…"> in sync with what's actually rendered. Once the
  // widget translates the visible text to Hindi, the browser's own
  // built-in translate prompt (separate from our widget, and outside the
  // DOM so CSS can't hide it) compares the real content language against
  // this attribute — leaving it stuck on "en" is what was triggering
  // that native popup.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Re-apply on client-side route changes: Google Translate only scans
  // the DOM once on load, and this is an SPA, so newly rendered pages
  // stay untranslated after navigating unless we nudge it again.
  useEffect(() => {
    if (lang === 'hi') {
      applyGoogleTranslateWithRetry('hi')
    }
  }, [location.pathname, lang])

  return <LanguageContext.Provider value={{ lang, t, toggleLang }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
