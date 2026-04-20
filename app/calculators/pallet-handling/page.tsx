'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PalletInputs {
  palletCount: number
  unloadTime: number
  storageTime: number
  reloadTime: number
  laborRate: number
  equipmentRate: number
  storageCostPerPallet: number
  quotedRate: number
  targetMargin: number
}

interface CalculationResults {
  totalHours: number
  laborCost: number
  equipmentCost: number
  storageCost: number
  totalCost: number
  revenue: number
  profit: number
  margin: number
  costPerPallet: number
}

const defaultInputs: PalletInputs = {
  palletCount: 40,
  unloadTime: 0.05,
  storageTime: 7,
  reloadTime: 0.05,
  laborRate: 21.50,
  equipmentRate: 12.00,
  storageCostPerPallet: 2.50,
  quotedRate: 35,
  targetMargin: 20,
}

export default function PalletHandlingCalculator() {
  const router = useRouter()
  const [inputs, setInputs] = useState<PalletInputs>(defaultInputs)
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveData, setSaveData] = useState({
    projectName: '',
    customerName: '',
    notes: ''
  })

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const calculateResults = () => {
    const totalHandlingTime = (inputs.unloadTime + inputs.reloadTime) * inputs.palletCount
    const laborCost = totalHandlingTime * inputs.laborRate
    const equipmentCost = totalHandlingTime * inputs.equipmentRate
    const storageCost = inputs.palletCount * inputs.storageCostPerPallet * inputs.storageTime
    const totalCost = laborCost + equipmentCost + storageCost
    const revenue = inputs.palletCount * inputs.quotedRate
    const profit = revenue - totalCost
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    const costPerPallet = inputs.palletCount > 0 ? totalCost / inputs.palletCount : 0

    setResults({
      totalHours: totalHandlingTime,
      laborCost,
      equipmentCost,
      storageCost,
      totalCost,
      revenue,
      profit,
      margin,
      costPerPallet,
    })
  }

  const updateInput = (field: keyof PalletInputs, value: number) => {
    setInputs({ ...inputs, [field]: value })
  }

  const handleSaveQuote = async () => {
    if (!results || !saveData.projectName) return

    setSaving(true)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorType: 'PALLET_HANDLING',
          projectName: saveData.projectName,
          customerName: saveData.customerName || null,
          inputs: inputs,
          totalCost: results.totalCost,
          totalPrice: results.revenue,
          marginPercent: results.margin,
          notes: saveData.notes || null,
          lineItems: [
            { description: 'Labor Cost', quantity: results.totalHours, unitCost: inputs.laborRate, totalCost: results.laborCost, unit: 'hrs' },
            { description: 'Equipment Cost', quantity: results.totalHours, unitCost: inputs.equipmentRate, totalCost: results.equipmentCost, unit: 'hrs' },
            { description: 'Storage Cost', quantity: inputs.palletCount * inputs.storageTime, unitCost: inputs.storageCostPerPallet, totalCost: results.storageCost, unit: 'pallet-days' },
          ]
        })
      })

      if (response.ok) {
        setShowSaveModal(false)
        setSaveData({ projectName: '', customerName: '', notes: '' })
        router.push('/quotes')
      } else {
        alert('Failed to save quote. Please try again.')
      }
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Failed to save quote. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value))
  }

  const formatCompact = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `$${(Math.abs(value) / 1000).toFixed(1)}K`
    }
    return `$${Math.abs(value).toFixed(0)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">📦</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pallet Handling & Storage</h1>
            <p className="text-gray-600">Calculate handling and storage costs</p>
          </div>
        </div>
        <button
          onClick={() => setShowSaveModal(true)}
          disabled={!results}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Save Quote
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Handling Details
            </h2>
            
            <div className="space-y-4">
              <InputField
                label="Number of Pallets"
                value={inputs.palletCount}
                onChange={(val) => updateInput('palletCount', val)}
                min={1}
              />
              <InputField
                label="Unload Time per Pallet"
                value={inputs.unloadTime}
                onChange={(val) => updateInput('unloadTime', val)}
                suffix="hrs"
                step={0.01}
              />
              <InputField
                label="Storage Duration"
                value={inputs.storageTime}
                onChange={(val) => updateInput('storageTime', val)}
                suffix="days"
              />
              <InputField
                label="Reload Time per Pallet"
                value={inputs.reloadTime}
                onChange={(val) => updateInput('reloadTime', val)}
                suffix="hrs"
                step={0.01}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Cost & Rate Inputs
            </h2>
            
            <div className="space-y-4">
              <InputField
                label="Labor Rate"
                value={inputs.laborRate}
                onChange={(val) => updateInput('laborRate', val)}
                prefix="$"
                suffix="/hr"
                step={0.25}
              />
              <InputField
                label="Equipment Rate (Forklift)"
                value={inputs.equipmentRate}
                onChange={(val) => updateInput('equipmentRate', val)}
                prefix="$"
                suffix="/hr"
                step={0.50}
              />
              <InputField
                label="Storage Cost per Pallet per Day"
                value={inputs.storageCostPerPallet}
                onChange={(val) => updateInput('storageCostPerPallet', val)}
                prefix="$"
                step={0.10}
              />
              <InputField
                label="Your Quoted Rate per Pallet"
                value={inputs.quotedRate}
                onChange={(val) => updateInput('quotedRate', val)}
                prefix="$"
                step={1}
              />
              <InputField
                label="Target Margin"
                value={inputs.targetMargin}
                onChange={(val) => updateInput('targetMargin', val)}
                suffix="%"
                min={1}
                max={99}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Labor Hours"
              value={results ? `${results.totalHours.toFixed(1)}h` : '0h'}
            />
            <StatCard
              label="Total Cost"
              value={results ? formatCompact(results.totalCost) : '$0'}
            />
            <StatCard
              label="Revenue"
              value={results ? formatCompact(results.revenue) : '$0'}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Cost Breakdown
            </h2>
            
            <div className="space-y-3">
              <ResultRow
                label="Labor Cost"
                value={results ? formatCurrency(results.laborCost) : '$0'}
              />
              <ResultRow
                label="Equipment Cost"
                value={results ? formatCurrency(results.equipmentCost) : '$0'}
              />
              <ResultRow
                label="Storage Cost"
                value={results ? formatCurrency(results.storageCost) : '$0'}
              />
              <hr className="my-2" />
              <ResultRow
                label="Total Cost"
                value={results ? formatCurrency(results.totalCost) : '$0'}
                bold
              />
              <ResultRow
                label="Cost per Pallet"
                value={results ? formatCurrency(results.costPerPallet) : '$0'}
              />
              <hr className="my-2" />
              <ResultRow
                label="Total Revenue"
                value={results ? formatCurrency(results.revenue) : '$0'}
              />
              <ResultRow
                label="Net Profit / Loss"
                value={results ? `${results.profit >= 0 ? '+' : '-'}${formatCurrency(Math.abs(results.profit))}` : '$0'}
                valueClass={results && results.profit >= 0 ? 'text-green-600' : 'text-red-600'}
              />
              <ResultRow
                label="Gross Margin"
                value={results ? `${results.margin.toFixed(1)}%` : '0%'}
                valueClass={
                  results
                    ? results.margin >= inputs.targetMargin
                      ? 'text-green-600'
                      : results.margin >= 0
                      ? 'text-amber-600'
                      : 'text-red-600'
                    : ''
                }
              />
            </div>
          </div>

          {results && (
            <div className={`p-4 rounded-lg text-sm font-medium leading-relaxed ${
              results.margin >= inputs.targetMargin
                ? 'bg-green-50 border-l-4 border-green-500 text-green-800'
                : results.margin >= 0
                ? 'bg-amber-50 border-l-4 border-amber-500 text-amber-800'
                : 'bg-red-50 border-l-4 border-red-500 text-red-800'
            }`}>
              {results.margin >= inputs.targetMargin
                ? `✓ Strong. ${formatCurrency(inputs.quotedRate)}/pallet delivers ${results.margin.toFixed(1)}% margin on ${inputs.palletCount} pallets.`
                : results.margin >= 0
                ? `⚠ Profitable but below target. Currently at ${results.margin.toFixed(1)}% margin. Target: ${inputs.targetMargin}%.`
                : `✗ Below break-even. Losing ${formatCurrency(Math.abs(results.profit))} on this job.`
              }
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Save Quote</h2>
            
            {results && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-semibold">${results.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold">${results.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margin:</span>
                  <span className={`font-semibold ${results.margin >= 20 ? 'text-green-600' : results.margin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {results.margin.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={saveData.projectName}
                  onChange={(e) => setSaveData({ ...saveData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ABC Warehouse Pallet Handling"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={saveData.customerName}
                  onChange={(e) => setSaveData({ ...saveData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={saveData.notes}
                  onChange={(e) => setSaveData({ ...saveData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuote}
                  disabled={!saveData.projectName || saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Quote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface InputFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  min?: number
  max?: number
  step?: number
}

function InputField({ label, value, onChange, prefix, suffix, min, max, step = 1 }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        {prefix && <span className="text-sm font-semibold text-blue-900">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-blue-50 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
        />
        {suffix && <span className="text-sm font-semibold text-blue-900 whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 text-center">
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-blue-300 uppercase tracking-wide mt-1">{label}</div>
    </div>
  )
}

interface ResultRowProps {
  label: string
  value: string
  bold?: boolean
  valueClass?: string
}

function ResultRow({ label, value, bold, valueClass }: ResultRowProps) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={`text-gray-600 ${bold ? 'font-bold' : ''}`}>{label}</span>
      <span className={`font-bold ${valueClass || ''}`}>{value}</span>
    </div>
  )
}
