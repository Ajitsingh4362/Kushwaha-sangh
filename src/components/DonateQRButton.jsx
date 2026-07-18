import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import QRCode from 'react-qr-code'
import { donationMethods } from '../data/content'

export default function DonateQRButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 bg-cream-deep/60 py-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-sm bg-saffron px-7 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-saffron-light"
        >
          Donate via QR
        </button>
        <Link
          to="/membership"
          className="rounded-sm border border-maroon-deep px-7 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-maroon-deep hover:text-cream-paper"
        >
          Join Us
        </Link>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="ledger-plaque relative w-full max-w-xs p-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 text-stone hover:text-maroon"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-lg font-semibold text-maroon-deep">Scan to Donate</h3>
            <p className="mt-1 text-xs text-stone">Test QR — replace with the Sangh&rsquo;s real UPI QR before launch.</p>
            <div className="mx-auto mt-5 w-fit bg-white p-3">
              <QRCode value={`upi://pay?pa=${donationMethods.upiId}&pn=Kushwaha%20Sangh&cu=INR`} size={180} />
            </div>
            <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
          </div>
        </div>
      )}
    </>
  )
}
