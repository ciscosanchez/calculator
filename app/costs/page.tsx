'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface CostTemplate {
  id: string
  category: string
  name: string
  baseValue: number
  unit: string
  active: boolean
  description?: string
}

export default function CostsPage() {
  const { data: session } = useSession()
  const [costs, setCosts] = useState<CostTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCost, setEditingCost] = useState<CostTemplate | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    category: 'LABOR',
    name: '',
    baseValue: 0,
    unit: '/hr',
    description: ''
  })

  useEffect(() => {
    fetchCosts()
  }, [])

  const fetchCosts = async () => {
    try {
      const res = await fetch('/api/costs')
      if (res.ok) {
        const data = await res.json()
        setCosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch costs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const method = editingCost ? 'PUT' : 'POST'
      const body = editingCost
        ? { ...formData, id: editingCost.id, active: editingCost.active }
        : formData

      const res = await fetch('/api/costs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        await fetchCosts()
        resetForm()
      } else {
        alert('Failed to save cost template')
      }
    } catch (error) {
      console.error('Error saving cost:', error)
      alert('Failed to save cost template')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cost template?')) return

    try {
      const res = await fetch(`/api/costs?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchCosts()
      } else {
        alert('Failed to delete cost template')
      }
    } catch (error) {
      console.error('Error deleting cost:', error)
      alert('Failed to delete cost template')
    }
  }

  const openEditModal = (cost: CostTemplate) => {
    setEditingCost(cost)
    setFormData({
      category: cost.category,
      name: cost.name,
      baseValue: cost.baseValue,
      unit: cost.unit,
      description: cost.description || ''
    })
    setShowModal(true)
  }

  const openCreateModal = (category: string) => {
    setEditingCost(null)
    setFormData({
      category,
      name: '',
      baseValue: 0,
      unit: category === 'LABOR' ? '/hr' : category === 'EQUIPMENT' ? '/hr' : '',
      description: ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingCost(null)
    setFormData({ category: 'LABOR', name: '', baseValue: 0, unit: '/hr', description: '' })
  }

  const costsByCategory = {
    LABOR: costs.filter(c => c.category === 'LABOR'),
    EQUIPMENT: costs.filter(c => c.category === 'EQUIPMENT'),
    OVERHEAD: costs.filter(c => c.category === 'OVERHEAD')
  }

  const canEdit = !!(session?.user && (session.user as any).role !== 'USER')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cost Management</h1>
        <p className="mt-2 text-gray-600">Configure labor rates, equipment costs, and overhead allocations</p>
      </div>

      {!canEdit && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="text-sm font-bold text-amber-900 mb-1">Read-Only View</h3>
              <p className="text-sm text-amber-800">
                You can view cost templates, but editing requires Admin or Super Admin privileges.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Labor Rates</h2>
            {canEdit && (
              <button
                onClick={() => openCreateModal('LABOR')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Rate
              </button>
            )}
          </div>

          <div className="space-y-4">
            {costsByCategory.LABOR.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No labor rates configured</p>
            ) : (
              costsByCategory.LABOR.map(cost => (
                <CostItem
                  key={cost.id}
                  cost={cost}
                  onEdit={() => openEditModal(cost)}
                  onDelete={() => handleDelete(cost.id)}
                  canEdit={canEdit}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Equipment Costs</h2>
            {canEdit && (
              <button
                onClick={() => openCreateModal('EQUIPMENT')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Equipment
              </button>
            )}
          </div>

          <div className="space-y-4">
            {costsByCategory.EQUIPMENT.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No equipment costs configured</p>
            ) : (
              costsByCategory.EQUIPMENT.map(cost => (
                <CostItem
                  key={cost.id}
                  cost={cost}
                  onEdit={() => openEditModal(cost)}
                  onDelete={() => handleDelete(cost.id)}
                  canEdit={canEdit}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Overhead Allocations</h2>
            {canEdit && (
              <button
                onClick={() => openCreateModal('OVERHEAD')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Overhead
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {costsByCategory.OVERHEAD.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4 col-span-2">No overhead allocations configured</p>
            ) : (
              costsByCategory.OVERHEAD.map(cost => (
                <CostItem
                  key={cost.id}
                  cost={cost}
                  onEdit={() => openEditModal(cost)}
                  onDelete={() => handleDelete(cost.id)}
                  canEdit={canEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">About Cost Management</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              These cost templates are used as defaults in all calculators. Super Admins can create global templates 
              that apply to all tenants, while Admins can create tenant-specific templates for their organization.
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCost ? 'Edit Cost Template' : 'New Cost Template'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={!!editingCost}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                >
                  <option value="LABOR">Labor</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="OVERHEAD">Overhead</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Driver - Loaded Rate"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Base Value *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.baseValue}
                  onChange={(e) => setFormData({ ...formData, baseValue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., /hr, /mi, /day"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Optional description..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || formData.baseValue <= 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {editingCost ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface CostItemProps {
  cost: CostTemplate
  onEdit: () => void
  onDelete: () => void
  canEdit: boolean
}

function CostItem({ cost, onEdit, onDelete, canEdit }: CostItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{cost.name}</span>
        </div>
        {cost.description && (
          <p className="text-xs text-gray-500 mt-0.5">{cost.description}</p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-bold text-gray-900">
          ${cost.baseValue.toFixed(2)}{cost.unit}
        </span>
        {canEdit && (
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
