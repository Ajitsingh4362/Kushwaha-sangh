import { useState } from 'react'
import { CheckCircle2, Building2, HeartPulse, Trophy } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Field, TextAreaField, SelectField } from '../components/FormField'
import { hostelInfo, healthInfo, achievers } from '../data/content'

function HostelSection() {
  return (
    <section id="hostel" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <Building2 size={22} className="text-saffron" />
              <span className="eyebrow text-maroon/70">Pillar 01</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">Girls&rsquo; Hostel</h2>
            <p className="mt-4 leading-relaxed text-stone">{hostelInfo.intro}</p>

            <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {hostelInfo.facilities.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-light">
                  <CheckCircle2 size={16} className="shrink-0 text-saffron" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="ledger-plaque animate-rise p-7">
            <span className="ledger-number">Upcoming Initiative</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-maroon-deep">{hostelInfo.fundRaised}</span>
              <span className="text-sm text-stone">raised of {hostelInfo.fundGoal}</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gold/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron to-gold"
                style={{ width: `${hostelInfo.progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-stone">{hostelInfo.progressNote}</p>
            <p className="mt-1 text-xs text-stone">Planned capacity: {hostelInfo.plannedCapacity}</p>

            <div className="ledger-rule my-6" />

            <p className="text-sm leading-relaxed text-stone">
              This hostel hasn&rsquo;t been built yet — it&rsquo;s the Sangh&rsquo;s next big goal. Once
              ground is broken, photos of construction and the finished building will appear on the{' '}
              <a href="/gallery" className="text-saffron underline">
                Gallery
              </a>{' '}
              page.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center border border-dashed border-gold/50 bg-cream text-xs text-stone/70"
                >
                  Concept {i}
                </div>
              ))}
            </div>
            <a
              href="/donate"
              className="mt-5 block w-full rounded-sm bg-maroon-deep px-5 py-3 text-center text-sm font-semibold text-cream-paper transition hover:bg-maroon"
            >
              Contribute to the Hostel Fund
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function HealthSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="health" className="scroll-mt-20 bg-cream-deep/60 py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <HeartPulse size={22} className="text-saffron" />
              <span className="eyebrow text-maroon/70">Pillar 02</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">Health Assistance</h2>
            <p className="mt-4 leading-relaxed text-stone">{healthInfo.intro}</p>

            <ol className="mt-6 space-y-4">
              {healthInfo.steps.map((s, i) => (
                <li key={s.title} className="flex gap-3.5">
                  <span className="font-ledger text-sm font-medium text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-medium text-maroon-deep">{s.title}</p>
                    <p className="text-sm text-stone">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs italic text-stone">{healthInfo.disclaimer}</p>
          </div>

          <div className="ledger-plaque animate-rise p-7">
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={40} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">
                  Request received
                </p>
                <p className="mt-1 text-sm text-stone">
                  The welfare committee will contact you within 7–10 days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-maroon-deep">
                  Request Assistance
                </h3>
                <Field id="patientName" label="Patient / Member Name" type="text" required />
                <Field id="phone" label="Contact Number" type="tel" required />
                <SelectField
                  id="assistanceType"
                  label="Type of Assistance"
                  options={['Surgery / Hospitalisation', 'Ongoing Treatment', 'Medicine Support', 'Other']}
                />
                <TextAreaField id="details" label="Briefly describe the situation" required />
                <button
                  type="submit"
                  className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon"
                >
                  Submit Request
                </button>
                <p className="text-center text-xs text-stone">
                  This form needs to be connected to a backend (e.g. Supabase or email service) before it goes live.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function AchieversSection() {
  return (
    <section id="achievers" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Trophy size={22} className="text-saffron" />
          <span className="eyebrow text-maroon/70">Pillar 03</span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">Achievers&rsquo; Wall</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone">
          Recognising members and their children who have brought pride to the community — in
          academics, careers, sport and public service.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievers.map((a, i) => (
            <div key={i} className="ledger-plaque animate-rise flex gap-4 p-5">
              <div className="grid h-16 w-20 shrink-0 place-items-center rounded-md border-2 border-gold bg-maroon-deep font-display font-semibold text-gold">
                {a.name.replace(/Achiever Name/i, 'A').slice(0, 1)}
              </div>
              <div>
                <span className="ledger-number">{a.category}</span>
                <p className="mt-0.5 font-display font-semibold text-maroon-deep">{a.name}</p>
                <p className="text-sm text-stone">{a.achievement}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-stone">
          Nominate a community achiever through the{' '}
          <a href="/contact" className="text-saffron underline">
            Contact
          </a>{' '}
          page.
        </p>
      </div>
    </section>
  )
}

export default function Welfare() {
  return (
    <>
      <PageHero
        eyebrow="Samaj Welfare Programs"
        title="Welfare Programs"
        blurb="The Sangh's real work — a hostel, a health fund, and recognition for those who rise."
      />
      <HostelSection />
      <HealthSection />
      <AchieversSection />
    </>
  )
}
