import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import PageHero from '../components/PageHero'
import { Field } from '../components/FormField'
import { supabase } from '../lib/supabase'
import { donationMethods } from '../data/content'
import PayDuesButton from '../components/PayDuesButton'
import a4 from '../assets/activities/activity-4.jpg'
import a1 from '../assets/activities/activity-1.jpg'

const JOINING_FEE = 100
const STEP = { DETAILS: 'details', FEE: 'fee', DONE: 'done' }

function MembershipForm() {
  const [step, setStep] = useState(STEP.DETAILS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    caste: '',
  })

  function update(field) {
    return (e) => setForm((v) => ({ ...v, [field]: e.target.value }))
  }

  function handleDetailsSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.caste.trim().toLowerCase() !== 'kushwaha') {
      setError('This form is only for members of the Kushwaha community. Please enter "Kushwaha" in the Caste field.')
      return
    }

    setStep(STEP.FEE)
  }

  async function handleIvePaid() {
    setError('')
    setSaving(true)

    const { error: insertError } = await supabase.from('membership_applications').insert({
      name: form.fullName,
      phone: form.phone,
      email: form.email || null,
      address: form.address || null,
      occupation: form.occupation || null,
      date_of_birth: form.dob || null,
      caste: form.caste.trim(),
      joining_fee_status: 'declared',
    })

    setSaving(false)
    if (insertError) {
      if (insertError.code === '23505') {
        setError('An application with this phone number is already pending review. Please wait for the committee to respond.')
      } else {
        setError('Something went wrong submitting your application. Please try again or contact us directly.')
      }
      return
    }
    setStep(STEP.DONE)
  }

  if (step === STEP.DONE) {
    return (
      <div className="ledger-plaque flex flex-col items-center px-6 py-14 text-center">
        <CheckCircle2 size={44} className="text-saffron" />
        <h3 className="mt-4 font-display text-xl font-semibold text-maroon-deep">
          Application received
        </h3>
        <p className="mt-2 max-w-sm text-sm text-stone">
          The committee will verify your joining fee and confirm your membership by phone or email.
        </p>
      </div>
    )
  }

  if (step === STEP.FEE) {
    return (
      <div className="ledger-plaque p-7 text-center">
        <h3 className="font-display text-xl font-semibold text-maroon-deep">Joining Fee — ₹{JOINING_FEE}</h3>
        <p className="mt-1 text-sm text-stone">
          A one-time ₹{JOINING_FEE} joining fee applies to all new members. Scan and pay, then confirm below.
        </p>
        <div className="mx-auto mt-5 w-fit bg-white p-3">
          <QRCode
            value={`upi://pay?pa=${donationMethods.upiId}&pn=Kushwaha%20Sangh&am=${JOINING_FEE}&cu=INR`}
            size={180}
          />
        </div>
        <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
        <p className="mt-1 text-xs text-stone">Test QR — replace with the Sangh&rsquo;s real UPI QR before launch.</p>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setStep(STEP.DETAILS)}
            className="rounded-sm border border-gold/50 px-5 py-2.5 text-sm font-medium text-ink hover:border-saffron"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleIvePaid}
            disabled={saving}
            className="rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
          >
            {saving ? 'Submitting…' : "I've Paid — Submit Application"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="ledger-plaque space-y-5 p-7">
      <h3 className="font-display text-xl font-semibold text-maroon-deep">New Membership Application</h3>
      <p className="text-sm text-stone">
        A one-time joining fee of <strong>₹{JOINING_FEE}</strong> applies — you&rsquo;ll pay it on the next step.
      </p>
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
        <div>
          <Field id="caste" label="Caste" type="text" required value={form.caste} onChange={update('caste')} placeholder="Kushwaha" />
          <p className="mt-1 text-xs text-stone">
            This form is only for members of the Kushwaha community — please type &ldquo;Kushwaha&rdquo; here.
          </p>
        </div>
      </div>
      <label className="flex items-start gap-2.5 text-sm text-stone">
        <input type="checkbox" required className="mt-1 accent-maroon" />
        I agree to the Sangh&rsquo;s membership terms and consent to my name appearing in
        the public member directory.
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon sm:w-auto"
      >
        Continue to Joining Fee
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

      <div className="flex justify-center bg-cream-deep/60 py-8">
        <PayDuesButton />
      </div>

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
