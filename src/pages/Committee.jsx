import PageHero from '../components/PageHero'
import { PersonPlaque } from '../components/LedgerCard'
import { committee } from '../data/content'

export default function Committee() {
  return (
    <>
      <PageHero
        eyebrow="Padadhikari"
        title="Committee"
        blurb="The office-bearers and executive members who run the Sangh's day-to-day work."
      />

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-xs">
          <PersonPlaque {...committee.president} featured />
        </div>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="eyebrow text-center text-maroon/70">Office Bearers</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {committee.officers.map((o) => (
              <PersonPlaque key={o.regNo} {...o} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">Executive Committee</p>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {committee.members.map((m) => (
            <PersonPlaque key={m.regNo} {...m} />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-lg text-center text-sm text-stone">
          Replace these placeholder cards with real committee member names, photos and registry
          numbers from the Sangh&rsquo;s records.
        </p>
      </section>
    </>
  )
}
