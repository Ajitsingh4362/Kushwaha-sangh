import ApplicationsPanel from '../components/ApplicationsPanel'

export default function AdminApplications() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Membership Applications</h1>
      <p className="mt-1 text-sm text-stone">
        New submissions from the website wait here — approve to add them as a real member, or reject to
        dismiss.
      </p>
      <div className="mt-6">
        <ApplicationsPanel />
      </div>
    </div>
  )
}
