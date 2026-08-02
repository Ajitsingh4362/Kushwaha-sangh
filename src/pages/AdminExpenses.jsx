import ExpensesPanel from '../components/ExpensesPanel'

export default function AdminExpenses() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-maroon-deep sm:text-3xl">Expenses</h1>
      <p className="mt-1 text-sm text-stone">
        Track every rupee the Sangh spends — program costs, welfare assistance, admin expenses — with receipts
        attached for your own records.
      </p>
      <div className="mt-6">
        <ExpensesPanel />
      </div>
    </div>
  )
}
