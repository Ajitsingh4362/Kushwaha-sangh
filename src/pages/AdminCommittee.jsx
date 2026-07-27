import CommitteePanel from '../components/CommitteePanel'

export default function AdminCommittee() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Committee</h1>
      <p className="mt-1 text-sm text-stone">Add, remove, and manage the committee members shown on the website.</p>
      <div className="mt-6">
        <CommitteePanel />
      </div>
    </div>
  )
}
