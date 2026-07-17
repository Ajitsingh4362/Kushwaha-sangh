export function Field({ label, id, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-maroon-deep">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/60 focus:border-saffron"
        {...props}
      />
    </div>
  )
}

export function TextAreaField({ label, id, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-maroon-deep">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={4}
        className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-stone/60 focus:border-saffron"
        {...props}
      />
    </div>
  )
}

export function SelectField({ label, id, options, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-maroon-deep">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
