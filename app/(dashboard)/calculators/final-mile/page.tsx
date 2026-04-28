'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// ── Calculation logic (mirrors the wireframe exactly) ─────────────────────────

interface Inputs {
  stops:        number
  miles:        number
  stopTime:     number
  driveTime:    number
  crew:         number
  laborRate:    number
  fuelRate:     number
  truckRate:    number
  overhead:     number
  quotedRate:   number
  targetMargin: number
}

interface Results {
  totalHours:      number
  laborCost:       number
  fuelCost:        number
  truckCost:       number
  totalCost:       number
  revenue:         number
  profit:          number
  margin:          number
  costPerStop:     number
  targetRate:      number
  laborPct:        number
  fuelPct:         number
  truckPct:        number
  overheadPct:     number
}

function calculate(i: Inputs): Results {
  const stopHours  = (i.stops * i.stopTime) / 60
  const totalHours = stopHours + i.driveTime
  const laborCost  = totalHours * i.crew * i.laborRate
  const fuelCost   = i.miles * i.fuelRate
  const truckCost  = i.miles * i.truckRate
  const totalCost  = laborCost + fuelCost + truckCost + i.overhead
  const revenue    = i.stops * i.quotedRate
  const profit     = revenue - totalCost
  const margin     = revenue > 0 ? (profit / revenue) * 100 : 0
  const costPerStop    = i.stops > 0 ? totalCost / i.stops : 0
  const targetRate     = costPerStop / (1 - i.targetMargin / 100)

  return {
    totalHours,
    laborCost,
    fuelCost,
    truckCost,
    totalCost,
    revenue,
    profit,
    margin,
    costPerStop,
    targetRate,
    laborPct:   totalCost > 0 ? (laborCost  / totalCost) * 100 : 0,
    fuelPct:    totalCost > 0 ? (fuelCost   / totalCost) * 100 : 0,
    truckPct:   totalCost > 0 ? (truckCost  / totalCost) * 100 : 0,
    overheadPct:totalCost > 0 ? (i.overhead / totalCost) * 100 : 0,
  }
}

const DEFAULTS: Inputs = {
  stops:        8,
  miles:        95,
  stopTime:     35,
  driveTime:    2.5,
  crew:         2,
  laborRate:    23.76,
  fuelRate:     0.68,
  truckRate:    0.45,
  overhead:     65.00,
  quotedRate:   95.00,
  targetMargin: 20,
}

// ── Input tile component ──────────────────────────────────────────────────────

function InputTile({
  label,
  hint,
  icon,
  value,
  unit,
  step = 1,
  highlighted,
  onChange,
}: {
  label: string
  hint?: string
  icon?: React.ReactNode
  value: number
  unit: string
  step?: number
  highlighted?: boolean
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[0.78rem] font-semibold text-text-sub">
        {label}
        {hint && <span className="font-normal text-text-sub/70">({hint})</span>}
      </div>
      <div className={cn(
        'flex items-center gap-2 border rounded-lg px-3 h-10 bg-white transition-colors',
        highlighted
          ? 'border-brand ring-2 ring-brand/15 bg-brand-light/30'
          : 'border-ui-border focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10',
      )}>
        {icon && <span className="text-text-sub flex-shrink-0">{icon}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 min-w-0 bg-transparent outline-none text-sm font-semibold text-text-main [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-text-sub whitespace-nowrap flex-shrink-0">{unit}</span>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FinalMileCalculatorPage() {
  const router = useRouter()
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)

  const set = useCallback(<K extends keyof Inputs>(key: K, value: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }, [])

  const r = calculate(inputs)

  const fmt   = (v: number) => `$${v.toFixed(2)}`
  const fmtK  = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(2)}K` : `$${Math.round(v)}`
  const fmtPct = (v: number) => `${v.toFixed(1)}%`

  const verdictColor = r.margin >= inputs.targetMargin ? 'bg-success' : r.margin >= inputs.targetMargin * 0.85 ? 'bg-warning' : 'bg-danger'
  const verdictLabel = r.margin >= inputs.targetMargin ? 'Strong.' : r.margin >= inputs.targetMargin * 0.85 ? 'Close.' : 'Below target.'
  const cushion = inputs.quotedRate - r.costPerStop // per stop

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          {/* Route illustration */}
          <svg width="120" height="56" viewBox="0 0 120 56" fill="none" aria-hidden>
            <circle cx="20" cy="28" r="10" fill="#EFF6FF"/>
            <circle cx="20" cy="28" r="6" fill="#BFDBFE"/>
            <circle cx="20" cy="28" r="3" fill="#2563EB"/>
            <circle cx="100" cy="28" r="10" fill="#EFF6FF"/>
            <circle cx="100" cy="28" r="6" fill="#BFDBFE"/>
            <circle cx="100" cy="28" r="3" fill="#2563EB"/>
            <path d="M28 28 Q60 10 92 28" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
          </svg>
          <div>
            <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
              Final Mile Delivery
            </h1>
            <p className="text-sm text-text-sub mt-0.5">
              Price route-based delivery using stops, mileage, labor, fuel, and overhead.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/quotes')}
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <Link
            href="/scenarios"
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Scenario Builder
          </Link>
          <button
            onClick={() => router.push('/quotes')}
            className="h-9 px-4 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Save Quote
          </button>
        </div>
      </div>

      {/* Two-column content area */}
      <div className="grid grid-cols-[1fr_360px] gap-5">

        {/* ── LEFT: Inputs ── */}
        <div className="card">

          {/* Section 1 */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-ui-border bg-gray-50 rounded-t-xl">
            <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <span className="font-semibold text-sm text-text-main">Route Inputs</span>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4 border-b border-ui-border">
            <InputTile
              label="Number of Stops" value={inputs.stops} unit="stops"
              icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
              onChange={(v) => set('stops', v)}
            />
            <InputTile
              label="Total Route Miles" value={inputs.miles} unit="mi"
              icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>}
              onChange={(v) => set('miles', v)}
            />
            <InputTile
              label="Avg Time per Stop" hint="incl unload" value={inputs.stopTime} unit="min"
              icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              onChange={(v) => set('stopTime', v)}
            />
            <InputTile
              label="Drive Time" hint="total route" value={inputs.driveTime} unit="hrs" step={0.5}
              icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              onChange={(v) => set('driveTime', v)}
            />
            <InputTile
              label="Crew Size" value={inputs.crew} unit="people"
              icon={<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
              onChange={(v) => set('crew', v)}
            />
          </div>

          {/* Section 2 */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-ui-border bg-gray-50">
            <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
            <span className="font-semibold text-sm text-text-main">Cost &amp; Rate Inputs</span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <InputTile
              label="Loaded Labor Rate" value={inputs.laborRate} unit="/hr/person" step={0.01}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              onChange={(v) => set('laborRate', v)}
            />
            <InputTile
              label="Fuel Cost per Mile" value={inputs.fuelRate} unit="/mi" step={0.01}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 22V8l9-6 9 6v14"/><path d="M9 22V12h6v10"/></svg>}
              onChange={(v) => set('fuelRate', v)}
            />
            <InputTile
              label="Truck Cost" hint="depreciation + maint." value={inputs.truckRate} unit="/mi" step={0.01}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/></svg>}
              onChange={(v) => set('truckRate', v)}
            />
            <InputTile
              label="Overhead Allocation" hint="per route" value={inputs.overhead} unit="/route" step={0.01}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
              onChange={(v) => set('overhead', v)}
            />
            <InputTile
              label="Your Quoted Rate per Stop" value={inputs.quotedRate} unit="/stop" step={0.01}
              highlighted
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              onChange={(v) => set('quotedRate', v)}
            />
            <InputTile
              label="Target Margin" value={inputs.targetMargin} unit="%"
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
              onChange={(v) => set('targetMargin', v)}
            />
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="flex flex-col gap-4">

          {/* Results Summary */}
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-main mb-3">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              Results Summary
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Hours', value: `${r.totalHours.toFixed(1)}h` },
                { label: 'Total Cost',  value: fmtK(r.totalCost) },
                { label: 'Revenue',     value: fmtK(r.revenue) },
                {
                  label: 'Gross Margin',
                  value: fmtPct(r.margin),
                  valueClass: r.margin >= 20 ? 'text-success' : r.margin >= 15 ? 'text-warning' : 'text-danger',
                },
                {
                  label: 'Net Profit',
                  value: `${r.profit >= 0 ? '+' : ''}${fmt(r.profit)}`,
                  valueClass: r.profit >= 0 ? 'text-success' : 'text-danger',
                },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-[0.7rem] font-semibold text-text-sub uppercase tracking-wider mb-1">
                    {m.label}
                  </div>
                  <div className={cn('text-lg font-extrabold font-condensed', m.valueClass ?? 'text-text-main')}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-main mb-3">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Cost Breakdown
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Total Labor (all crew)', amount: r.laborCost,  pct: r.laborPct,    dot: 'bg-brand' },
                { label: 'Fuel Cost',              amount: r.fuelCost,   pct: r.fuelPct,     dot: 'bg-accent' },
                { label: 'Truck Operating Cost',   amount: r.truckCost,  pct: r.truckPct,    dot: 'bg-sky-400' },
                { label: 'Overhead',               amount: inputs.overhead, pct: r.overheadPct, dot: 'bg-orange-400' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${row.dot}`} />
                  <span className="flex-1 text-text-sub">{row.label}</span>
                  <span className="font-semibold text-text-main tabular-nums">{fmt(row.amount)}</span>
                  <span className="text-xs text-text-sub w-10 text-right tabular-nums">{fmtPct(row.pct)}</span>
                </div>
              ))}
              <div className="border-t border-ui-border pt-2 mt-1 flex items-center justify-between text-sm font-bold text-text-main">
                <span>Total Route Cost</span>
                <span className="tabular-nums">{fmt(r.totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Pricing Insights */}
          <div className="card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-main mb-3">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Pricing Insights
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Cost per Stop',       value: fmt(r.costPerStop),  unit: '/stop' },
                { label: 'Break-Even per Stop', value: fmt(r.costPerStop),  unit: '/stop' },
                { label: 'Target Rate per Stop',value: fmt(r.targetRate),   unit: '/stop' },
              ].map((ins) => (
                <div key={ins.label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <div className="text-[0.68rem] font-semibold text-text-sub mb-1 leading-tight">{ins.label}</div>
                  <div className="text-base font-extrabold font-condensed text-text-main">{ins.value}</div>
                  <div className="text-[0.65rem] text-text-sub">{ins.unit}</div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className={cn(
              'flex items-start gap-2.5 p-3 rounded-lg text-white',
              verdictColor,
            )}>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                {r.margin >= inputs.targetMargin ? (
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                )}
              </div>
              <div className="text-sm leading-snug">
                <strong>{verdictLabel}</strong>{' '}
                ${inputs.quotedRate.toFixed(2)}/stop delivers {fmtPct(r.margin)} margin.{' '}
                Break-even: {fmt(r.costPerStop)}/stop.{' '}
                {r.profit >= 0
                  ? `You have ${fmt(Math.abs(cushion))}/stop of cushion.`
                  : `You are ${fmt(Math.abs(cushion))}/stop below break-even.`}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-sidebar right-0 bg-white border-t border-ui-border px-7 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <Link
            href="/calculators"
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-sub hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={() => router.push('/quotes')}
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>
            Save Draft
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/scenarios"
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Scenario Builder
          </Link>
          <button
            onClick={() => router.push('/quotes')}
            className="h-9 px-5 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            Save Quote
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-16" />
    </>
  )
}
