import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = [
  { label: 'Reading inputs', icon: 'upload_file', duration: 1200 },
  { label: 'Detecting workflows', icon: 'account_tree', duration: 1400 },
  { label: 'Scoring opportunities', icon: 'analytics', duration: 1600 },
  { label: 'Mapping AWS services', icon: 'cloud', duration: 1200 },
  { label: 'Generating roadmap', icon: 'route', duration: 1000 },
]

export default function Progress() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let idx = 0
    const advance = () => {
      if (idx >= steps.length) {
        setTimeout(() => navigate('/dashboard'), 600)
        return
      }
      setCurrent(idx)
      idx++
      setTimeout(advance, steps[idx - 1]?.duration ?? 1000)
    }
    advance()
  }, [navigate])

  const pct = Math.round(((current + 1) / steps.length) * 100)

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col items-center justify-center p-margin-mobile">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary icon-filled">qr_code_scanner</span>
          </div>
          <span className="text-headline-md font-headline-md font-black text-primary">Serverless Scanner</span>
        </div>

        <div className="executive-card rounded-xl p-stack-lg">
          <div className="text-center mb-stack-lg">
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">ANALYZING INFRASTRUCTURE</p>
            <h2 className="text-headline-lg font-headline-lg text-primary">Gym Booking SaaS</h2>
          </div>

          {/* Score display */}
          <div className="text-center mb-stack-lg">
            <div className="inline-block relative">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#eceef0" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#000000" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[22px] font-black text-primary">{pct}%</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3">
            {steps.map((step, i) => {
              const done = i < current
              const active = i === current
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${active ? 'bg-surface-container' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    done ? 'bg-on-tertiary-container' : active ? 'bg-primary' : 'bg-surface-container-high'
                  }`}>
                    {done
                      ? <span className="material-symbols-outlined text-white text-[16px] icon-filled">check</span>
                      : active
                      ? <svg className="animate-spin w-4 h-4 text-on-primary" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      : <span className={`material-symbols-outlined text-[16px] ${active ? 'text-on-primary' : 'text-outline'}`}>{step.icon}</span>
                    }
                  </div>
                  <span className={`text-body-sm transition-all ${done ? 'text-on-tertiary-container font-bold' : active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {step.label}
                  </span>
                  {done && <span className="ml-auto text-label-caps font-label-caps text-on-tertiary-container">Done</span>}
                  {active && <span className="ml-auto text-label-caps font-label-caps text-primary animate-pulse">Running...</span>}
                </div>
              )
            })}
          </div>

          <div className="mt-stack-lg">
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-secondary-container h-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-body-sm text-on-surface-variant text-center mt-2">
              This usually takes 2–5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
