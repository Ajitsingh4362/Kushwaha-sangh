export function LedgerCard({ regNo, title, subtitle, children, className = '' }) {
  return (
    <div className={`ledger-plaque animate-rise p-6 ${className}`}>
      {regNo && <div className="ledger-number mb-2">Regd. {regNo}</div>}
      {title && <div className="font-display text-lg font-semibold text-maroon-deep">{title}</div>}
      {subtitle && <div className="mt-0.5 text-sm text-stone">{subtitle}</div>}
      {children}
    </div>
  )
}

export function StatPlaque({ value, label, id }) {
  return (
    <div className="ledger-plaque animate-rise flex flex-col items-center px-5 py-7 text-center">
      <span className="ledger-number">{id}</span>
      <span className="mt-2 font-display text-3xl font-bold text-maroon-deep sm:text-4xl">{value}</span>
      <span className="mt-1 text-sm text-stone">{label}</span>
    </div>
  )
}

export function PersonPlaque({ name, designation, regNo, note, featured = false }) {
  return (
    <div className={`ledger-plaque animate-rise flex flex-col items-center px-6 text-center ${featured ? 'py-9' : 'py-7'}`}>
      <div
        className={`grid place-items-center rounded-full border-2 border-gold bg-maroon-deep font-display font-semibold text-gold ${
          featured ? 'h-24 w-24 text-3xl' : 'h-20 w-20 text-2xl'
        }`}
      >
        {name
          .replace(/\u2019s Name/i, '')
          .trim()
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'KS'}
      </div>
      <div className={`mt-4 font-display font-semibold text-maroon-deep ${featured ? 'text-xl' : 'text-base'}`}>
        {name}
      </div>
      <div className="mt-0.5 text-sm text-saffron">{designation}</div>
      <div className="ledger-number mt-2">Regd. {regNo}</div>
      {note && <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">{note}</p>}
    </div>
  )
}
