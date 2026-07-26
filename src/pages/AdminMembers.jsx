import MembersListPanel from '../components/MembersListPanel'

export default function AdminMembers() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">All Members</h1>
      <p className="mt-1 text-sm text-stone">
        Every member — added manually or via the website&rsquo;s Membership application form.
      </p>
      <div className="mt-6">
        <MembersListPanel />
      </div>
    </div>
  )
}
