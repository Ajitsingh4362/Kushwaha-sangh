import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from '../components/FormField'
import PageHero from '../components/PageHero'
import logo from '../assets/logo.png'

// Committee logins use a short ID instead of an email. Supabase Auth
// still needs an email, so an ID without "@" is turned into
// <id>@kushwahasangh.org — create the user with that email in
// Supabase (Authentication → Users). Full emails keep working too.
const LOGIN_DOMAIN = 'kushwahasangh.org'

function idToEmail(id) {
  const clean = id.trim().toLowerCase()
  return clean.includes('@') ? clean : `${clean}@${LOGIN_DOMAIN}`
}

export default function AdminLogin() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: idToEmail(loginId), password })
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Wrong ID or password.' : error.message)
      return
    }
    navigate('/admin')
  }

  return (
    <div lang="en">
      <PageHero eyebrow="Committee Access" title="Admin Login" blurb="For Sangh committee members only." />
      <section className="mx-auto max-w-sm px-5 py-16 lg:px-8">
        <form onSubmit={handleSubmit} className="ledger-plaque space-y-4 p-7">
          <div className="flex flex-col items-center gap-2 pb-2">
            <img src={logo} alt="Kushwaha Sangh" className="h-14 w-14 rounded-full object-contain" />
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold-deep">
              <Lock size={12} /> Secure Committee Access
            </span>
          </div>
          <Field
            id="login-id"
            label="ID"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </section>
    </div>
  )
}
