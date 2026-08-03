import { BookOpen, Target, HandHeart, GraduationCap, Sparkles, ShieldCheck, Rocket } from 'lucide-react'
import PageHero from '../components/PageHero'
import { site } from '../data/content'

const milestones = [
  {
    icon: Sparkles,
    year: '2017',
    title: 'The Spark of Unity',
    text: 'The initial gathering of community members to build a unified platform dedicated to social welfare, mutual assistance, and empowerment.',
  },
  {
    icon: ShieldCheck,
    year: '2023',
    title: 'Official Recognition & Structure',
    text: 'To scale our impact and operate with total transparency, the organization took a major leap forward by getting officially registered as a recognized association, establishing formal governance and dedicated welfare initiatives.',
  },
  {
    icon: Rocket,
    year: '2026',
    title: 'Digital Transformation',
    text: 'Embracing the modern era, Kushwaha Sangh launched its official web platform to connect community members globally, enable real-time emergency assistance (such as blood donation drives and medical support), and share community updates seamlessly.',
  },
]

const objectives = [
  {
    icon: HandHeart,
    title: 'Mutual Welfare',
    text: 'Standing by members through illness, hardship and emergencies with financial and community support.',
  },
  {
    icon: GraduationCap,
    title: 'Education First',
    text: "Enabling access to education through the girls' hostel, scholarships and mentorship from senior members.",
  },
  {
    icon: Target,
    title: 'Recognition',
    text: 'Celebrating members who excel academically, professionally or in public service — motivating the next generation.',
  },
  {
    icon: BookOpen,
    title: 'Transparency',
    text: 'Publishing yearly fund reports so every donor and member can see exactly how contributions are used.',
  },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="About the Sangh"
        blurb="A community coming together, one generation supporting the next."
      />

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="eyebrow text-maroon/70">History &amp; Objectives</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">
          The Journey of {site.name}: Rooted in Unity, Driven by Purpose
        </h2>
        <div className="prose-note mt-5 space-y-4 text-[1.05rem] leading-relaxed text-ink-light">
          <p>
            The story of {site.name} is a testament to the power of community, mutual support, and collective
            vision.
          </p>
          <p>
            Back in 2017, a group of visionary community leaders and successful professionals came together with
            a clear realization: individual success gains true meaning only when it helps elevate the entire
            society. With the core objectives of fostering deep-rooted unity, bringing successful community
            members onto a single platform, and creating a strong support network for those in need, the
            foundation of this collective movement was laid.
          </p>
          <p>
            What began in 2017 as informal meetings and spontaneous grassroots relief work soon grew into a
            dependable lifeline for families during medical emergencies, social distress, and financial
            hardship.
          </p>
        </div>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-maroon/70">Our Journey</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">Key Milestones</h2>
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
        <p className="eyebrow text-maroon/70">Our Purpose</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">
          Why {site.name} Exists Today
        </h2>
        <p className="prose-note mt-5 text-[1.05rem] leading-relaxed text-ink-light">
          Today, {site.name} stands as a bridge between capability and need. Whether it is arranging rapid
          emergency blood support in critical medical situations, assisting families during times of hardship, or
          guiding the younger generation toward educational and career success, our mission remains unchanged.
        </p>
      </section>

      <section className="bg-cream-deep/60 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-maroon/70">What We Stand For</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep">Our Objectives</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {objectives.map((o) => {
              const isDark = o.title === 'Education First' || o.title === 'Recognition'
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
        <p className="eyebrow text-maroon/70">Our Mission</p>
        <blockquote className="mt-3 font-display text-2xl font-semibold italic leading-snug text-maroon-deep sm:text-3xl">
          &ldquo;{site.mission}&rdquo;
        </blockquote>
      </section>
    </>
  )
}

