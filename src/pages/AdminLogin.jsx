import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from '../components/FormField'
import PageHero from '../components/PageHero'
import logo from '../assets/logo.png'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/admin')
  }

  return (
    <>
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
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            id="password"
            label="Password"
            type="password"
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
    </>
  )
}
