import PageHero from '../components/PageHero'
import CommitteeSection from '../components/CommitteeSection'

// No longer in the menu (the committee now shows on the सदस्य page),
// kept so old /committee links still work.
export default function Committee() {
  return (
    <>
      <PageHero
        eyebrow="पदाधिकारी"
        title="समिति"
        blurb="संघ के रोज़मर्रा के कामकाज को संभालने वाले पदाधिकारी और कार्यकारिणी सदस्य।"
      />
      <CommitteeSection />
    </>
  )
}
