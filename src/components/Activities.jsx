import a1 from '../assets/activities/activity-1.jpg'
import a2 from '../assets/activities/activity-2.jpg'
import a3 from '../assets/activities/activity-3.jpg'
import a4 from '../assets/activities/activity-4.jpg'
import a5 from '../assets/activities/activity-5.jpg'
import a6 from '../assets/activities/activity-6.jpg'
import a7 from '../assets/activities/activity-7.jpg'
import a8 from '../assets/activities/activity-8.jpg'

const activityPhotos = [
  { id: 1, src: a1, alt: 'Certificate presented to a young achiever at the felicitation ceremony' },
  { id: 2, src: a2, alt: 'Sitamarhi Kushwaha Sangh Pratibha Samman Samaroh stage banner' },
  { id: 3, src: a3, alt: 'Guest presenting a memento at the felicitation ceremony' },
  { id: 4, src: a4, alt: 'Students seated on stage during the recognition ceremony' },
  { id: 5, src: a5, alt: 'Certificate handed to a young woman achiever' },
  { id: 6, src: a6, alt: 'Committee members lighting the ceremonial lamp' },
  { id: 7, src: a7, alt: 'Achiever receiving flowers and certificate on stage' },
  { id: 8, src: a8, alt: 'Community members gathered at a Sangh event' },
]

export default function Activities() {
  // Duplicate the list so the CSS animation can loop seamlessly.
  const track = [...activityPhotos, ...activityPhotos]

  return (
    <section className="overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">Moments &amp; Milestones</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">Activities</h2>
      </div>

      <div className="group relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-[scroll-x_36s_linear_infinite] gap-5 group-hover:[animation-play-state:paused]">
          {track.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="h-52 w-72 shrink-0 overflow-hidden rounded-sm border border-gold/40 bg-cream-deep/50"
            >
              <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
