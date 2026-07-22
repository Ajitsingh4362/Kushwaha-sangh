import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
// QRCode import kept in place (commented usage below) — do not remove,
// this is the fallback/test flow before Razorpay is fully wired up.
import QRCode from 'react-qr-code'
import { donationMethods } from '../data/content'

// ---------------------------------------------------------------
// RAZORPAY INTEGRATION (currently active)
// ---------------------------------------------------------------
// This loads Razorpay's Checkout script on demand and opens the
// payment modal. `key` below is a PLACEHOLDER test key — replace
// with the Sangh's real Razorpay Key ID before launch.
// For a production flow, `order_id` should come from a backend call
// to Razorpay's Orders API (needs Key Secret, so must happen
// server-side — e.g. a Supabase Edge Function) rather than being
// created purely client-side as done here for now.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

async function openRazorpayCheckout({ onSuccess, onError }) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    onError?.('Could not load Razorpay. Check your internet connection.')
    return
  }

  const options = {
    key: 'rzp_test_REPLACE_WITH_REAL_KEY', // placeholder test key — replace before launch
    amount: 50000, // in paise → ₹500 default; swap for a user-entered amount if needed
    currency: 'INR',
    name: 'Kushwaha Sangh',
    description: 'Donation to Kushwaha Sangh',
    // order_id: 'order_xxxxxx', // required for production — generate server-side
    handler: function (response) {
      onSuccess?.(response)
    },
    prefill: {
      name: '',
      email: '',
      contact: '',
    },
    theme: {
      color: '#6E1423', // matches the site's maroon
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', function (response) {
    onError?.(response.error?.description || 'Payment failed.')
  })
  rzp.open()
}

export default function DonateQRButton() {
  // const [open, setOpen] = useState(false) // was used for the QR modal — see commented block below
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [errorMsg, setErrorMsg] = useState('')

  function handleDonateClick() {
    setStatus(null)
    openRazorpayCheckout({
      onSuccess: () => setStatus('success'),
      onError: (msg) => {
        setStatus('error')
        setErrorMsg(msg)
      },
    })
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 bg-cream-deep/60 py-8">
        <button
          type="button"
          onClick={handleDonateClick}
          className="animate-blink rounded-sm bg-saffron px-7 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-saffron-light"
        >
          Donate Now
        </button>
        <Link
          to="/membership"
          className="rounded-sm border border-maroon-deep px-7 py-3 text-sm font-semibold text-maroon-deep shadow transition hover:bg-maroon-deep hover:text-cream-paper"
        >
          Join Us
        </Link>
      </div>

      {status === 'success' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
          onClick={() => setStatus(null)}
        >
          <div className="ledger-plaque w-full max-w-xs p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold text-maroon-deep">Thank you! 🙏</h3>
            <p className="mt-2 text-sm text-stone">Your donation was received successfully.</p>
            <button
              type="button"
              onClick={() => setStatus(null)}
              className="mt-5 rounded-sm bg-maroon-deep px-5 py-2 text-sm font-semibold text-cream-paper"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
          onClick={() => setStatus(null)}
        >
          <div className="ledger-plaque w-full max-w-xs p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold text-maroon-deep">Payment Failed</h3>
            <p className="mt-2 text-sm text-stone">{errorMsg || 'Something went wrong. Please try again.'}</p>
            <button
              type="button"
              onClick={() => setStatus(null)}
              className="mt-5 rounded-sm bg-maroon-deep px-5 py-2 text-sm font-semibold text-cream-paper"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------
          OLD QR-CODE DONATE FLOW — kept here, commented out, per request.
          Re-enable by restoring the `open` state above and rendering
          this block again if Razorpay needs to be swapped back out.
      ----------------------------------------------------------------

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
            <p className="mt-1 text-xs text-stone">Test QR — replace with the Sangh's real UPI QR before launch.</p>
            <div className="mx-auto mt-5 w-fit bg-white p-3">
              <QRCode value={`upi://pay?pa=${donationMethods.upiId}&pn=Kushwaha%20Sangh&cu=INR`} size={180} />
            </div>
            <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
          </div>
        </div>
      )}

      --------------------------------------------------------------- */}
    </>
  )
}
