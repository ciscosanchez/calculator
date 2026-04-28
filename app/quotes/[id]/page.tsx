'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Quote {
  id: string
  quoteNumber: string
  projectName: string
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  calculatorType: string
  totalCost: number
  totalPrice: number
  marginPercent: number
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string | null
    email: string
  }
  location: {
    name: string
  }
  lineItems: {
    id: string
    description: string
    quantity: number
    unit: string
    unitCost: number
    totalCost: number
  }[]
  metadata: any
}

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    projectName: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    status: 'DRAFT',
    notes: '',
  })

  useEffect(() => {
    fetchQuote()
  }, [params.id])

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/quotes/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setQuote(data)
        setFormData({
          projectName: data.projectName || '',
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerPhone: data.customerPhone || '',
          status: data.status || 'DRAFT',
          notes: data.notes || '',
        })
      } else {
        router.push('/quotes')
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error)
      router.push('/quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!quote) return

    setSaving(true)
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalCost: quote.totalCost,
          totalPrice: quote.totalPrice,
          marginPercent: quote.marginPercent,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setQuote(updated)
        setEditing(false)
      }
    } catch (error) {
      console.error('Failed to save quote:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!quote || !confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/quotes/${quote.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.push('/quotes')
      }
    } catch (error) {
      console.error('Failed to delete quote:', error)
      setDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    if (!quote) return

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorType: quote.calculatorType,
          projectName: `${quote.projectName} (Copy)`,
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          customerPhone: quote.customerPhone,
          inputs: quote.metadata,
          totalCost: quote.totalCost,
          totalPrice: quote.totalPrice,
          marginPercent: quote.marginPercent,
          notes: quote.notes,
          lineItems: quote.lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitCost: item.unitCost,
            totalCost: item.totalCost,
          })),
        }),
      })

      if (res.ok) {
        const newQuote = await res.json()
        router.push(`/quotes/${newQuote.id}`)
      }
    } catch (error) {
      console.error('Failed to duplicate quote:', error)
    }
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 20) return 'text-green-600 bg-green-50'
    if (margin >= 10) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'SENT': return 'bg-blue-100 text-blue-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!quote) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/quotes" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block">
            ← Back to Quotes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{quote.quoteNumber}</h1>
          <p className="text-gray-600 mt-1">Created {new Date(quote.createdAt).toLocaleDateString()} by {quote.user.name || quote.user.email}</p>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    projectName: quote.projectName || '',
                    customerName: quote.customerName || '',
                    customerEmail: quote.customerEmail || '',
                    customerPhone: quote.customerPhone || '',
                    status: quote.status || 'DRAFT',
                    notes: quote.notes || '',
                  })
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={handleDuplicate}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Duplicate
              </button>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Quote
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className={`bg-white rounded-lg border-2 p-6 ${getMarginColor(quote.marginPercent)}`}>
          <div className="text-sm font-semibold uppercase opacity-75 mb-2">Margin</div>
          <div className="text-4xl font-bold">{quote.marginPercent.toFixed(1)}%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Total Cost</div>
          <div className="text-4xl font-bold text-gray-900">${quote.totalCost.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase mb-2">Revenue</div>
          <div className="text-4xl font-bold text-gray-900">${quote.totalPrice.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quote Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
            {editing ? (
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-gray-900">{quote.projectName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Calculator Type</label>
            <p className="text-gray-900">{quote.calculatorType.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
            {editing ? (
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-gray-900">{quote.customerName || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            {editing ? (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            ) : (
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                {quote.status}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Email</label>
            {editing ? (
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-gray-900">{quote.customerEmail || '-'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Phone</label>
            {editing ? (
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-gray-900">{quote.customerPhone || '-'}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <p className="text-gray-900">{quote.location.name}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            {editing ? (
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{quote.notes || '-'}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Line Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Unit</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quote.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No line items
                  </td>
                </tr>
              ) : (
                quote.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">${item.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">${item.totalCost.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {quote.lineItems.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right text-sm font-bold text-gray-900">TOTAL</td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-gray-900">${quote.totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
