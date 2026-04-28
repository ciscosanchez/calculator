'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sections = [
  { title: 'Profile Info',         fields: ['Profile Name', 'Location', 'Service Type', 'Description'] },
  { title: 'Labor Rates',          fields: ['Base Labor Rate', 'Loaded Labor Rate', 'Overtime Multiplier'] },
  { title: 'Vehicle & Fuel Costs', fields: ['Fuel Cost per Mile', 'Truck Depreciation per Mile', 'Maintenance per Mile'] },
  { title: 'Overhead Allocation',  fields: ['Overhead per Route', 'Admin Allocation %', 'Insurance per Route'] },
  { title: 'Margin Targets',       fields: ['Minimum Acceptable Margin %', 'Target Margin %'] },
]

export default function NewCostProfilePage() {
  const router = useRouter()
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true, 1: true })

  const toggle = (i: number) =>
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }))

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-sub mb-2">
            <Link href="/costs" className="hover:text-brand transition-colors">Cost Profiles</Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            New Profile
          </div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            New Cost Profile
          </h1>
          <p className="text-sm text-text-sub mt-1">
            Define rates and overhead to use across calculator quotes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/costs')}
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-sub hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => router.push('/costs')}
            className="h-9 px-4 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Create Cost Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_260px] gap-5 max-w-5xl">

        {/* Sections */}
        <div className="flex flex-col gap-3">
          {sections.map((sec, i) => (
            <div key={i} className="card">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-sm text-text-main">{sec.title}</span>
                </div>
                <svg
                  className={`text-text-sub transition-transform ${open[i] ? 'rotate-180' : ''}`}
                  width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open[i] && (
                <div className="px-5 pb-5 grid grid-cols-2 gap-4 border-t border-ui-border pt-4">
                  {sec.fields.map((f) => (
                    <div key={f}>
                      <label className="text-xs font-semibold text-text-sub block mb-1">{f}</label>
                      <input
                        type="text"
                        placeholder={`Enter ${f.toLowerCase()}`}
                        className="w-full h-9 border border-ui-border rounded-lg px-3 text-sm text-text-main placeholder:text-text-sub bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress ring */}
        <div>
          <div className="card p-5 sticky top-[80px]">
            <div className="font-semibold text-text-main mb-4">Profile Completion</div>
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg width="96" height="96" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="38" fill="none" stroke="#E5E7EB" strokeWidth="10"/>
                  <circle
                    cx="48" cy="48" r="38" fill="none"
                    stroke="#2563EB" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 38 * 0.4} ${2 * Math.PI * 38 * 0.6}`}
                    strokeDashoffset={2 * Math.PI * 38 * 0.25}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold font-condensed text-text-main">40%</span>
                  <span className="text-[0.6rem] font-semibold text-text-sub">Complete</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {sections.map((sec, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${i < 2 ? 'bg-success' : 'bg-gray-200'}`}>
                    {i < 2 && <svg width="8" height="8" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span className={i < 2 ? 'text-text-main' : 'text-text-sub'}>{sec.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-sidebar right-0 bg-white border-t border-ui-border px-7 py-3.5 flex items-center justify-between z-30">
        <button
          onClick={() => router.push('/costs')}
          className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-sub hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/costs')}
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>
            Save Draft
          </button>
          <button
            onClick={() => router.push('/costs')}
            className="h-9 px-5 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Create Cost Profile
          </button>
        </div>
      </div>
      <div className="h-16" />
    </>
  )
}
