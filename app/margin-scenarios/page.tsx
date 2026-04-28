'use client'

import { useState } from 'react'

interface ScenarioInputs {
  ratePerStop: number
  numberOfStops: number
  laborRate: number
  fuelCostPerMile: number
  overhead: number
  crewSize: number
  miles: number
  targetMargin: number
}

type ScenarioPreset = 'current' | 'conservative' | 'aggressive' | 'breakeven'

const defaultScenario: ScenarioInputs = {
  ratePerStop: 95,
  numberOfStops: 8,
  laborRate: 23.76,
  fuelCostPerMile: 0.68,
  overhead: 65,
  crewSize: 2,
  miles: 45,
  targetMargin: 20,
}

export default function MarginScenariosPage() {
  const [inputs, setInputs] = useState<ScenarioInputs>(defaultScenario)
  const [activePreset, setActivePreset] = useState<ScenarioPreset>('current')

  const updateInput = (field: keyof ScenarioInputs, value: number) => {
    setInputs({ ...inputs, [field]: value })
    setActivePreset('current')
  }

  const applyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset)
    switch (preset) {
      case 'conservative':
        setInputs({
          ...inputs,
          ratePerStop: 110,
          laborRate: 22,
          overhead: 55,
        })
        break
      case 'aggressive':
        setInputs({
          ...inputs,
          ratePerStop: 80,
          laborRate: 24.5,
          overhead: 75,
        })
        break
      case 'breakeven':
        const costs = calculateCosts(inputs)
        const breakEvenRate = costs.totalCost / inputs.numberOfStops
        setInputs({
          ...inputs,
          ratePerStop: Math.ceil(breakEvenRate),
        })
        break
      default:
        setInputs(defaultScenario)
    }
  }

  const calculateCosts = (scenario: ScenarioInputs) => {
    const timePerStop = 0.5
    const totalHours = scenario.numberOfStops * timePerStop
    const laborCost = totalHours * scenario.crewSize * scenario.laborRate
    const fuelCost = scenario.miles * scenario.fuelCostPerMile
    const truckCost = scenario.miles * 0.35
    const totalCost = laborCost + fuelCost + truckCost + scenario.overhead
    return { laborCost, fuelCost, truckCost, totalCost, totalHours }
  }

  const calculateMargin = (scenario: ScenarioInputs) => {
    const costs = calculateCosts(scenario)
    const revenue = scenario.numberOfStops * scenario.ratePerStop
    const profit = revenue - costs.totalCost
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0
    return { revenue, profit, margin, ...costs }
  }

  const results = calculateMargin(inputs)

  const whatIfScenarios = [
    {
      title: 'What if fuel goes up 20%?',
      inputs: { ...inputs, fuelCostPerMile: inputs.fuelCostPerMile * 1.2 },
      color: 'yellow',
    },
    {
      title: 'What if you add 4 more stops?',
      inputs: { ...inputs, numberOfStops: inputs.numberOfStops + 4 },
      color: 'green',
    },
    {
      title: 'What if you reduce crew to 1?',
      inputs: { ...inputs, crewSize: 1 },
      color: 'blue',
    },
    {
      title: 'What if you drop rate to $80?',
      inputs: { ...inputs, ratePerStop: 80 },
      color: 'red',
    },
  ]

  const scenarioComparisons = [
    { label: 'Break-Even', margin: 15.2, height: 60 },
    { label: 'Target', margin: inputs.targetMargin, height: 75, color: '#E8A020' },
    { label: 'Current', margin: results.margin, height: 100, color: '#1A7A4A' },
    { label: 'Conservative', margin: calculateMargin({ ...inputs, ratePerStop: 110, laborRate: 22 }).margin, height: 85, color: '#0D2B4E' },
    { label: 'Aggressive', margin: calculateMargin({ ...inputs, ratePerStop: 80 }).margin, height: 65 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Margin Scenario Builder</h1>
        <p className="text-gray-600">Adjust key variables to explore how they impact your profitability. Move sliders or type exact values.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Scenario Presets</h2>
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => applyPreset('current')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              activePreset === 'current'
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="font-bold mb-1">Current Quote</div>
            <div className={`text-sm ${activePreset === 'current' ? 'text-white opacity-90' : 'text-gray-600'}`}>
              Your current pricing
            </div>
          </button>
          <button
            onClick={() => applyPreset('conservative')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              activePreset === 'conservative'
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="font-bold mb-1">Conservative</div>
            <div className={`text-sm ${activePreset === 'conservative' ? 'text-white opacity-90' : 'text-gray-600'}`}>
              Lower costs, higher margin
            </div>
          </button>
          <button
            onClick={() => applyPreset('aggressive')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              activePreset === 'aggressive'
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="font-bold mb-1">Aggressive</div>
            <div className={`text-sm ${activePreset === 'aggressive' ? 'text-white opacity-90' : 'text-gray-600'}`}>
              Competitive pricing
            </div>
          </button>
          <button
            onClick={() => applyPreset('breakeven')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              activePreset === 'breakeven'
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="font-bold mb-1">Break-Even</div>
            <div className={`text-sm ${activePreset === 'breakeven' ? 'text-white opacity-90' : 'text-gray-600'}`}>
              Minimum viable rate
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Drivers</h2>
        <div className="space-y-6">
          <SliderInput
            label="Rate per Stop"
            description="What you charge the customer"
            value={inputs.ratePerStop}
            min={60}
            max={150}
            step={5}
            unit="$"
            onChange={(val) => updateInput('ratePerStop', val)}
          />
          <SliderInput
            label="Number of Stops"
            description="Route density affects efficiency"
            value={inputs.numberOfStops}
            min={1}
            max={50}
            step={1}
            unit="stops"
            onChange={(val) => updateInput('numberOfStops', val)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Cost Drivers</h2>
        <div className="space-y-6">
          <SliderInput
            label="Labor Rate"
            description="Fully-loaded hourly cost"
            value={inputs.laborRate}
            min={15}
            max={45}
            step={0.25}
            unit="$/hr"
            onChange={(val) => updateInput('laborRate', val)}
          />
          <SliderInput
            label="Fuel Cost per Mile"
            description="Current diesel price"
            value={inputs.fuelCostPerMile}
            min={0.4}
            max={1.2}
            step={0.05}
            unit="$/mi"
            onChange={(val) => updateInput('fuelCostPerMile', val)}
          />
          <SliderInput
            label="Overhead per Route"
            description="Admin & dispatch costs"
            value={inputs.overhead}
            min={25}
            max={150}
            step={5}
            unit="$"
            onChange={(val) => updateInput('overhead', val)}
          />
          <SliderInput
            label="Crew Size"
            description="Number of people on route"
            value={inputs.crewSize}
            min={1}
            max={6}
            step={1}
            unit="people"
            onChange={(val) => updateInput('crewSize', val)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Margin Analysis</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-white text-center">
            <div className="text-sm opacity-90 mb-2">CURRENT MARGIN</div>
            <div className="text-4xl font-bold">{results.margin.toFixed(1)}%</div>
            <div className="text-sm opacity-90 mt-2">${results.profit.toFixed(2)} profit</div>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-green-600 to-green-700 text-white text-center">
            <div className="text-sm opacity-90 mb-2">TARGET MARGIN</div>
            <div className="text-4xl font-bold">{inputs.targetMargin.toFixed(1)}%</div>
            <div className="text-sm opacity-90 mt-2">${(results.revenue * inputs.targetMargin / 100).toFixed(2)} profit</div>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center">
            <div className="text-sm opacity-90 mb-2">VS TARGET</div>
            <div className="text-4xl font-bold">{(results.margin - inputs.targetMargin >= 0 ? '+' : '')}{(results.margin - inputs.targetMargin).toFixed(1)}%</div>
            <div className="text-sm opacity-90 mt-2">${(results.profit - (results.revenue * inputs.targetMargin / 100)).toFixed(2)} cushion</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Margin by Scenario</h2>
        <div className="flex items-end gap-4 h-64 mb-8">
          {scenarioComparisons.map((scenario, idx) => (
            <div key={idx} className="flex-1 relative">
              <div
                className="rounded-t transition-all"
                style={{
                  height: `${scenario.height}%`,
                  backgroundColor: scenario.color || '#2B9ED4',
                }}
              >
                <div className="absolute -top-8 left-0 right-0 text-center font-bold text-gray-900">
                  {scenario.margin.toFixed(1)}%
                </div>
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-600">
                {scenario.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 mb-6">See how changes impact your margin</p>
        <div className="grid grid-cols-2 gap-4">
          {whatIfScenarios.map((scenario, idx) => {
            const whatIfResult = calculateMargin(scenario.inputs)
            const delta = whatIfResult.margin - results.margin
            const bgColor = 
              scenario.color === 'yellow' ? 'bg-yellow-50' :
              scenario.color === 'green' ? 'bg-green-50' :
              scenario.color === 'blue' ? 'bg-blue-50' : 'bg-red-50'
            const textColor = delta >= 0 ? 'text-green-600' : 'text-red-600'
            
            return (
              <div key={idx} className={`p-4 ${bgColor} rounded-lg`}>
                <div className="font-bold text-gray-900 mb-2">{scenario.title}</div>
                <div className="text-sm text-gray-700">
                  Margin {delta >= 0 ? 'increases' : 'drops'} to{' '}
                  <strong className={textColor}>{whatIfResult.margin.toFixed(1)}%</strong>{' '}
                  ({delta >= 0 ? '+' : ''}{delta.toFixed(1)}%)
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setInputs(defaultScenario)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Reset to Defaults
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Save Scenario
        </button>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Apply to Quote
        </button>
      </div>
    </div>
  )
}

interface SliderInputProps {
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
}

function SliderInput({ label, description, value, min, max, step, unit, onChange }: SliderInputProps) {
  return (
    <div className="grid grid-cols-[250px_1fr_150px] gap-6 items-center">
      <div>
        <div className="font-semibold text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{min}{unit.startsWith('$') ? unit : ''}</span>
          <span>{max}{unit.startsWith('$') ? unit : ''}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg text-lg font-bold text-right bg-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
        <span className="text-gray-600 font-semibold">{unit}</span>
      </div>
    </div>
  )
}
