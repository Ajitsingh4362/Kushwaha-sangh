import { QrCode, Landmark, ShieldCheck, HeartHandshake } from 'lucide-react'
import PageHero from '../components/PageHero'
import { donationMethods } from '../data/content'
import LiveDonationsPanel from '../components/LiveDonationsPanel'
import { useDonateModal } from '../lib/DonateModalContext'

const impact = [
  { amount: '₹500', text: 'Supplies for one health-assistance case file' },
  { amount: '₹1,500', text: "A month's contribution toward the girls' hostel fund" },
  { amount: '₹5,000', text: 'A meaningful step toward an achiever\u2019s scholarship' },
]

export default function Donate() {
  const { openModal } = useDonateModal()

  return (
    <>
      <PageHero
        eyebrow="Support the Sangh"
        title="Donate"
        blurb="Every rupee is tracked and reported back to the community each year."
      />

      <section className="bg-maroon-deep py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 text-center lg:px-8">
          <HeartHandshake size={32} className="text-saffron" />
          <p className="max-w-md text-cream/85">
            Fill in your details, scan the QR, and let us know once you&rsquo;ve paid — quick and simple.
          </p>
          <button
            type="button"
            onClick={openModal}
            className="animate-blink rounded-sm bg-saffron px-8 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-saffron-light"
          >
            Donate Now
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">Where It Goes</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">Your Impact</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {impact.map((i) => (
            <div key={i.amount} className="ledger-plaque animate-rise p-6 text-center">
              <span className="font-display text-2xl font-bold text-maroon-deep">{i.amount}</span>
              <p className="mt-2 text-sm text-stone">{i.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-stone">
          Illustrative figures — replace with the Sangh&rsquo;s real cost breakdowns.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16 lg:px-8">
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
            <button
              type="button"
              onClick={openModal}
              className="mt-5 w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
            >
              Donate Now
            </button>
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
            <button
              type="button"
              onClick={openModal}
              className="mt-5 w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
            >
              Donate Now
            </button>
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
        <div className="mx-auto max-w-2xl px-5 text-center lg:px-8">
          <blockquote className="font-display text-2xl font-semibold italic leading-snug text-maroon-deep sm:text-3xl">
            &ldquo;No one has ever become poor by giving.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-stone">— a small reminder before you scan that QR above 😊</p>
        </div>
      </section>

      <LiveDonationsPanel />
    </>
  )
}
