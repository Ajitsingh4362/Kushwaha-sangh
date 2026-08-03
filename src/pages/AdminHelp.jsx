import HelpPanel from '../components/HelpPanel'

export default function AdminHelp() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Help Requests</h1>
      <p className="mt-1 text-sm text-stone">
        Requests submitted from the &ldquo;Help&rdquo; button on the website — respond and track their status here.
      </p>
      <div className="mt-6">
        <HelpPanel />
      </div>
    </div>
  )
}
