'use client'

import { useState, useEffect } from 'react'

interface ProjectTemplate {
  id: string
  name: string
  icon: string
  unitLabel: string
  defaultUnits: number
  defaultTimePerUnit: number
  defaultCrewSize: number
  defaultLaborRate: number
  description: string
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'hotel',
    name: 'Hotel/Hospitality',
    icon: '🏨',
    unitLabel: 'Rooms',
    defaultUnits: 50,
    defaultTimePerUnit: 45,
    defaultCrewSize: 2,
    defaultLaborRate: 24.50,
    description: 'Guest room furniture and fixture installation',
  },
  {
    id: 'datacenter',
    name: 'Data Center',
    icon: '🖥️',
    unitLabel: 'Racks',
    defaultUnits: 20,
    defaultTimePerUnit: 90,
    defaultCrewSize: 2,
    defaultLaborRate: 32.00,
    description: 'Server rack installation and equipment mounting',
  },
  {
    id: 'office',
    name: 'Corporate Office',
    icon: '🏢',
    unitLabel: 'Workstations',
    defaultUnits: 75,
    defaultTimePerUnit: 30,
    defaultCrewSize: 2,
    defaultLaborRate: 24.50,
    description: 'Cubicles, desks, and office furniture',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    unitLabel: 'Patient Rooms',
    defaultUnits: 40,
    defaultTimePerUnit: 60,
    defaultCrewSize: 2,
    defaultLaborRate: 26.00,
    description: 'Patient room furniture and medical equipment',
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    unitLabel: 'Classrooms',
    defaultUnits: 30,
    defaultTimePerUnit: 50,
    defaultCrewSize: 2,
    defaultLaborRate: 23.00,
    description: 'Classroom furniture and lab equipment',
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: '🏪',
    unitLabel: 'Fixtures',
    defaultUnits: 60,
    defaultTimePerUnit: 35,
    defaultCrewSize: 2,
    defaultLaborRate: 24.00,
    description: 'Store fixtures, displays, and shelving',
  },
]

interface InstallationInputs {
  projectTypeId: string
  units: number
  timePerUnit: number
  crewSize: number
  laborRate: number
  equipmentCostPerUnit: number
  overhead: number
  quotedRate: number
  targetMargin: number
}

interface CalculationResults {
  totalHours: number
  laborCost: number
  equipmentCost: number
  totalCost: number
  revenue: number
  profit: number
  margin: number
  costPerUnit: number
  breakEvenPerUnit: number
  targetRate: number
}

export default function InstallationServicesCalculator() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate>(projectTemplates[0])
  const [inputs, setInputs] = useState<InstallationInputs>({
    projectTypeId: projectTemplates[0].id,
    units: projectTemplates[0].defaultUnits,
    timePerUnit: projectTemplates[0].defaultTimePerUnit,
    crewSize: projectTemplates[0].defaultCrewSize,
    laborRate: projectTemplates[0].defaultLaborRate,
    equipmentCostPerUnit: 12.00,
    overhead: 8.50,
    quotedRate: 85,
    targetMargin: 20,
  })
  const [results, setResults] = useState<CalculationResults | null>(null)

  useEffect(() => {
    calculateResults()
  }, [inputs])

  const handleTemplateChange = (templateId: string) => {
    const template = projectTemplates.find(t => t.id === templateId) || projectTemplates[0]
    setSelectedTemplate(template)
    setInputs({
      ...inputs,
      projectTypeId: template.id,
      units: template.defaultUnits,
      timePerUnit: template.defaultTimePerUnit,
      crewSize: template.defaultCrewSize,
      laborRate: template.defaultLaborRate,
    })
  }

  const calculateResults = () => {
    const totalHours = (inputs.units * inputs.timePerUnit) / 60
    const laborCost = totalHours * inputs.crewSize * inputs.laborRate
    const equipmentCost = inputs.units * inputs.equipmentCostPerUnit
    const overheadTotal = inputs.units * inputs.overhead
    const totalCost = laborCost + equipmentCost + overheadTotal
    const revenue = inputs.units * inputs.quotedRate
    const profit = revenue - totalCost
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    const costPerUnit = inputs.units > 0 ? totalCost / inputs.units : 0
    const breakEvenPerUnit = inputs.units > 0 ? totalCost / inputs.units : 0
    const targetRate = breakEvenPerUnit / (1 - inputs.targetMargin / 100)

    setResults({
      totalHours,
      laborCost,
      equipmentCost: equipmentCost + overheadTotal,
      totalCost,
      revenue,
      profit,
      margin,
      costPerUnit,
      breakEvenPerUnit,
      targetRate,
    })
  }

  const updateInput = (field: keyof InstallationInputs, value: number | string) => {
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
    if (!results) return 'Select a project type and enter values to see your verdict.'
    
    if (results.margin >= inputs.targetMargin) {
      return `✓ Strong. ${formatCurrency(inputs.quotedRate)}/${selectedTemplate.unitLabel.toLowerCase().slice(0, -1)} delivers ${results.margin.toFixed(1)}% margin. Break-even: ${formatCurrency(results.breakEvenPerUnit)}. You have ${formatCurrency(inputs.quotedRate - results.breakEvenPerUnit)} of cushion per unit.`
    }
    
    if (results.margin >= 0) {
      return `⚠ Profitable but below target. Raise rate to ${formatCurrency(results.targetRate)}/${selectedTemplate.unitLabel.toLowerCase().slice(0, -1)} to hit ${inputs.targetMargin}% margin. Currently ${results.margin.toFixed(1)}%.`
    }
    
    return `✗ Below break-even. Losing ${formatCurrency(Math.abs(results.profit))} on this project. Minimum viable: ${formatCurrency(results.breakEvenPerUnit)}. Target: ${formatCurrency(results.targetRate)}.`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-4xl">🔧</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Installation Services</h1>
          <p className="text-gray-600">Flexible pricing for any installation project</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
          Select Project Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {projectTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template.id)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                selectedTemplate.id === template.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <div className="text-sm font-semibold text-gray-900">{template.name}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{selectedTemplate.name}:</span> {selectedTemplate.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b border-gray-200 pb-3 mb-4">
              Project Details
            </h2>
            
            <div className="space-y-4">
              <InputField
                label={`Number of ${selectedTemplate.unitLabel}`}
                value={inputs.units}
                onChange={(val) => updateInput('units', val)}
                min={1}
              />
              <InputField
                label={`Time per ${selectedTemplate.unitLabel.slice(0, -1)} (minutes)`}
                value={inputs.timePerUnit}
                onChange={(val) => updateInput('timePerUnit', val)}
                suffix="min"
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
                label={`Equipment Cost per ${selectedTemplate.unitLabel.slice(0, -1)}`}
                value={inputs.equipmentCostPerUnit}
                onChange={(val) => updateInput('equipmentCostPerUnit', val)}
                prefix="$"
                step={0.50}
              />
              <InputField
                label={`Overhead per ${selectedTemplate.unitLabel.slice(0, -1)}`}
                value={inputs.overhead}
                onChange={(val) => updateInput('overhead', val)}
                prefix="$"
                step={0.50}
              />
              <InputField
                label={`Your Quoted Rate per ${selectedTemplate.unitLabel.slice(0, -1)}`}
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
                label="Equipment & Overhead"
                value={results ? formatCurrency(results.equipmentCost) : '$0'}
              />
              <hr className="my-2" />
              <ResultRow
                label="Total Project Cost"
                value={results ? formatCurrency(results.totalCost) : '$0'}
                bold
              />
              <ResultRow
                label={`Cost per ${selectedTemplate.unitLabel.slice(0, -1)}`}
                value={results ? formatCurrency(results.costPerUnit) : '$0'}
              />
              <ResultRow
                label={`Break-Even per ${selectedTemplate.unitLabel.slice(0, -1)}`}
                value={results ? formatCurrency(results.breakEvenPerUnit) : '$0'}
              />
              <ResultRow
                label={`Target Rate per ${selectedTemplate.unitLabel.slice(0, -1)}`}
                value={results ? formatCurrency(results.targetRate) : '$0'}
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
