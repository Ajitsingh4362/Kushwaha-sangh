import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import PageHero from '../components/PageHero'
import { Field } from '../components/FormField'
import { supabase } from '../lib/supabase'
import { donationMethods } from '../data/content'
import PayDuesButton from '../components/PayDuesButton'
import a4 from '../assets/activities/activity-4.jpg'
import a1 from '../assets/activities/activity-1.jpg'

const JOINING_FEE = 100
const STEP = { DETAILS: 'details', FEE: 'fee', DONE: 'done' }

function MembershipForm() {
  const [step, setStep] = useState(STEP.DETAILS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    caste: '',
  })

  function update(field) {
    return (e) => setForm((v) => ({ ...v, [field]: e.target.value }))
  }

  function handleDetailsSubmit(e) {
    e.preventDefault()
    setError('')

    const caste = form.caste.trim().toLowerCase()
    if (caste !== 'kushwaha' && caste !== 'कुशवाहा') {
      setError('यह फ़ॉर्म केवल कुशवाहा समाज के सदस्यों के लिए है। कृपया जाति वाले खाने में "कुशवाहा" लिखें।')
      return
    }

    setStep(STEP.FEE)
  }

  async function handleIvePaid() {
    setError('')
    setSaving(true)

    const { error: insertError } = await supabase.from('membership_applications').insert({
      name: form.fullName,
      phone: form.phone,
      email: form.email || null,
      address: form.address || null,
      occupation: form.occupation || null,
      date_of_birth: form.dob || null,
      caste: form.caste.trim(),
      joining_fee_status: 'declared',
    })

    setSaving(false)
    if (insertError) {
      if (insertError.code === '23505') {
        setError('इस फ़ोन नंबर से एक आवेदन पहले से समीक्षा के लिए लंबित है। कृपया समिति के जवाब का इंतज़ार करें।')
      } else {
        setError('आवेदन जमा करने में कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें या हमसे सीधे संपर्क करें।')
      }
      return
    }
    setStep(STEP.DONE)
  }

  if (step === STEP.DONE) {
    return (
      <div className="ledger-plaque flex flex-col items-center px-6 py-14 text-center">
        <CheckCircle2 size={44} className="text-saffron" />
        <h3 className="mt-4 font-display text-xl font-semibold text-maroon-deep">
          आवेदन प्राप्त हुआ
        </h3>
        <p className="mt-2 max-w-sm text-sm text-stone">
          समिति आपके सदस्यता शुल्क का सत्यापन करके फ़ोन या ईमेल से आपकी सदस्यता की पुष्टि करेगी।
        </p>
      </div>
    )
  }

  if (step === STEP.FEE) {
    return (
      <div className="ledger-plaque p-7 text-center">
        <h3 className="font-display text-xl font-semibold text-maroon-deep">सदस्यता शुल्क: ₹{JOINING_FEE}</h3>
        <p className="mt-1 text-sm text-stone">
          सभी नए सदस्यों के लिए ₹{JOINING_FEE} का एक बार का सदस्यता शुल्क है। स्कैन करके भुगतान करें, फिर नीचे पुष्टि करें।
        </p>
        <div className="mx-auto mt-5 w-fit bg-white p-3">
          <QRCode
            value={`upi://pay?pa=${donationMethods.upiId}&pn=Kushwaha%20Sangh&am=${JOINING_FEE}&cu=INR`}
            size={180}
          />
        </div>
        <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
        <p className="mt-1 text-xs text-stone">भुगतान के लिए किसी भी UPI ऐप (Google Pay, PhonePe, Paytm आदि) से स्कैन करें।</p>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setStep(STEP.DETAILS)}
            className="rounded-sm border border-gold/50 px-5 py-2.5 text-sm font-medium text-ink hover:border-saffron"
          >
            वापस जाएँ
          </button>
          <button
            type="button"
            onClick={handleIvePaid}
            disabled={saving}
            className="rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
          >
            {saving ? 'जमा हो रहा है…' : 'भुगतान कर दिया, आवेदन जमा करें'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="ledger-plaque space-y-5 p-7">
      <h3 className="font-display text-xl font-semibold text-maroon-deep">नई सदस्यता के लिए आवेदन</h3>
      <p className="text-sm text-stone">
        <strong>₹{JOINING_FEE}</strong> का एक बार का सदस्यता शुल्क देना होगा, जिसका भुगतान आप अगले चरण में करेंगे।
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="पूरा नाम" type="text" required value={form.fullName} onChange={update('fullName')} />
        <Field id="dob" label="जन्म तिथि" type="date" value={form.dob} onChange={update('dob')} />
        <Field id="phone" label="फ़ोन नंबर" type="tel" required value={form.phone} onChange={update('phone')} />
        <Field id="email" label="ईमेल पता" type="email" value={form.email} onChange={update('email')} />
        <Field
          id="address"
          label="वर्तमान पता"
          type="text"
          className="sm:col-span-2"
          required
          value={form.address}
          onChange={update('address')}
        />
        <Field id="occupation" label="व्यवसाय" type="text" value={form.occupation} onChange={update('occupation')} />
        <div>
          <Field id="caste" label="जाति" type="text" required value={form.caste} onChange={update('caste')} placeholder="कुशवाहा" />
          <p className="mt-1 text-xs text-stone">
            यह फ़ॉर्म केवल कुशवाहा समाज के सदस्यों के लिए है, कृपया यहाँ &ldquo;कुशवाहा&rdquo; लिखें।
          </p>
        </div>
      </div>
      <label className="flex items-start gap-2.5 text-sm text-stone">
        <input type="checkbox" required className="mt-1 accent-maroon" />
        मैं संघ की सदस्यता की शर्तों से सहमत हूँ और सार्वजनिक सदस्य सूची में अपना नाम दिखाए जाने की
        अनुमति देता/देती हूँ।
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-sm bg-maroon-deep px-5 py-3 text-sm font-semibold text-cream-paper transition hover:bg-maroon sm:w-auto"
      >
        सदस्यता शुल्क के लिए आगे बढ़ें
      </button>
    </form>
  )
}

function MemberPhotos() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="ledger-plaque overflow-hidden p-3">
        <img src={a4} alt="संघ के सम्मान समारोह में सदस्य" className="h-64 w-full object-cover" />
      </div>
      <div className="ledger-plaque overflow-hidden p-3">
        <img src={a1} alt="संघ द्वारा एक सदस्य का सम्मान" className="h-64 w-full object-cover" />
      </div>
    </div>
  )
}

export default function Membership() {
  return (
    <>
      <PageHero
        eyebrow="संघ से जुड़ें"
        title="सदस्यता"
        blurb="सदस्य के रूप में पंजीकरण करें और अपना मासिक शुल्क भरें।"
      />

      <div className="flex justify-center bg-cream-deep/60 py-8">
        <PayDuesButton />
      </div>

      <section className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
        <MembershipForm />
      </section>
      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <p className="eyebrow text-center text-maroon/70">हमारे सदस्य</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">
            संघ के चेहरे
          </h2>
          <div className="mt-8">
            <MemberPhotos />
          </div>
        </div>
      </section>
    </>
  )
}
