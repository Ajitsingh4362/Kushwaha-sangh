import { useMemo, useState } from 'react'
import { Search, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Field, SelectField } from '../components/FormField'

const sampleDirectory = [
  { name: 'Member Name', area: 'North Zone', regNo: 'GM-1042', since: '2019' },
  { name: 'Member Name', area: 'South Zone', regNo: 'GM-1043', since: '2020' },
  { name: 'Member Name', area: 'East Zone', regNo: 'GM-1044', since: '2015' },
  { name: 'Member Name', area: 'West Zone', regNo: 'GM-1045', since: '2022' },
  { name: 'Member Name', area: 'North Zone', regNo: 'GM-1046', since: '2018' },
  { name: 'Member Name', area: 'South Zone', regNo: 'GM-1047', since: '2021' },
]

function MembershipForm() {
  const [submitted, setSubmitted] = useState(false)

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
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="ledger-plaque space-y-5 p-7"
    >
      <h3 className="font-display text-xl font-semibold text-maroon-deep">New Membership Application</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full Name" type="text" required />
        <Field id="dob" label="Date of Birth" type="date" />
        <Field id="phone" label="Phone Number" type="tel" required />
        <Field id="email" label="Email Address" type="email" />
        <Field id="address" label="Current Address" type="text" className="sm:col-span-2" required />
        <SelectField
          id="area"
          label="Area / Zone"
          options={['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Outside District']}
        />
        <Field id="occupation" label="Occupation" type="text" />
      </div>
      <label className="flex items-start gap-2.5 text-sm text-stone">
        <input type="checkbox" required className="mt-1 accent-maroon" />
        I agree to the Sangh&rsquo;s membership terms and consent to my name and area appearing in
        the public member directory.
      </label>
      <button
        type="submit"
        className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon sm:w-auto"
      >
        Submit Application
      </button>
      <p className="text-xs text-stone">
        This form needs to be connected to a backend (e.g. Supabase or an email service) to store
        real submissions before launch.
      </p>
    </form>
  )
}

function Directory() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sampleDirectory
    return sampleDirectory.filter(
      (m) => m.name.toLowerCase().includes(q) || m.area.toLowerCase().includes(q) || m.regNo.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div>
      <div className="flex items-center gap-2 border border-gold/40 bg-cream-paper px-3.5 py-2.5">
        <Search size={17} className="text-stone" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, area or registry number…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-stone/60"
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Regd. No.</th>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Area</th>
              <th className="py-2 font-medium">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15">
            {filtered.map((m) => (
              <tr key={m.regNo}>
                <td className="py-3 pr-4 font-ledger text-xs text-gold-deep">{m.regNo}</td>
                <td className="py-3 pr-4 font-medium text-ink">{m.name}</td>
                <td className="py-3 pr-4 text-stone">{m.area}</td>
                <td className="py-3 text-stone">{m.since}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-stone">
                  No members match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-stone">
        Showing placeholder entries only. Real listings should include only members who consent to
        being listed publicly.
      </p>
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
          <p className="eyebrow text-center text-maroon/70">Directory</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">
            Member Directory
          </h2>
          <div className="mt-8">
            <Directory />
          </div>
        </div>
      </section>
    </>
  )
}
