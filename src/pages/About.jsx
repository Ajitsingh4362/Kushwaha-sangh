import { BookOpen, Target, HandHeart, GraduationCap, Sparkles, ShieldCheck, Rocket } from 'lucide-react'
import PageHero from '../components/PageHero'
import { site } from '../data/content'

const milestones = [
  {
    icon: Sparkles,
    year: '2017',
    title: 'एकता की पहली चिंगारी',
    text: 'समाज कल्याण, आपसी सहयोग और सशक्तिकरण के लिए एक साझा मंच बनाने हेतु समाज के लोगों की पहली बैठक।',
  },
  {
    icon: ShieldCheck,
    year: '2023',
    title: 'आधिकारिक मान्यता और संगठन',
    text: 'अपने कार्य का दायरा बढ़ाने और पूरी पारदर्शिता के साथ काम करने के लिए संघ ने एक बड़ा कदम उठाया और मान्यता प्राप्त संस्था के रूप में आधिकारिक पंजीकरण कराया। इसके साथ ही औपचारिक संचालन व्यवस्था और समर्पित कल्याण योजनाएँ शुरू हुईं।',
  },
  {
    icon: Rocket,
    year: '2026',
    title: 'डिजिटल बदलाव',
    text: 'आधुनिक दौर के साथ कदम मिलाते हुए कुशवाहा संघ ने अपनी आधिकारिक वेबसाइट शुरू की, ताकि दुनिया भर में फैले समाज के लोग जुड़ सकें, आपात स्थिति में तुरंत मदद (जैसे रक्तदान अभियान और चिकित्सा सहायता) मिल सके, और समाज की जानकारी आसानी से साझा हो सके।',
  },
]

const objectives = [
  {
    icon: HandHeart,
    title: 'आपसी कल्याण',
    text: 'बीमारी, कठिनाई और आपात स्थिति में आर्थिक और सामाजिक सहयोग के साथ सदस्यों के साथ खड़े रहना।',
  },
  {
    icon: GraduationCap,
    title: 'शिक्षा सर्वोपरि',
    text: 'बालिका छात्रावास, छात्रवृत्ति और वरिष्ठ सदस्यों के मार्गदर्शन से शिक्षा तक पहुँच आसान बनाना।',
  },
  {
    icon: Target,
    title: 'सम्मान',
    text: 'पढ़ाई, पेशे या लोक सेवा में आगे बढ़ने वाले सदस्यों का सम्मान, ताकि अगली पीढ़ी को प्रेरणा मिले।',
  },
  {
    icon: BookOpen,
    title: 'पारदर्शिता',
    text: 'हर साल कोष का ब्योरा प्रकाशित करना, ताकि हर दानदाता और सदस्य देख सके कि योगदान का उपयोग कैसे हो रहा है।',
  },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="हमारी कहानी"
        title="संघ के बारे में"
        blurb="एकजुट होता समाज, जहाँ एक पीढ़ी अगली पीढ़ी का सहारा बनती है।"
      />

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="eyebrow text-maroon/70">इतिहास और उद्देश्य</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">
          {site.name} की यात्रा: एकता में जड़ें, उद्देश्य से प्रेरित
        </h2>
        <div className="prose-note mt-5 space-y-4 text-[1.05rem] leading-relaxed text-ink-light">
          <p>
            {site.name} की कहानी समाज की ताकत, आपसी सहयोग और साझा सोच का प्रमाण है।
          </p>
          <p>
            वर्ष 2017 में समाज के कुछ दूरदर्शी नेता और सफल पेशेवर इस स्पष्ट सोच के साथ एक साथ आए कि
            व्यक्तिगत सफलता का सच्चा अर्थ तभी है, जब वह पूरे समाज को ऊपर उठाने में मदद करे। समाज में
            गहरी एकता लाने, सफल सदस्यों को एक मंच पर लाने और ज़रूरतमंदों के लिए मज़बूत सहायता तंत्र बनाने
            के मूल उद्देश्यों के साथ इस सामूहिक आंदोलन की नींव रखी गई।
          </p>
          <p>
            2017 में अनौपचारिक बैठकों और ज़मीनी स्तर पर स्वतःस्फूर्त राहत कार्य से जो शुरुआत हुई, वह जल्द
            ही चिकित्सा आपातकाल, सामाजिक संकट और आर्थिक तंगी के समय परिवारों के लिए एक भरोसेमंद सहारा
            बन गई।
          </p>
        </div>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-maroon/70">हमारा सफ़र</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">प्रमुख पड़ाव</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {milestones.map((m) => (
              <div key={m.year} className="ledger-plaque p-6">
                <m.icon size={28} className="text-saffron" strokeWidth={1.75} />
                <p className="mt-3 font-display text-2xl font-bold text-maroon-deep">{m.year}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-maroon-deep">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="eyebrow text-maroon/70">हमारा उद्देश्य</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">
          आज {site.name} क्यों ज़रूरी है
        </h2>
        <p className="prose-note mt-5 text-[1.05rem] leading-relaxed text-ink-light">
          आज {site.name} सामर्थ्य और ज़रूरत के बीच एक सेतु है। चाहे गंभीर चिकित्सा स्थिति में तुरंत रक्त
          की व्यवस्था करना हो, कठिन समय में परिवारों की मदद करनी हो, या युवा पीढ़ी को शिक्षा और करियर में
          सफलता की राह दिखानी हो, हमारा लक्ष्य वही है।
        </p>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-maroon/70">हमारे मूल्य</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">हमारे उद्देश्य</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {objectives.map((o) => {
              const isDark = o.title === 'शिक्षा सर्वोपरि' || o.title === 'सम्मान'
              return (
                <div
                  key={o.title}
                  className={`flex gap-4 p-6 ${
                    isDark ? 'ledger-plaque !bg-none !bg-maroon-deep text-cream-paper' : 'ledger-plaque'
                  }`}
                >
                  <o.icon
                    size={28}
                    className={`mt-1 shrink-0 ${isDark ? 'text-gold-light' : 'text-saffron'}`}
                    strokeWidth={1.75}
                  />
                  <div>
                    <h3
                      className={`font-display text-lg font-semibold ${
                        isDark ? 'text-cream-paper' : 'text-maroon-deep'
                      }`}
                    >
                      {o.title}
                    </h3>
                    <p className={`mt-1.5 text-sm leading-relaxed ${isDark ? 'text-cream/80' : 'text-stone'}`}>
                      {o.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center lg:px-8">
        <p className="eyebrow text-maroon/70">हमारा ध्येय</p>
        <blockquote className="mt-3 font-display text-2xl font-semibold leading-snug text-maroon-deep sm:text-3xl">
          &ldquo;{site.mission}&rdquo;
        </blockquote>
      </section>
    </>
  )
}

