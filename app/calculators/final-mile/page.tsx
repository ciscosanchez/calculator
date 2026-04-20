'use client'

import { useState, useEffect } from 'react'

interface FinalMileInputs {
  stops: number
  miles: number
  minPerStop: number
  driveHours: number
  crewSize: number
  laborRate: number
  fuelCostPerMile: number
  truckCostPerMile: number
  overhead: number
  quotedRate: number
  targetMargin: number
}

interface CalculationResults {
  totalHours: number
  laborCost: number
  fuelCost: number
  truckCost: number
  totalCost: number
  revenue: number
  profit: number
  margin: number
  costPerStop: number
  breakEvenPerStop: number
  targetRate: number
}

const defaultInputs: FinalMileInputs = {
  stops: 8,
  miles: 95,
  minPerStop: 35,
  driveHours: 2.5,
  crewSize: 2,
  laborRate: 23.76,
  fuelCostPerMile: 0.68,
  truckCostPerMile: 0.45,
  overhead: 65,
  quotedRate: 95,
  targetMargin: 20,
}

export default function FinalMileCalculator() {
  const [inputs, setInputs] = useState<FinalMileInputs>(defaultInputs)
  const [results, setResults] = useState<CalculationResults | null>(null)

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const calculateResults = () => {
    const stopHours = (inputs.stops * inputs.minPerStop) / 60
    const totalHours = stopHours + inputs.driveHours
    const laborCost = totalHours * inputs.crewSize * inputs.laborRate
    const fuelCost = inputs.miles * inputs.fuelCostPerMile
    const truckCost = inputs.miles * inputs.truckCostPerMile
    const totalCost = laborCost + fuelCost + truckCost + inputs.overhead
    const revenue = inputs.stops * inputs.quotedRate
    const profit = revenue - totalCost
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    const costPerStop = inputs.stops > 0 ? totalCost / inputs.stops : 0
    const breakEvenPerStop = inputs.stops > 0 ? totalCost / inputs.stops : 0
    const targetRate = breakEvenPerStop / (1 - inputs.targetMargin / 100)

    setResults({
      totalHours,
      laborCost,
      fuelCost,
      truckCost,
      totalCost,
      revenue,
      profit,
      margin,
      costPerStop,
      breakEvenPerStop,
      targetRate,
    })
  }

  const updateInput = (field: keyof FinalMileInputs, value: number) => {
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

  const getVerdictClass = () => {
    if (!results) return 'bg-gray-50 border-l-4 border-gray-400 text-gray-700'
    if (results.margin >= inputs.targetMargin) return 'bg-green-50 border-l-4 border-green-500 text-green-800'
    if (results.margin >= 0) return 'bg-amber-50 border-l-4 border-amber-500 text-amber-800'
    return 'bg-red-50 border-l-4 border-red-500 text-red-800'
  }

  const getVerdictText = () => {
    if (!results) return 'Enter values to see your verdict.'
    
    if (results.margin >= inputs.targetMargin) {
      return `✓ Strong. ${formatCurrency(inputs.quotedRate)}/stop delivers ${results.margin.toFixed(1)}% margin. Break-even: ${formatCurrency(results.breakEvenPerStop)}/stop. You have ${formatCurrency(inputs.quotedRate - results.breakEvenPerStop)}/stop of cushion.`
    }
    
    if (results.margin >= 0) {
      return `⚠ Profitable but below target. Raise rate to ${formatCurrency(results.targetRate)}/stop to hit ${inputs.targetMargin}% margin. Currently ${results.margin.toFixed(1)}%.`
    }
    
    return `✗ Below break-even. Losing ${formatCurrency(Math.abs(results.profit))} on this route. Minimum viable: ${formatCurrency(results.breakEvenPerStop)}/stop. Target: ${formatCurrency(results.targetRate)}/stop.`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-4xl">🚛</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Final Mile Delivery</h1>
          <p className="text-gray-600">Live Pricing Calculator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Route Inputs
            </h2>
            
            <div className="space-y-4">
              <InputField
                label="Number of Stops"
                value={inputs.stops}
                onChange={(val) => updateInput('stops', val)}
                min={1}
              />
              <InputField
                label="Total Route Miles"
                value={inputs.miles}
                onChange={(val) => updateInput('miles', val)}
                suffix="mi"
              />
              <InputField
                label="Avg Time per Stop (incl unload)"
                value={inputs.minPerStop}
                onChange={(val) => updateInput('minPerStop', val)}
                suffix="min"
              />
              <InputField
                label="Drive Time (total route)"
                value={inputs.driveHours}
                onChange={(val) => updateInput('driveHours', val)}
                step={0.25}
                suffix="hrs"
              />
              <InputField
                label="Crew Size"
                value={inputs.crewSize}
                onChange={(val) => updateInput('crewSize', val)}
                min={1}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Cost & Rate Inputs
            </h2>
            
            <div className="space-y-4">
              <InputField
                label="Loaded Labor Rate"
                value={inputs.laborRate}
                onChange={(val) => updateInput('laborRate', val)}
                prefix="$"
                suffix="/hr/person"
                step={0.25}
              />
              <InputField
                label="Fuel Cost per Mile"
                value={inputs.fuelCostPerMile}
                onChange={(val) => updateInput('fuelCostPerMile', val)}
                prefix="$"
                suffix="/mi"
                step={0.01}
              />
              <InputField
                label="Truck Cost (depreciation+maint)"
                value={inputs.truckCostPerMile}
                onChange={(val) => updateInput('truckCostPerMile', val)}
                prefix="$"
                suffix="/mi"
                step={0.01}
              />
              <InputField
                label="Overhead Allocation per Route"
                value={inputs.overhead}
                onChange={(val) => updateInput('overhead', val)}
                prefix="$"
              />
              <InputField
                label="Your Quoted Rate per Stop"
                value={inputs.quotedRate}
                onChange={(val) => updateInput('quotedRate', val)}
                prefix="$"
                step={5}
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
              label="Total Hours"
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
                label="Total Labor (all crew)"
                value={results ? formatCurrency(results.laborCost) : '$0'}
              />
              <ResultRow
                label="Fuel Cost"
                value={results ? formatCurrency(results.fuelCost) : '$0'}
              />
              <ResultRow
                label="Truck Operating Cost"
                value={results ? formatCurrency(results.truckCost) : '$0'}
              />
              <ResultRow
                label="Overhead"
                value={results ? formatCurrency(inputs.overhead) : '$0'}
              />
              <hr className="my-2" />
              <ResultRow
                label="Total Route Cost"
                value={results ? formatCurrency(results.totalCost) : '$0'}
                bold
              />
              <ResultRow
                label="Cost per Stop"
                value={results ? formatCurrency(results.costPerStop) : '$0'}
              />
              <ResultRow
                label="Break-Even per Stop"
                value={results ? `${formatCurrency(results.breakEvenPerStop)}/stop` : '$0'}
              />
              <ResultRow
                label="Target Rate per Stop"
                value={results ? `${formatCurrency(results.targetRate)}/stop` : '$0'}
                valueClass="text-green-600"
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

          <div className={`p-4 rounded-lg text-sm font-medium leading-relaxed ${getVerdictClass()}`}>
            {getVerdictText()}
          </div>
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
