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
              <span className="eyebrow text-maroon/70">स्तंभ 01</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">बालिका छात्रावास</h2>
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
            <span className="ledger-number">आगामी योजना</span>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-maroon-deep">{hostelInfo.fundRaised}</span>
              <span className="text-sm text-stone">{hostelInfo.fundGoal} में से जुटाए गए</span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gold/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron to-gold"
                style={{ width: `${hostelInfo.progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-stone">{hostelInfo.progressNote}</p>
            <p className="mt-1 text-xs text-stone">प्रस्तावित क्षमता: {hostelInfo.plannedCapacity}</p>

            <div className="ledger-rule my-6" />

            <p className="text-sm leading-relaxed text-stone">
              यह छात्रावास अभी बना नहीं है, यह संघ का अगला बड़ा लक्ष्य है। निर्माण शुरू होने पर इसकी और
              तैयार भवन की तस्वीरें{' '}
              <a href="/gallery" className="text-saffron underline">
                गैलरी
              </a>{' '}
              पेज पर दिखाई देंगी।
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center border border-dashed border-gold/50 bg-cream text-xs text-stone/70"
                >
                  नमूना {i}
                </div>
              ))}
            </div>
            <a
              href="/donate"
              className="mt-5 block w-full rounded-sm bg-maroon-deep px-5 py-3 text-center text-sm font-semibold text-cream-paper transition hover:bg-maroon"
            >
              छात्रावास कोष में योगदान दें
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
              <span className="eyebrow text-maroon/70">स्तंभ 02</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">स्वास्थ्य सहायता</h2>
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
            <p className="mt-5 text-xs text-stone">{healthInfo.disclaimer}</p>
          </div>

          <div className="ledger-plaque animate-rise p-7">
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 size={40} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">
                  अनुरोध प्राप्त हुआ
                </p>
                <p className="mt-1 text-sm text-stone">
                  कल्याण समिति 7–10 दिनों में आपसे संपर्क करेगी।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-maroon-deep">
                  सहायता के लिए अनुरोध करें
                </h3>
                <Field id="patientName" label="मरीज़ / सदस्य का नाम" type="text" required />
                <Field id="phone" label="संपर्क नंबर" type="tel" required />
                <SelectField
                  id="assistanceType"
                  label="सहायता का प्रकार"
                  options={['सर्जरी / अस्पताल में भर्ती', 'लगातार चल रहा इलाज', 'दवाइयों के लिए सहायता', 'अन्य']}
                />
                <TextAreaField id="details" label="स्थिति के बारे में संक्षेप में बताएँ" required />
                <button
                  type="submit"
                  className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon"
                >
                  अनुरोध भेजें
                </button>
                <p className="text-center text-xs text-stone">
                  यह फ़ॉर्म अभी चालू नहीं है। आपात स्थिति में कृपया सीधे समिति से फ़ोन पर संपर्क करें।
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
          <span className="eyebrow text-maroon/70">स्तंभ 03</span>
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">प्रतिभा सम्मान</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone">
          पढ़ाई, करियर, खेल और लोक सेवा में समाज का नाम रोशन करने वाले सदस्यों और उनके बच्चों का
          सम्मान।
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievers.map((a, i) => (
            <div key={i} className="ledger-plaque animate-rise flex gap-4 p-5">
              <div className="grid h-16 w-20 shrink-0 place-items-center rounded-md border-2 border-gold bg-maroon-deep font-display font-semibold text-gold">
                {a.name.slice(0, 1)}
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
          समाज की किसी प्रतिभा का नाम सुझाने के लिए{' '}
          <a href="/contact" className="text-saffron underline">
            संपर्क
          </a>{' '}
          पेज पर जाएँ।
        </p>
      </div>
    </section>
  )
}

export default function Welfare() {
  return (
    <>
      <PageHero
        eyebrow="समाज कल्याण"
        title="कल्याण कार्यक्रम"
        blurb="संघ का असली काम: छात्रावास, स्वास्थ्य कोष, और आगे बढ़ने वालों का सम्मान।"
      />
      <HostelSection />
      <HealthSection />
      <AchieversSection />
    </>
  )
}
