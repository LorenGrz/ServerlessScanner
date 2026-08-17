import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import NoScanPlaceholder from '../components/NoScanPlaceholder'
import { useAnalysis } from '../AnalysisContext'

function ScoreCounter({ target }: { target: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let v = 0
    const t = setInterval(() => {
      v = Math.min(v + 2, target)
      setVal(v)
      if (v >= target) clearInterval(t)
    }, 20)
    return () => clearInterval(t)
  }, [target])
  return <>{val}</>
}

const roiBadge = (label: string) => {
  if (label === 'HIGH ROI') return 'bg-[#ECFDF5] text-[#065F46]'
  return 'bg-surface-variant text-on-surface-variant'
}

const complexityToY = (c: string) => c === 'Low' ? '15%' : c === 'Medium' ? '48%' : '78%'

export default function Dashboard() {
  const navigate = useNavigate()
  const { analysis } = useAnalysis()

  if (!analysis) return <Layout title="Executive Dashboard" subtitle="Run a scan to get started"><NoScanPlaceholder /></Layout>

  const { opportunities, doNotMigrate, roadmap, executiveSummary, score, estimatedAnnualSavings, confidence, complexityTier, scoreDelta } = analysis
  const topOpp = opportunities[0]

  const matrixPoints = [
    ...opportunities.slice(0, 4).map(opp => ({
      label: opp.name,
      x: `${opp.fit}%`,
      y: complexityToY(opp.complexity),
      color: opp.roiLabel === 'HIGH ROI' ? 'bg-primary' : 'bg-secondary-container',
    })),
    ...doNotMigrate.slice(0, 2).map(item => ({
      label: item.name,
      x: '18%',
      y: '82%',
      color: 'bg-error',
    })),
  ]

  return (
    <Layout title="Executive Dashboard" subtitle={analysis.productName}>
      <div className="flex flex-col gap-stack-lg">

        {/* Hero: Score + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Score */}
          <div className="md:col-span-4 executive-card rounded-lg p-gutter flex flex-col justify-between min-h-[280px]">
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">SCANNER SCORE</p>
              <div className="text-display-score font-display-score text-primary mt-stack-sm leading-none">
                <ScoreCounter target={score} />
                <span className="text-headline-md text-outline-variant">/100</span>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="bg-[#ECFDF5] text-[#065F46] px-3 py-1 rounded-full text-label-caps font-label-caps flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  {scoreDelta}
                </span>
              </div>
            </div>
            <div className="mt-stack-lg">
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-secondary-container h-full" style={{ width: `${score}%` }} />
              </div>
              <p className="text-body-sm text-on-surface-variant mt-2">Above industry average for SaaS</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="md:col-span-8 executive-card rounded-lg p-gutter flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-headline-md font-headline-md text-primary">Executive Summary</h3>
              <span className="material-symbols-outlined text-outline-variant">info</span>
            </div>
            <p className="mt-stack-md text-body-lg text-on-surface leading-relaxed flex-1">{executiveSummary}</p>
            <div className="mt-auto pt-stack-md grid grid-cols-3 gap-4 border-t border-outline-variant">
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant">Est. Annual Savings</p>
                <p className="text-headline-md font-bold text-on-tertiary-container">${estimatedAnnualSavings.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant">Complexity Tier</p>
                <p className="text-headline-md font-bold text-primary">{complexityTier}</p>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-variant">Confidence</p>
                <p className="text-headline-md font-bold text-secondary">High ({confidence}%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities + Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Opportunities */}
          <div className="md:col-span-5 flex flex-col gap-stack-md">
            <h4 className="text-label-caps font-label-caps text-on-surface-variant">STRATEGIC OPPORTUNITIES</h4>
            {opportunities.map(opp => (
              <button
                key={opp.id}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
                className="executive-card rounded-lg p-4 flex items-center justify-between group hover:border-primary transition-colors cursor-pointer w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center text-on-secondary-container shrink-0">
                    <span className="material-symbols-outlined icon-filled">{opp.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-primary">{opp.rank}. {opp.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{opp.description}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ml-2 ${roiBadge(opp.roiLabel)}`}>
                  {opp.roiLabel}
                </span>
              </button>
            ))}
          </div>

          {/* Savings vs Complexity Matrix */}
          <div className="md:col-span-7 executive-card rounded-lg p-gutter">
            <div className="flex justify-between items-center mb-stack-md flex-wrap gap-2">
              <h4 className="text-headline-md font-headline-md">Savings vs Complexity</h4>
              <div className="flex items-center gap-4 text-label-caps font-label-caps">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary-container inline-block" /> Recommended</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error inline-block" /> Do Not Migrate</span>
              </div>
            </div>
            <div className="h-56 w-full border-l border-b border-outline-variant relative matrix-grid rounded-lg overflow-hidden">
              <div className="absolute bottom-[-22px] right-0 text-[10px] font-bold text-outline uppercase tracking-widest">Savings (ROI) →</div>
              <div className="absolute top-0 left-[-28px] text-[10px] font-bold text-outline uppercase tracking-widest origin-bottom-left -rotate-90 whitespace-nowrap">Complexity →</div>
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary-container/5 border border-dashed border-secondary-container/30" />
              {matrixPoints.map(pt => (
                <div key={pt.label} className="absolute group" style={{ right: `calc(100% - ${pt.x})`, bottom: `calc(100% - ${pt.y})`, transform: 'translate(50%, 50%)' }}>
                  <div className={`w-4 h-4 ${pt.color} rounded-full ring-4 ring-white cursor-pointer`} />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] px-2 py-1 whitespace-nowrap rounded hidden group-hover:block z-10">
                    {pt.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended First Migration */}
        {topOpp && (
          <div className="bg-primary text-on-primary rounded-xl p-gutter md:p-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-stack-lg items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary-container icon-filled">stars</span>
                <p className="text-label-caps font-label-caps text-secondary-container">RECOMMENDED FIRST STEP</p>
              </div>
              <h3 className="text-headline-lg font-headline-lg leading-tight">Migration: {topOpp.name}</h3>
              <p className="text-on-primary-container text-body-lg mt-4 max-w-xl opacity-90">{topOpp.detail}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/opportunity/${topOpp.id}`)}
                className="bg-secondary-container text-on-secondary-container px-6 py-4 rounded-lg font-bold text-headline-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                View Technical Plan <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center text-[11px] font-bold text-white/50 uppercase tracking-widest">Est. Completion: {topOpp.migrationDays} Business Days</p>
            </div>
          </div>
        )}

        {/* Risk + Roadmap Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Do Not Migrate */}
          <div className="bg-error-container/20 border border-error/20 p-gutter rounded-lg">
            <div className="flex items-center gap-2 mb-stack-md text-error">
              <span className="material-symbols-outlined icon-filled">warning</span>
              <h4 className="font-bold text-headline-md">Do Not Migrate Yet</h4>
            </div>
            {doNotMigrate.map(item => (
              <div key={item.name} className="executive-card border-error/10 p-4 rounded-lg mb-3">
                <p className="font-bold text-primary">{item.name}</p>
                <p className="text-body-sm text-on-surface-variant mt-2">{item.reason}</p>
                <p className="text-[11px] text-outline mt-2 uppercase tracking-wide">Revisit: {item.revisitWhen}</p>
              </div>
            ))}
          </div>

          {/* Roadmap preview */}
          <div className="executive-card p-gutter rounded-lg">
            <div className="flex justify-between items-center mb-stack-md">
              <h4 className="text-headline-md font-headline-md">30-Day Roadmap</h4>
              <span className="text-label-caps font-label-caps text-on-surface-variant">Phase 1</span>
            </div>
            <div className="space-y-5 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-outline-variant" />
              {roadmap.map((item, i) => (
                <div key={i} className={`relative pl-8 flex gap-4 ${i > 0 ? 'opacity-' + (i === 1 ? '60' : '30') : ''}`}>
                  <div className={`absolute left-0 top-1 w-4 h-4 rounded-full ring-4 ring-white ${i === 0 ? 'bg-on-tertiary-container' : 'bg-outline-variant'}`} />
                  <div>
                    <p className="text-body-sm font-bold text-primary">{item.week}: {item.title}</p>
                    <p className="text-[11px] text-on-surface-variant uppercase">{item.status === 'scheduled' ? 'Status: Scheduled' : item.status === 'pending' ? 'Status: Pending' : 'Status: Roadmap'}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/roadmap')} className="w-full mt-stack-md py-2 border border-outline-variant rounded-lg text-label-caps font-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              View Full Roadmap →
            </button>
          </div>
        </div>

      </div>
    </Layout>
  )
}
