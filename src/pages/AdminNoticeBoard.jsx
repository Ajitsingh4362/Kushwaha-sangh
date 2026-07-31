import NoticeBoardPanel from '../components/NoticeBoardPanel'

export default function AdminNoticeBoard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Notice Board</h1>
      <p className="mt-1 text-sm text-stone">
        Post updates with text and an optional photo — the latest active one pops up on the website and
        all of them appear on the News &amp; Notices page.
      </p>
      <div className="mt-6">
        <NoticeBoardPanel />
      </div>
    </div>
  )
}
