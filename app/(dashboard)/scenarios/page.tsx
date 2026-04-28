'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const STEPS = [
  { num: 1, label: 'Select Service' },
  { num: 2, label: 'Base Inputs'    },
  { num: 3, label: 'Adjust Margins' },
  { num: 4, label: 'Scenarios'      },
  { num: 5, label: 'Review'         },
]

const SERVICES = ['Final Mile Delivery', 'Hotel FF&E Installation', 'Pallet Handling', 'Warehouse Storage']

export default function ScenariosPage() {
  const router = useRouter()
  const [step, setStep]                   = useState(1)
  const [selectedService, setSelectedService] = useState('Final Mile Delivery')
  const [margins, setMargins]             = useState({ min: 15, target: 20, stretch: 28 })
  const [generated, setGenerated]         = useState(false)
  const [generating, setGenerating]       = useState(false)

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1200)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            Scenario Builder
          </h1>
          <p className="text-sm text-text-sub mt-1">
            Run what-if margin analysis across multiple pricing scenarios.
          </p>
        </div>
        <Link
          href="/calculators/final-mile"
          className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Open Calculator
        </Link>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-7">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => setStep(s.num)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors border-2',
                step === s.num
                  ? 'bg-brand border-brand text-white'
                  : step > s.num
                    ? 'bg-success border-success text-white'
                    : 'bg-white border-ui-border text-text-sub group-hover:border-brand/40',
              )}>
                {step > s.num ? (
                  <svg width="12" height="12" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : s.num}
              </div>
              <span className={cn(
                'text-xs font-semibold whitespace-nowrap',
                step === s.num ? 'text-brand' : step > s.num ? 'text-success' : 'text-text-sub',
              )}>
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-2 mb-4 rounded-full',
                step > s.num ? 'bg-success' : 'bg-ui-border',
              )}/>
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card p-6 max-w-2xl">
        {step === 1 && (
          <div>
            <div className="font-semibold text-text-main mb-1">Select a Service Type</div>
            <p className="text-sm text-text-sub mb-4">Choose which calculator to base this scenario analysis on.</p>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedService(s)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left text-sm font-semibold transition-all',
                    selectedService === s
                      ? 'border-brand bg-brand-light text-brand'
                      : 'border-ui-border bg-white text-text-main hover:border-brand/40',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="font-semibold text-text-main mb-1">Base Inputs</div>
            <p className="text-sm text-text-sub mb-4">
              These are pulled from your last <strong>{selectedService}</strong> calculation. Adjust as needed.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Number of Stops',    value: '8',     unit: 'stops'      },
                { label: 'Total Miles',        value: '95',    unit: 'mi'         },
                { label: 'Crew Size',          value: '2',     unit: 'people'     },
                { label: 'Quoted Rate/Stop',   value: '$95.00',unit: '/stop'      },
                { label: 'Labor Rate',         value: '$23.76',unit: '/hr/person' },
                { label: 'Target Margin',      value: '20',    unit: '%'          },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-text-sub block mb-1">{f.label}</label>
                  <div className="flex items-center gap-2 border border-ui-border rounded-lg px-3 h-10 bg-white focus-within:border-brand transition-colors">
                    <input
                      type="text"
                      defaultValue={f.value}
                      className="flex-1 outline-none text-sm font-semibold text-text-main bg-transparent"
                    />
                    <span className="text-xs text-text-sub">{f.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="font-semibold text-text-main mb-1">Adjust Margins</div>
            <p className="text-sm text-text-sub mb-4">Set margin thresholds for the scenario comparison.</p>
            <div className="flex flex-col gap-5">
              {([
                { label: 'Minimum Acceptable Margin', key: 'min'     as const },
                { label: 'Target Margin',              key: 'target'  as const },
                { label: 'Stretch Goal Margin',        key: 'stretch' as const },
              ] as const).map((m) => (
                <div key={m.label} className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-text-main w-52 flex-shrink-0">{m.label}</label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={margins[m.key]}
                    onChange={(e) => setMargins(prev => ({ ...prev, [m.key]: Number(e.target.value) }))}
                    className="flex-1 accent-brand"
                  />
                  <span className="text-sm font-bold text-text-main w-10 text-right tabular-nums">{margins[m.key]}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="font-semibold text-text-main mb-1">Scenarios</div>
            <p className="text-sm text-text-sub mb-4">Compare three pricing scenarios side-by-side.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Conservative', rate: '$80', margin: '14.2%', color: 'text-danger',  bg: 'bg-danger-bg',  border: 'border-danger/20' },
                { label: 'Base Case',    rate: '$95', margin: '32.5%', color: 'text-success', bg: 'bg-success-bg', border: 'border-success/30' },
                { label: 'Aggressive',   rate: '$110',margin: '46.1%', color: 'text-success', bg: 'bg-success-bg', border: 'border-success/30' },
              ].map((sc) => (
                <div key={sc.label} className={`p-4 rounded-xl border ${sc.border} ${sc.bg}`}>
                  <div className="text-xs font-bold text-text-sub uppercase tracking-wider mb-2">{sc.label}</div>
                  <div className="text-2xl font-extrabold font-condensed text-text-main">{sc.rate}<span className="text-sm font-medium text-text-sub">/stop</span></div>
                  <div className={`text-lg font-bold mt-1 ${sc.color}`}>{sc.margin}</div>
                  <div className="text-xs text-text-sub mt-0.5">Gross Margin</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="font-semibold text-text-main mb-1">Review &amp; Generate</div>
            <p className="text-sm text-text-sub mb-4">
              Your scenario analysis is ready. Generate a proposal based on the <strong>Base Case</strong>.
            </p>
            <div className="bg-success-bg border border-success-border rounded-xl p-4 flex items-start gap-3 mb-4">
              <svg className="text-success flex-shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <div className="font-semibold text-success">Recommendation: Base Case</div>
                <div className="text-sm text-success/80 mt-0.5">
                  $95.00/stop at 32.5% gross margin — above your {margins.target}% target. Proceed with quote.
                </div>
              </div>
            </div>

            {generated && (
              <div className="bg-brand-light border border-brand/20 rounded-xl p-4 flex items-start gap-3">
                <svg className="text-brand flex-shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <div className="flex-1">
                  <div className="font-semibold text-brand">Proposal generated — ARW-2026-00048</div>
                  <div className="text-sm text-brand/70 mt-0.5">Saved as draft. Open in Quotes to review and send.</div>
                </div>
                <button
                  onClick={() => router.push('/quotes')}
                  className="text-xs font-semibold text-brand border border-brand/30 rounded-lg px-3 py-1.5 hover:bg-brand hover:text-white transition-colors whitespace-nowrap"
                >
                  View Quote →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-ui-border">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : router.push('/calculators')}
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-sub hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          <button
            onClick={() => step < 5 ? setStep(step + 1) : handleGenerate()}
            disabled={generating || (step === 5 && generated)}
            className="h-9 px-5 bg-brand hover:bg-brand-pill disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            {step === 5 ? (
              generating ? (
                <>
                  <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Generating…
                </>
              ) : generated ? 'Proposal Ready ✓' : (
                <>
                  Generate Proposal
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )
            ) : 'Continue →'}
          </button>
        </div>
      </div>
    </>
  )
}
