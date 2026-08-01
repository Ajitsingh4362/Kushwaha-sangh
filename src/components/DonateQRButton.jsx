import { Link } from 'react-router-dom'
import { useDonateModal } from '../lib/DonateModalContext'
import PayDuesButton from './PayDuesButton'
import { useLanguage } from '../lib/LanguageContext'

export default function DonateQRButton() {
  const { openModal } = useDonateModal()
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap justify-center gap-4 bg-cream-deep/60 py-8">
      <PayDuesButton />
      <button
        type="button"
        onClick={openModal}
        className="animate-blink rounded-sm bg-saffron px-7 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-saffron-light"
      >
        {t('Donate Now')}
      </button>
      <Link
        to="/membership"
        className="rounded-sm border border-maroon-deep px-7 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-maroon-deep hover:text-cream-paper"
      >
        {t('Join Us')}
      </Link>
    </div>
  )
}
