import ProgramsPanel from '../components/ProgramsPanel'

export default function AdminPrograms() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Programs & Activities</h1>
      <p className="mt-1 text-sm text-stone">
        Add and manage any Sangh program — blood donation camps, health checkups, cultural events, and more —
        with photos, videos, and participant details shown publicly on the website.
      </p>
      <div className="mt-6">
        <ProgramsPanel />
      </div>
    </div>
  )
}
