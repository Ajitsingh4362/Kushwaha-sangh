import { QrCode, Landmark, FileDown, ShieldCheck } from 'lucide-react'
import PageHero from '../components/PageHero'
import { donationMethods, transparency } from '../data/content'

export default function Donate() {
  return (
    <>
      <PageHero
        eyebrow="Support the Sangh"
        title="Donate"
        blurb="Every rupee is tracked and reported back to the community each year."
      />

      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="ledger-plaque animate-rise p-7">
            <div className="flex items-center gap-2.5">
              <QrCode size={22} className="text-saffron" />
              <h3 className="font-display text-lg font-semibold text-maroon-deep">UPI</h3>
            </div>
            <div className="mt-5 flex aspect-square max-w-[180px] items-center justify-center border border-dashed border-gold/60 bg-cream text-center text-xs text-stone/70">
              QR code goes here
            </div>
            <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
            <p className="mt-2 text-xs text-stone">
              Replace with the Sangh&rsquo;s real UPI ID and a generated QR code before launch.
            </p>
          </div>

          <div className="ledger-plaque animate-rise p-7">
            <div className="flex items-center gap-2.5">
              <Landmark size={22} className="text-saffron" />
              <h3 className="font-display text-lg font-semibold text-maroon-deep">Bank Transfer</h3>
            </div>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone">Account Name</dt>
                <dd className="font-medium text-ink">{donationMethods.bank.accountName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone">Account No.</dt>
                <dd className="font-ledger text-ink">{donationMethods.bank.accountNo}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone">IFSC</dt>
                <dd className="font-ledger text-ink">{donationMethods.bank.ifsc}</dd>
              </div>
              <div className="flex justify-between gap-4 text-right">
                <dt className="text-stone">Branch</dt>
                <dd className="font-medium text-ink">{donationMethods.bank.bankBranch}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 border border-gold/30 bg-cream-deep/50 p-5 text-sm text-stone">
          <ShieldCheck size={22} className="mt-0.5 shrink-0 text-maroon" />
          <p>
            Online card/UPI checkout via a gateway such as Razorpay can be added once the Sangh
            completes KYC (PAN and current account in the organisation&rsquo;s name) — until then,
            UPI and bank transfer keep things simple and fee-free.
          </p>
        </div>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <p className="eyebrow text-center text-maroon/70">Accountability</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">
            Where Your Money Goes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-stone">
            A year-by-year look at funds raised and spent on the community&rsquo;s welfare programs.
          </p>

          <div className="mt-10 space-y-5">
            {transparency.map((t) => {
              const collectedNum = parseInt(t.collected.replace(/[^\d]/g, ''), 10)
              const spentNum = parseInt(t.spent.replace(/[^\d]/g, ''), 10)
              const pct = collectedNum ? Math.min(Math.round((spentNum / collectedNum) * 100), 100) : 0
              return (
                <div key={t.year} className="ledger-plaque animate-rise p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-display text-lg font-semibold text-maroon-deep">{t.year}</span>
                    <a href={t.report} className="flex items-center gap-1.5 text-sm text-saffron hover:underline">
                      <FileDown size={15} /> Download Report
                    </a>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2">
                    <div>
                      <span className="ledger-number">Collected</span>
                      <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{t.collected}</p>
                    </div>
                    <div>
                      <span className="ledger-number">Spent on Programs</span>
                      <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{t.spent}</p>
                    </div>
                  </div>

                  <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gold/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-saffron to-gold"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-stone">{pct}% of funds collected were put to use that year</p>
                </div>
              )
            })}
          </div>

          <p className="mt-6 text-center text-xs text-stone">
            Placeholder figures — replace with the Sangh&rsquo;s audited yearly numbers and link real
            PDF reports.
          </p>
        </div>
      </section>
    </>
  )
}
