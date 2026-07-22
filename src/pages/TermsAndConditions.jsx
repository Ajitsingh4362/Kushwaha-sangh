import PageHero from '../components/PageHero'
import { site } from '../data/content'

export default function TermsAndConditions() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms &amp; Conditions" blurb="Last updated: [date] — replace with the date these terms go live." />

      <section className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-[0.95rem] leading-relaxed text-ink-light lg:px-8">
        <p>
          By using this website or making a donation to {site.name}, you agree to the terms below. If you do
          not agree, please do not use the site or make a payment.
        </p>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">1. About the Sangh</h2>
          <p className="mt-2">
            {site.name} is a community welfare association running programs including a girls&rsquo; hostel
            fund, a health-assistance fund, membership registration, and recognition of community achievers.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">2. Donations</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Donations made through this site are voluntary contributions toward the Sangh&rsquo;s welfare programs.</li>
            <li>Payments are processed securely through Razorpay; the Sangh does not directly handle or store your payment details.</li>
            <li>Please see our Refund &amp; Cancellation Policy for how issues with a payment are handled.</li>
            <li>Tax-deduction eligibility (if any) depends on the Sangh&rsquo;s registration status — check with the committee before assuming a donation is tax-deductible.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">3. Membership</h2>
          <p className="mt-2">
            Submitting a membership application does not guarantee membership. Applications are reviewed and
            confirmed by the committee, whose decision on membership matters is final.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">4. Health Assistance Requests</h2>
          <p className="mt-2">
            Submitting a request for health assistance does not guarantee approval or a specific amount of
            support. Assistance depends on available funds and is decided by the welfare committee at its
            discretion.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">5. Website Use</h2>
          <p className="mt-2">
            You agree to provide accurate information in any form on this site and not to misuse the site,
            attempt unauthorised access, or submit false information in membership or assistance requests.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">6. Limitation of Liability</h2>
          <p className="mt-2">
            The Sangh makes reasonable efforts to keep this website accurate and available, but does not
            guarantee uninterrupted access and is not liable for losses arising from use of the site, to the
            extent permitted by law.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">7. Changes to These Terms</h2>
          <p className="mt-2">
            These terms may be updated from time to time. Continued use of the site after changes are posted
            means you accept the updated terms.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">8. Contact Us</h2>
          <p className="mt-2">
            Questions about these terms can be sent to {site.email} or {site.phone}.
          </p>
        </div>

        <p className="text-xs text-stone">
          This is a general-purpose template — have it reviewed by a lawyer familiar with Indian NGO/trust
          regulations before final launch.
        </p>
      </section>
    </>
  )
}
