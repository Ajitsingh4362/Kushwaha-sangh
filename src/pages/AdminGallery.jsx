import GalleryPanel from '../components/GalleryPanel'

export default function AdminGallery() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Gallery</h1>
      <p className="mt-1 text-sm text-stone">Upload and manage photos shown on the website's Gallery page.</p>
      <div className="mt-6">
        <GalleryPanel />
      </div>
    </div>
  )
}
