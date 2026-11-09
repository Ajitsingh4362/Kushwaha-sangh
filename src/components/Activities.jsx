import a1 from '../assets/activities/activity-1.jpg'
import a2 from '../assets/activities/activity-2.jpg'
import a3 from '../assets/activities/activity-3.jpg'
import a4 from '../assets/activities/activity-4.jpg'
import a5 from '../assets/activities/activity-5.jpg'
import a6 from '../assets/activities/activity-6.jpg'
import a7 from '../assets/activities/activity-7.jpg'
import a8 from '../assets/activities/activity-8.jpg'

const activityPhotos = [
  { id: 1, src: a1, alt: 'सम्मान समारोह में एक युवा प्रतिभा को प्रमाण-पत्र प्रदान करते हुए' },
  { id: 2, src: a2, alt: 'सीतामढ़ी कुशवाहा संघ प्रतिभा सम्मान समारोह का मंच बैनर' },
  { id: 3, src: a3, alt: 'सम्मान समारोह में अतिथि स्मृति-चिह्न भेंट करते हुए' },
  { id: 4, src: a4, alt: 'सम्मान समारोह के दौरान मंच पर बैठे विद्यार्थी' },
  { id: 5, src: a5, alt: 'एक युवा प्रतिभाशाली छात्रा को प्रमाण-पत्र प्रदान करते हुए' },
  { id: 6, src: a6, alt: 'समिति के सदस्य दीप प्रज्वलित करते हुए' },
  { id: 7, src: a7, alt: 'मंच पर फूल और प्रमाण-पत्र प्राप्त करते हुए प्रतिभा' },
  { id: 8, src: a8, alt: 'संघ के कार्यक्रम में एकत्रित समाज के सदस्य' },
]

export default function Activities() {
  // Duplicate the list so the CSS animation can loop seamlessly.
  const track = [...activityPhotos, ...activityPhotos]

  return (
    <section className="overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="eyebrow text-center text-maroon/70">यादगार पल और उपलब्धियाँ</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold text-maroon-deep">गतिविधियाँ</h2>
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
