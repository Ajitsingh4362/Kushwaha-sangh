import { QrCode, Landmark, ShieldCheck, HeartHandshake } from 'lucide-react'
import PageHero from '../components/PageHero'
import { donationMethods } from '../data/content'
import LiveDonationsPanel from '../components/LiveDonationsPanel'
import { useDonateModal } from '../lib/DonateModalContext'

const impact = [
  { amount: '₹500', text: 'स्वास्थ्य सहायता के एक मामले के लिए ज़रूरी सामग्री' },
  { amount: '₹1,500', text: 'बालिका छात्रावास कोष में एक महीने का योगदान' },
  { amount: '₹5,000', text: 'किसी प्रतिभा की छात्रवृत्ति की ओर एक अहम कदम' },
]

export default function Donate() {
  const { openModal } = useDonateModal()

  return (
    <>
      <PageHero
        eyebrow="संघ का सहयोग करें"
        title="दान करें"
        blurb="हर रुपये का हिसाब रखा जाता है और हर साल समाज के सामने रखा जाता है।"
      />

      <section className="bg-maroon-deep py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 text-center lg:px-8">
          <HeartHandshake size={32} className="text-saffron" />
          <p className="max-w-md text-cream/85">
            अपनी जानकारी भरें, QR स्कैन करें और भुगतान के बाद हमें बताएँ। बस इतना ही आसान।
          </p>
          <button
            type="button"
            onClick={openModal}
            className="animate-blink rounded-sm bg-saffron px-8 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-saffron-light"
          >
            अभी दान करें
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">आपका दान कहाँ जाता है</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">आपके योगदान का असर</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {impact.map((i) => (
            <div key={i.amount} className="ledger-plaque animate-rise p-6 text-center">
              <span className="font-display text-2xl font-bold text-maroon-deep">{i.amount}</span>
              <p className="mt-2 text-sm text-stone">{i.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-stone">
          ये आँकड़े केवल उदाहरण के लिए हैं।
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
              QR कोड यहाँ आएगा
            </div>
            <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
            <p className="mt-2 text-xs text-stone">
              ऊपर दिए UPI ID पर किसी भी UPI ऐप से भुगतान करें, या QR के लिए &ldquo;अभी दान करें&rdquo; दबाएँ।
            </p>
            <button
              type="button"
              onClick={openModal}
              className="mt-5 w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
            >
              अभी दान करें
            </button>
          </div>

          <div className="ledger-plaque animate-rise p-7">
            <div className="flex items-center gap-2.5">
              <Landmark size={22} className="text-saffron" />
              <h3 className="font-display text-lg font-semibold text-maroon-deep">बैंक ट्रांसफ़र</h3>
            </div>
            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone">खाताधारक का नाम</dt>
                <dd className="font-medium text-ink">{donationMethods.bank.accountName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone">खाता संख्या</dt>
                <dd className="font-ledger text-ink">{donationMethods.bank.accountNo}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone">IFSC</dt>
                <dd className="font-ledger text-ink">{donationMethods.bank.ifsc}</dd>
              </div>
              <div className="flex justify-between gap-4 text-right">
                <dt className="text-stone">शाखा</dt>
                <dd className="font-medium text-ink">{donationMethods.bank.bankBranch}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={openModal}
              className="mt-5 w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
            >
              अभी दान करें
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 border border-gold/30 bg-cream-deep/50 p-5 text-sm text-stone">
          <ShieldCheck size={22} className="mt-0.5 shrink-0 text-maroon" />
          <p>
            संघ का KYC (संस्था के नाम पर PAN और चालू खाता) पूरा होने के बाद Razorpay जैसे गेटवे से ऑनलाइन
            कार्ड/UPI भुगतान की सुविधा जोड़ी जा सकती है। तब तक UPI और बैंक ट्रांसफ़र से भुगतान आसान और
            बिना किसी शुल्क के है।
          </p>
        </div>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-2xl px-5 text-center lg:px-8">
          <blockquote className="font-display text-2xl font-semibold leading-snug text-maroon-deep sm:text-3xl">
            &ldquo;देने से कोई कभी गरीब नहीं हुआ।&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-stone">QR स्कैन करने से पहले एक छोटी-सी याद 😊</p>
        </div>
      </section>

      <LiveDonationsPanel />
    </>
  )
}
