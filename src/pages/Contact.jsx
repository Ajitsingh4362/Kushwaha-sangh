import { useState } from 'react'
import { MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import { Field, TextAreaField } from '../components/FormField'
import { site } from '../data/content'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <PageHero eyebrow="Get in Touch" title="Contact Us" blurb="Questions, suggestions or help requests — we're here." />

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-maroon-deep">Reach the Sangh Office</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0 text-saffron" />
                <span className="text-ink-light">{site.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="shrink-0 text-saffron" />
                <span className="text-ink-light">{site.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="shrink-0 text-saffron" />
                <span className="text-ink-light">{site.email}</span>
              </li>
            </ul>

            <div className="mt-7 aspect-video overflow-hidden border border-gold/40">
              <iframe
                title="Sangh location on Google Maps"
                src="https://maps.google.com/maps?q=Sitamarhi%20Kushwaha%20Sangh&z=14&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/XBFUzRQfWX9eA4aB9"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-saffron hover:underline"
            >
              <MapPin size={15} /> Open in Google Maps
            </a>
          </div>

          <div className="ledger-plaque animate-rise p-7">
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 size={42} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">Message sent</p>
                <p className="mt-1 text-sm text-stone">Someone from the committee will get back to you shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                }}
                className="space-y-4"
              >
                <h3 className="font-display text-lg font-semibold text-maroon-deep">Send an Enquiry</h3>
                <Field id="name" label="Your Name" type="text" required />
                <Field id="email" label="Email Address" type="email" required />
                <Field id="phone" label="Phone Number" type="tel" />
                <TextAreaField id="message" label="Message" required />
                <button
                  type="submit"
                  className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon"
                >
                  Send Message
                </button>
                <p className="text-center text-xs text-stone">
                  Connect this form to an email service or backend before launch.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
