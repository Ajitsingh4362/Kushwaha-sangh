import { useEffect, useRef, useState } from 'react'

// Parses "500+", "2,400+", "14%", "10" into a numeric target plus
// prefix/suffix, so we can animate the number while keeping any
// surrounding characters intact.
function parseValue(raw) {
  const match = String(raw).match(/^([^\d]*)([\d,]+)(.*)$/)
  if (!match) return { prefix: '', number: null, suffix: raw }
  const [, prefix, digits, suffix] = match
  return { prefix, number: parseInt(digits.replace(/,/g, ''), 10), suffix }
}

export default function AnimatedCounter({ value, duration = 1400 }) {
  const { prefix, number, suffix } = parseValue(value)
  const [display, setDisplay] = useState(number === null ? value : 0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (number === null) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * number))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [number, duration])

  if (number === null) {
    return <span ref={ref}>{value}</span>
  }

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
