import MembersDuesPanel from '../components/MembersDuesPanel'

export default function AdminDues() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Member Dues</h1>
      <p className="mt-1 text-sm text-stone">Add members, generate monthly dues, and track who has paid.</p>
      <div className="mt-6">
        <MembersDuesPanel />
      </div>
    </div>
  )
}
