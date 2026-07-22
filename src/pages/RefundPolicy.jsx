import PageHero from '../components/PageHero'
import { site } from '../data/content'

export default function RefundPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund &amp; Cancellation Policy"
        blurb="Last updated: [date] — replace with the date this policy goes live."
      />

      <section className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-[0.95rem] leading-relaxed text-ink-light lg:px-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">1. Donations Are Voluntary</h2>
          <p className="mt-2">
            Donations made to {site.name} are voluntary contributions toward the Sangh&rsquo;s welfare
            programs (girls&rsquo; hostel fund, health-assistance fund, and related activities). As these are
            charitable contributions rather than a purchase of goods or services, donations are generally
            <strong> non-refundable</strong> once processed.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">2. Accidental or Duplicate Payments</h2>
          <p className="mt-2">
            If you made a payment by mistake, donated a duplicate amount, or were charged incorrectly due to a
            technical error, please contact us within 7 days of the transaction at {site.email} or {site.phone}
            with your payment reference/transaction ID. Valid cases will be refunded to the original payment
            method within 7–10 business days after verification with Razorpay.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">3. Failed Transactions</h2>
          <p className="mt-2">
            If an amount was deducted from your account but the donation was not confirmed on our end, it
            usually means the transaction failed after deduction. Such amounts are auto-reversed by your bank
            or Razorpay within 5–7 business days. If it is not reversed within that window, contact us with
            your transaction details and we will help you follow up with Razorpay.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">4. Membership Fees (if applicable)</h2>
          <p className="mt-2">
            Where a membership fee is collected, it is non-refundable once membership is confirmed, except
            where required by law or at the committee&rsquo;s discretion in genuine error cases.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">5. How to Reach Us</h2>
          <p className="mt-2">
            For any payment issue, write to {site.email}, call {site.phone}, or use the{' '}
            <a href="/contact" className="text-saffron underline">
              Contact
            </a>{' '}
            page. Please include the transaction ID/UTR number and the date of payment.
          </p>
        </div>

        <p className="text-xs text-stone">
          This is a general-purpose template — update the timelines and contact details, and have it reviewed
          against Razorpay&rsquo;s current policy requirements before launch.
        </p>
      </section>
    </>
  )
}
