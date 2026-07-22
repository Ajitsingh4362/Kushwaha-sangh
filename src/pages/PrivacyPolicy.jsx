import PageHero from '../components/PageHero'
import { site } from '../data/content'

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" blurb={`Last updated: [date] — replace with the date this policy goes live.`} />

      <section className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-[0.95rem] leading-relaxed text-ink-light lg:px-8">
        <p>
          {site.name} (&ldquo;the Sangh&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
          policy explains what information we collect through this website, how we use it, and the choices
          you have.
        </p>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">1. Information We Collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Contact details you submit through forms — name, phone number, email address, postal address.</li>
            <li>Membership application details, including occupation and address.</li>
            <li>Health-assistance request details you choose to share with the welfare committee.</li>
            <li>Payment details processed for donations — handled entirely by our payment gateway (Razorpay); we do not store card or bank details ourselves.</li>
            <li>Basic technical data such as browser type and pages visited, for improving the site.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">2. How We Use Information</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>To process membership applications and maintain Sangh records.</li>
            <li>To review and respond to health-assistance requests.</li>
            <li>To send receipts, updates, or respond to enquiries.</li>
            <li>To publish member names in the public directory only where consent has been given.</li>
            <li>To meet legal, accounting, or regulatory requirements.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">3. Payment Information</h2>
          <p className="mt-2">
            All donations are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not
            collect or store your card, UPI, or net-banking credentials on our servers — these are handled
            directly by Razorpay under its own security and privacy standards.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">4. Sharing of Information</h2>
          <p className="mt-2">
            We do not sell or rent personal information. Information may be shared with the Sangh&rsquo;s
            committee members strictly for welfare-program and membership administration, or with authorities
            where required by law.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">5. Data Retention &amp; Security</h2>
          <p className="mt-2">
            We retain personal information only as long as necessary for the purposes above and take
            reasonable measures to protect it against unauthorised access, alteration, or loss.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">6. Your Choices</h2>
          <p className="mt-2">
            You may request access to, correction of, or removal of your personal information (including
            removal from the public member directory) by contacting us using the details below.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-maroon-deep">7. Contact Us</h2>
          <p className="mt-2">
            For privacy-related questions, reach us at {site.email} or {site.phone}.
          </p>
        </div>

        <p className="text-xs text-stone">
          This is a general-purpose template — have it reviewed against local regulations (e.g. India&rsquo;s
          DPDP Act) before relying on it as your final policy.
        </p>
      </section>
    </>
  )
}
