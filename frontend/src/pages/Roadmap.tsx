import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAnalysis } from '../AnalysisContext'

const weekColors = ['bg-primary', 'bg-secondary-container', 'bg-on-tertiary-container']
const weekTextColors = ['text-on-primary', 'text-on-secondary-container', 'text-white']
const statusBadge: Record<string, string> = {
  scheduled: 'bg-slate-100 text-slate-700',
  pending: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  roadmap: 'bg-[#ECFDF5] text-[#065F46]',
}
const statusLabel: Record<string, string> = {
  scheduled: 'Scheduled',
  pending: 'Pending Verification',
  roadmap: 'Roadmap',
}

export default function Roadmap() {
  const navigate = useNavigate()
  const { analysis } = useAnalysis()

  useEffect(() => { if (!analysis) navigate('/new') }, [analysis, navigate])
  if (!analysis) return null

  const { roadmap, estimatedAnnualSavings, confidence } = analysis

  return (
    <Layout title="30-Day Roadmap" subtitle="Migration execution plan">
      <div className="flex flex-col gap-stack-lg">

        {/* Header stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">30-Day Migration Roadmap</h1>
            <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              Strategic execution plan for the migration. Focused on minimizing downtime and maximizing ROI.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="executive-card px-4 py-3 rounded text-right">
              <p className="text-label-caps font-label-caps text-on-surface-variant">Est. Annual Savings</p>
              <p className="text-headline-md font-bold text-on-tertiary-container">${estimatedAnnualSavings.toLocaleString()}</p>
            </div>
            <div className="executive-card px-4 py-3 rounded text-right">
              <p className="text-label-caps font-label-caps text-on-surface-variant">Confidence</p>
              <p className="text-headline-md font-bold text-primary">{confidence}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {roadmap.map((item, i) => (
              <div key={i} className="executive-card rounded-lg p-gutter roadmap-track hover:shadow-sm transition-all">
                <div className="flex items-start gap-5 relative z-10">
                  <div className={`w-10 h-10 rounded-full ${weekColors[i] ?? 'bg-outline-variant'} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${weekTextColors[i] ?? 'text-on-surface'} text-[20px]`}>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-stack-md flex-wrap gap-2">
                      <h3 className="text-headline-md font-headline-md text-primary">{item.week}: {item.title}</h3>
                      <span className={`text-label-caps font-label-caps px-3 py-1 rounded ${statusBadge[item.status] ?? ''}`}>{statusLabel[item.status] ?? item.status}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.tasks.map(task => (
                        <div key={task.id} className={`p-3 bg-surface-bright border border-outline-variant rounded ${i === 0 ? 'border-l-4 border-l-secondary-container' : ''}`}>
                          <p className="text-label-caps font-label-caps text-secondary mb-1">Task {task.id}</p>
                          <p className="text-body-sm font-bold text-primary">{task.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* Matrix */}
            <div className="executive-card rounded-lg p-gutter">
              <div className="flex justify-between items-start mb-gutter">
                <h4 className="text-label-caps font-label-caps text-on-surface-variant uppercase">ROI Matrix</h4>
                <span className="text-headline-md font-bold text-primary">{confidence}</span>
              </div>
              <div className="relative h-44 w-full bg-surface-container rounded-lg p-3 flex flex-col justify-between overflow-hidden matrix-grid">
                <div className="flex justify-between h-full relative">
                  <div className="flex flex-col justify-between text-[10px] text-outline font-bold">
                    <span>HIGH ROI</span>
                    <span>LOW ROI</span>
                  </div>
                  <div className="flex-1 border-l border-b border-outline-variant relative mx-2 mb-3">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary-container/20 border-2 border-secondary-container rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-on-secondary-container text-center">TARGET ZONE</span>
                    </div>
                    <div className="absolute top-3 right-5 w-3 h-3 bg-primary rounded-full ring-4 ring-white shadow" />
                  </div>
                  <div className="flex items-end text-[10px] text-outline font-bold pb-0.5 flex-col justify-end gap-1">
                    <span>LOW</span>
                    <span className="-rotate-90 whitespace-nowrap">COMPLEXITY</span>
                  </div>
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-3 italic text-[12px]">Top opportunity sits in high-impact, low-complexity quadrant.</p>
            </div>

            {/* Risk */}
            <div className="executive-card rounded-lg p-gutter">
              <h4 className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-gutter">Risk Assessment</h4>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Latency Risk', value: 15, color: 'bg-on-tertiary-container', rating: 'Low', ratingColor: 'text-[#065F46]' },
                  { label: 'Data Integrity', value: 10, color: 'bg-on-tertiary-container', rating: 'Low', ratingColor: 'text-[#065F46]' },
                  { label: 'Complexity', value: 45, color: 'bg-secondary-container', rating: 'Medium', ratingColor: 'text-secondary' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-body-sm mb-1">
                      <span>{r.label}</span>
                      <span className={`font-bold ${r.ratingColor}`}>{r.rating}</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                      <div className={`${r.color} h-full transition-all`} style={{ width: `${r.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="bg-primary text-on-primary rounded-lg p-gutter">
              <h4 className="text-label-caps font-label-caps text-slate-400 mb-gutter">Required Talent</h4>
              <ul className="flex flex-col gap-3">
                {[
                  '1× Senior Cloud Architect',
                  '2× Node.js / Lambda Devs',
                  '0.5× DevOps Engineer',
                ].map(person => (
                  <li key={person} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">person</span>
                    <span className="text-body-sm font-medium">{person}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-gutter bg-white text-primary py-2 rounded font-bold text-body-sm hover:bg-slate-100 transition-colors">
                Assign Team
              </button>
            </div>
          </div>
        </div>

        {/* Footer action */}
        <div className="p-gutter bg-surface-container-high rounded-lg border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-gutter">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full border border-outline-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">priority_high</span>
            </div>
            <div>
              <p className="font-bold text-primary">Executive Action Required</p>
              <p className="text-body-sm text-on-surface-variant">Approve infrastructure budget to maintain Day 1 start.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-primary text-primary font-bold rounded hover:bg-white transition-all text-label-caps font-label-caps">Decline</button>
            <button className="px-6 py-2 bg-primary text-on-primary font-bold rounded shadow hover:opacity-90 active:scale-95 transition-all text-label-caps font-label-caps">Approve Roadmap</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
