'use client'

import { useState, useEffect } from 'react'

interface WarehouseInputs {
  squareFeet: number
  storageDuration: number
  palletCount: number
  specialHandling: boolean
  sqFtRate: number
  palletRate: number
  specialHandlingRate: number
  dailyOverhead: number
  quotedMonthlyRate: number
  targetMargin: number
}

interface CalculationResults {
  storageCost: number
  palletCost: number
  specialHandlingCost: number
  overheadCost: number
  totalCost: number
  revenue: number
  profit: number
  margin: number
  monthlyCost: number
}

const defaultInputs: WarehouseInputs = {
  squareFeet: 5000,
  storageDuration: 30,
  palletCount: 100,
  specialHandling: false,
  sqFtRate: 0.45,
  palletRate: 2.50,
  specialHandlingRate: 150,
  dailyOverhead: 125,
  quotedMonthlyRate: 8500,
  targetMargin: 25,
}

export default function WarehouseStorageCalculator() {
  const [inputs, setInputs] = useState<WarehouseInputs>(defaultInputs)
  const [results, setResults] = useState<CalculationResults | null>(null)

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const calculateResults = () => {
    const daysInMonth = 30
    const storageCost = inputs.squareFeet * inputs.sqFtRate * inputs.storageDuration
    const palletCost = inputs.palletCount * inputs.palletRate * inputs.storageDuration
    const specialHandlingCost = inputs.specialHandling ? inputs.specialHandlingRate * inputs.storageDuration : 0
    const overheadCost = inputs.dailyOverhead * inputs.storageDuration
    const totalCost = storageCost + palletCost + specialHandlingCost + overheadCost
    const revenue = inputs.quotedMonthlyRate
    const profit = revenue - totalCost
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    const monthlyCost = (totalCost / inputs.storageDuration) * daysInMonth

    setResults({
      storageCost,
      palletCost,
      specialHandlingCost,
      overheadCost,
      totalCost,
      revenue,
      profit,
      margin,
      monthlyCost,
    })
  }

  const updateInput = (field: keyof WarehouseInputs, value: number | boolean) => {
    setInputs({ ...inputs, [field]: value })
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
      <div className="flex items-center space-x-3">
        <span className="text-4xl">🏭</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Storage</h1>
          <p className="text-gray-600">Estimate storage fees and space costs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Storage Requirements
            </h2>
            
            <div className="space-y-4">
              <InputField
                label="Square Feet Required"
                value={inputs.squareFeet}
                onChange={(val) => updateInput('squareFeet', val)}
                suffix="sq ft"
                min={100}
              />
              <InputField
                label="Storage Duration"
                value={inputs.storageDuration}
                onChange={(val) => updateInput('storageDuration', val)}
                suffix="days"
                min={1}
              />
              <InputField
                label="Number of Pallets"
                value={inputs.palletCount}
                onChange={(val) => updateInput('palletCount', val)}
                min={0}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specialHandling"
                  checked={inputs.specialHandling}
                  onChange={(e) => updateInput('specialHandling', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="specialHandling" className="text-sm font-semibold text-gray-700">
                  Requires Special Handling (Climate Control, Security)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Cost & Rate Inputs
            </h2>
            
            <div className="space-y-4">
              <InputField
                label="Rate per Square Foot per Day"
                value={inputs.sqFtRate}
                onChange={(val) => updateInput('sqFtRate', val)}
                prefix="$"
                step={0.01}
              />
              <InputField
                label="Rate per Pallet per Day"
                value={inputs.palletRate}
                onChange={(val) => updateInput('palletRate', val)}
                prefix="$"
                step={0.10}
              />
              {inputs.specialHandling && (
                <InputField
                  label="Special Handling Rate per Day"
                  value={inputs.specialHandlingRate}
                  onChange={(val) => updateInput('specialHandlingRate', val)}
                  prefix="$"
                  step={5}
                />
              )}
              <InputField
                label="Daily Overhead Allocation"
                value={inputs.dailyOverhead}
                onChange={(val) => updateInput('dailyOverhead', val)}
                prefix="$"
              />
              <InputField
                label="Your Quoted Monthly Rate"
                value={inputs.quotedMonthlyRate}
                onChange={(val) => updateInput('quotedMonthlyRate', val)}
                prefix="$"
                step={100}
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
              label="Total Cost"
              value={results ? formatCompact(results.totalCost) : '$0'}
            />
            <StatCard
              label="Monthly Est."
              value={results ? formatCompact(results.monthlyCost) : '$0'}
            />
            <StatCard
              label="Revenue"
              value={results ? formatCompact(results.revenue) : '$0'}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Cost Breakdown ({inputs.storageDuration} days)
            </h2>
            
            <div className="space-y-3">
              <ResultRow
                label="Storage Space Cost"
                value={results ? formatCurrency(results.storageCost) : '$0'}
              />
              <ResultRow
                label="Pallet Management Cost"
                value={results ? formatCurrency(results.palletCost) : '$0'}
              />
              {inputs.specialHandling && (
                <ResultRow
                  label="Special Handling Cost"
                  value={results ? formatCurrency(results.specialHandlingCost) : '$0'}
                />
              )}
              <ResultRow
                label="Overhead"
                value={results ? formatCurrency(results.overheadCost) : '$0'}
              />
              <hr className="my-2" />
              <ResultRow
                label="Total Cost"
                value={results ? formatCurrency(results.totalCost) : '$0'}
                bold
              />
              <ResultRow
                label="Est. Monthly Cost"
                value={results ? formatCurrency(results.monthlyCost) : '$0'}
              />
              <hr className="my-2" />
              <ResultRow
                label="Monthly Revenue"
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
                ? `✓ Strong. ${formatCurrency(inputs.quotedMonthlyRate)}/month delivers ${results.margin.toFixed(1)}% margin for ${inputs.squareFeet} sq ft.`
                : results.margin >= 0
                ? `⚠ Profitable but below target. Currently at ${results.margin.toFixed(1)}% margin. Target: ${inputs.targetMargin}%.`
                : `✗ Below break-even. Losing ${formatCurrency(Math.abs(results.profit))} monthly.`
              }
            </div>
          )}
        </div>
      </div>
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
