import { BookOpen, Target, HandHeart, GraduationCap } from 'lucide-react'
import PageHero from '../components/PageHero'
import { site } from '../data/content'

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
          Why {site.name} exists
        </h2>
        <div className="prose-note mt-5 space-y-4 text-[1.05rem] leading-relaxed text-ink-light">
          <p>
            {site.name} was founded by a small group of community members who believed that
            those who had found success owed a hand back to those still finding their footing.
            {' '}
            <em className="not-italic text-stone">
              [Replace this paragraph with the Sangh&rsquo;s real founding story — who started it, why, and what the early years looked like.]
            </em>
          </p>
          <p>
            What began as informal collections for families in need has grown into a registered
            association running a residential hostel, a standing health-assistance fund, and an
            annual recognition ceremony for the community&rsquo;s achievers.
            {' '}
            <em className="not-italic text-stone">
              [Add specific milestones — hostel founding year, fund launch, membership growth, etc.]
            </em>
          </p>
        </div>
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
