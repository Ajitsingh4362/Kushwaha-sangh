import DonationsPanel from '../components/DonationsPanel'

export default function AdminDonations() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Donations</h1>
      <p className="mt-1 text-sm text-stone">Record donations and verify entries from the public Donate flow.</p>
      <div className="mt-6">
        <DonationsPanel />
      </div>
    </div>
  )
}
