import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <div className="ledger-plaque p-8">
        <span className="ledger-number">Entry Not Found</span>
        <p className="mt-3 font-display text-4xl font-bold text-maroon-deep">404</p>
        <p className="mt-2 text-stone">This page isn&rsquo;t in the register. It may have moved.</p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep hover:bg-saffron-light"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}
