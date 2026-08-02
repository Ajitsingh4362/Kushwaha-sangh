import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, X, Receipt, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field, TextAreaField, SelectField } from './FormField'

export const EXPENSE_CATEGORIES = [
  'Program / Event',
  'Medical / Health Camp',
  'Office & Admin',
  'Welfare Assistance',
  'Maintenance',
  'Printing & Publicity',
  'Other',
]

const EMPTY_FORM = {
  id: null,
  title: '',
  category: EXPENSE_CATEGORIES[0],
  amount: '',
  expense_date: '',
  paid_to: '',
  note: '',
}

export default function ExpensesPanel() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(EMPTY_FORM)
  const [formKey, setFormKey] = useState(0)
  const [existingReceiptPath, setExistingReceiptPath] = useState('')
  const [receiptFile, setReceiptFile] = useState(null)

  const [monthFilter, setMonthFilter] = useState('all')

  function loadData() {
    setLoading(true)
    supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })
      .then(({ data }) => {
        setExpenses(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('expenses-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  function resetForm() {
    setFormKey((k) => k + 1)
    setForm(EMPTY_FORM)
    setExistingReceiptPath('')
    setReceiptFile(null)
    setError('')
  }

  function handleEdit(expense) {
    setFormKey((k) => k + 1)
    setForm({
      id: expense.id,
      title: expense.title || '',
      category: expense.category || EXPENSE_CATEGORIES[0],
      amount: expense.amount ?? '',
      expense_date: expense.expense_date || '',
      paid_to: expense.paid_to || '',
      note: expense.note || '',
    })
    setExistingReceiptPath(expense.receipt_url || '')
    setReceiptFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.amount || !form.expense_date) {
      setError('Title, amount, and date are required.')
      return
    }
    setError('')
    setSaving(true)

    try {
      let receiptPath = existingReceiptPath
      if (receiptFile) {
        const path = `${Date.now()}-${receiptFile.name}`
        const { error: uploadError } = await supabase.storage.from('expense-receipts').upload(path, receiptFile)
        if (uploadError) throw new Error('Receipt upload failed. Please try again.')
        receiptPath = path
      }

      const payload = {
        title: form.title.trim(),
        category: form.category,
        amount: Number(form.amount),
        expense_date: form.expense_date,
        paid_to: form.paid_to.trim() || null,
        note: form.note.trim() || null,
        receipt_url: receiptPath || null,
      }

      if (form.id) {
        const { error: updateError } = await supabase.from('expenses').update(payload).eq('id', form.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('expenses').insert(payload)
        if (insertError) throw insertError
      }

      resetForm()
      loadData()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(expense) {
    if (!window.confirm(`Delete "${expense.title}"? This cannot be undone.`)) return
    setSaving(true)
    await supabase.from('expenses').delete().eq('id', expense.id)
    setSaving(false)
    loadData()
  }

  async function viewReceipt(path) {
    const { data, error: signError } = await supabase.storage.from('expense-receipts').createSignedUrl(path, 300)
    if (signError || !data?.signedUrl) {
      alert('Could not open receipt. Please try again.')
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  const months = Array.from(new Set(expenses.map((e) => e.expense_date?.slice(0, 7)).filter(Boolean))).sort().reverse()
  const filtered = monthFilter === 'all' ? expenses : expenses.filter((e) => e.expense_date?.slice(0, 7) === monthFilter)

  const totalAll = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const totalFiltered = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

  const currentMonthKey = new Date().toISOString().slice(0, 7)
  const totalThisMonth = expenses
    .filter((e) => e.expense_date?.slice(0, 7) === currentMonthKey)
    .reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="space-y-8">
      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Total Spent (All Time)</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">₹{totalAll.toLocaleString('en-IN')}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">This Month</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">₹{totalThisMonth.toLocaleString('en-IN')}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Total Entries</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{expenses.length}</p>
        </div>
      </div>

      {/* FORM */}
      <form key={formKey} onSubmit={handleSubmit} className="ledger-plaque space-y-5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-maroon-deep">
            {form.id ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          {form.id && (
            <button type="button" onClick={resetForm} className="flex items-center gap-1 text-sm text-stone hover:text-maroon-deep">
              <X size={14} /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="title"
            label="Expense Title"
            type="text"
            placeholder="e.g. Tent & Chairs — Blood Donation Camp"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <SelectField
            id="category"
            label="Category"
            options={EXPENSE_CATEGORIES}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <Field
            id="amount"
            label="Amount (₹)"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <Field
            id="expense_date"
            label="Date"
            type="date"
            value={form.expense_date}
            onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
          />
          <Field
            id="paid_to"
            label="Paid To (vendor / person)"
            type="text"
            value={form.paid_to}
            onChange={(e) => setForm((f) => ({ ...f, paid_to: e.target.value }))}
            className="sm:col-span-2"
          />
        </div>

        <TextAreaField
          id="note"
          label="Note (optional)"
          placeholder="Any additional detail about this expense"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
        />

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Receipt size={14} /> Receipt / Bill (optional)
          </label>
          {existingReceiptPath && !receiptFile && (
            <button
              type="button"
              onClick={() => viewReceipt(existingReceiptPath)}
              className="mb-2 flex items-center gap-1 text-xs font-medium text-maroon-deep hover:underline"
            >
              <Eye size={12} /> View current receipt
            </button>
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            className="block text-sm text-stone"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          {form.id ? <Pencil size={16} /> : <Plus size={16} />}
          {saving ? 'Saving…' : form.id ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      {/* LIST */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-maroon-deep">
            Expense History {monthFilter !== 'all' && `— ₹${totalFiltered.toLocaleString('en-IN')}`}
          </h3>
          {months.length > 0 && (
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border border-gold/40 bg-cream-paper px-3 py-1.5 text-sm text-ink focus:border-saffron"
            >
              <option value="all">All months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {new Date(`${m}-01`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <p className="mt-4 text-stone">Loading…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Paid To</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 pr-4 font-medium">Receipt</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 pr-4 text-stone">
                      {new Date(e.expense_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 pr-4 font-medium text-ink">{e.title}</td>
                    <td className="py-3 pr-4 text-xs text-stone">{e.category}</td>
                    <td className="py-3 pr-4 text-stone">{e.paid_to || '—'}</td>
                    <td className="py-3 pr-4 text-ink">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">
                      {e.receipt_url ? (
                        <button onClick={() => viewReceipt(e.receipt_url)} className="flex items-center gap-1 text-xs text-maroon-deep hover:underline">
                          <Eye size={12} /> View
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(e)} className="flex items-center gap-1 text-xs font-medium text-maroon-deep hover:underline">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => handleDelete(e)} disabled={saving} className="flex items-center gap-1 text-xs font-medium text-red-700 hover:underline">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-stone">
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
