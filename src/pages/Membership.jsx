import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Field } from '../components/FormField'
import { supabase } from '../lib/supabase'
import a4 from '../assets/activities/activity-4.jpg'
import a1 from '../assets/activities/activity-1.jpg'

function MembershipForm() {
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
  })

  function update(field) {
    return (e) => setForm((v) => ({ ...v, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error: insertError } = await supabase.from('members').insert({
      name: form.fullName,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      occupation: form.occupation || null,
      date_of_birth: form.dob || null,
      monthly_due: 0,
      source: 'website',
    })

    setSaving(false)
    if (insertError) {
      setError('Something went wrong submitting your application. Please try again or contact us directly.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="ledger-plaque flex flex-col items-center px-6 py-14 text-center">
        <CheckCircle2 size={44} className="text-saffron" />
        <h3 className="mt-4 font-display text-xl font-semibold text-maroon-deep">
          Application received
        </h3>
        <p className="mt-2 max-w-sm text-sm text-stone">
          The committee will verify your details and confirm your membership by phone or email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="ledger-plaque space-y-5 p-7">
      <h3 className="font-display text-xl font-semibold text-maroon-deep">New Membership Application</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full Name" type="text" required value={form.fullName} onChange={update('fullName')} />
        <Field id="dob" label="Date of Birth" type="date" value={form.dob} onChange={update('dob')} />
        <Field id="phone" label="Phone Number" type="tel" required value={form.phone} onChange={update('phone')} />
        <Field id="email" label="Email Address" type="email" value={form.email} onChange={update('email')} />
        <Field
          id="address"
          label="Current Address"
          type="text"
          className="sm:col-span-2"
          required
          value={form.address}
          onChange={update('address')}
        />
        <Field id="occupation" label="Occupation" type="text" value={form.occupation} onChange={update('occupation')} />
      </div>
      <label className="flex items-start gap-2.5 text-sm text-stone">
        <input type="checkbox" required className="mt-1 accent-maroon" />
        I agree to the Sangh&rsquo;s membership terms and consent to my name appearing in
        the public member directory.
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon disabled:opacity-60 sm:w-auto"
      >
        {saving ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}

function MemberPhotos() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="ledger-plaque overflow-hidden p-3">
        <img src={a4} alt="Members at a Sangh recognition ceremony" className="h-64 w-full object-cover" />
      </div>
      <div className="ledger-plaque overflow-hidden p-3">
        <img src={a1} alt="A member being felicitated by the Sangh" className="h-64 w-full object-cover" />
      </div>
    </div>
  )
}

export default function Membership() {
  return (
    <>
      <PageHero
        eyebrow="Join the Sangh"
        title="Membership"
        blurb="Register as a member, or search the community directory."
      />
      <section className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
        <MembershipForm />
      </section>
      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <p className="eyebrow text-center text-maroon/70">Our Members</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">
            Faces of the Sangh
          </h2>
          <div className="mt-8">
            <MemberPhotos />
          </div>
        </div>
      </section>
    </>
  )
}
