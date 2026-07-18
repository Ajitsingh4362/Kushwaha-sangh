import { useEffect, useState } from 'react'

export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative h-full w-full">
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {/* invisible spacer to preserve aspect ratio since images are absolutely positioned */}
      <img src={images[0].src} alt="" aria-hidden="true" className="invisible w-full" />

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((img, i) => (
          <button
            key={img.src}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition ${i === index ? 'bg-saffron' : 'bg-cream-paper/60'}`}
          />
        ))}
      </div>
    </div>
  )
}
