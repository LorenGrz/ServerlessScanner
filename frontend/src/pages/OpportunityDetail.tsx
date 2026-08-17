import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAnalysis } from '../AnalysisContext'

export default function OpportunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { analysis } = useAnalysis()
  const opp = analysis.opportunities.find(o => o.id === id) ?? analysis.opportunities[0]

  const badgeColor = (val: string) => {
    if (val === 'Low') return 'text-[#065F46] bg-[#ECFDF5]'
    if (val === 'High') return 'text-secondary bg-secondary-fixed'
    return 'text-on-surface-variant bg-surface-container'
  }

  return (
    <Layout title={opp.name} subtitle="Opportunity Detail">
      <div className="flex flex-col gap-stack-lg">

        {/* Opportunity nav */}
        <div className="flex items-center gap-2 flex-wrap">
          {analysis.opportunities.map(o => (
            <button
              key={o.id}
              onClick={() => navigate(`/opportunity/${o.id}`)}
              className={`px-4 py-2 rounded-lg text-label-caps font-label-caps transition-all ${
                o.id === opp.id
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {o.rank}. {o.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-gutter min-w-0">

            {/* Scores row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Fit Score', value: `${opp.fit}`, sub: '/100' },
                { label: 'Savings', value: opp.savings, sub: '' },
                { label: 'Complexity', value: opp.complexity, sub: '' },
                { label: 'Risk', value: opp.risk, sub: '' },
                { label: 'Confidence', value: opp.confidence, sub: '' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="executive-card rounded-lg p-3 text-center">
                  <p className="text-label-caps font-label-caps text-on-surface-variant">{label}</p>
                  <p className="text-headline-md font-bold text-primary mt-1">{value}<span className="text-outline-variant text-body-sm">{sub}</span></p>
                </div>
              ))}
            </div>

            {/* Architecture diagram */}
            <div className="executive-card rounded-xl overflow-hidden">
              <div className="px-gutter py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <div>
                  <h3 className="text-headline-md font-headline-md">Architecture Mapping</h3>
                  <p className="text-body-sm text-on-surface-variant">Legacy Monolith → AWS Serverless</p>
                </div>
                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-caps font-label-caps">Proposed</span>
              </div>

              <div className="p-8 bg-surface-bright flex items-center justify-center min-h-[220px] relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <marker id="arrow" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                      <polygon fill="#c6c6cd" points="0 0, 10 3.5, 0 7" />
                    </marker>
                  </defs>
                </svg>
                <div className="flex items-center gap-4 flex-wrap justify-center w-full">
                  {opp.architectureNodes.map((node, i) => (
                    <div key={node.id} className="flex items-center gap-4">
                      <div className={`executive-card rounded-xl p-5 w-40 text-center hover:border-primary transition-colors cursor-pointer group ${node.type === 'target' ? 'border-secondary' : ''}`}>
                        {node.type === 'target' && (
                          <div className="text-[10px] font-bold text-secondary mb-2 uppercase tracking-widest">Target</div>
                        )}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform ${
                          node.type === 'target' ? 'bg-secondary text-white' : node.type === 'source' ? 'bg-secondary-container/20 text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          <span className="material-symbols-outlined">{node.icon}</span>
                        </div>
                        <p className="font-bold text-body-sm text-primary">{node.label}</p>
                        <p className="text-[11px] text-on-surface-variant mt-1">{node.sublabel}</p>
                      </div>
                      {i < opp.architectureNodes.length - 1 && (
                        <svg width="40" height="20" className="shrink-0">
                          <line x1="0" y1="10" x2="30" y2="10" stroke="#c6c6cd" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="4 2" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code preview */}
              <div className="bg-surface-container-highest p-gutter border-t border-outline-variant">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">code</span>
                    <span className="text-label-caps font-label-caps uppercase tracking-widest">Configuration Preview</span>
                  </div>
                  <span className="text-[11px] font-data-mono text-on-surface-variant bg-white px-2 py-1 rounded">template.yaml</span>
                </div>
                <pre className="font-data-mono text-sm leading-relaxed overflow-x-auto text-on-surface-variant bg-white/70 p-4 rounded-lg text-[12px]">
                  {opp.codePreview}
                </pre>
              </div>
            </div>

            {/* Detail */}
            <div className="executive-card rounded-lg p-gutter">
              <h4 className="text-headline-md font-headline-md mb-stack-md">Why This Opportunity</h4>
              <p className="text-body-lg text-on-surface leading-relaxed">{opp.detail}</p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-gutter shrink-0">

            {/* ROI */}
            <div className="executive-card rounded-xl p-gutter">
              <h4 className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-gutter">Financial Impact</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">Monthly Savings</p>
                    <p className="text-headline-md font-bold text-on-tertiary-container">${opp.savingsAmount.toLocaleString()}/mo</p>
                  </div>
                  <div className="w-10 h-10 bg-tertiary-fixed flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-on-tertiary-fixed-variant icon-filled">payments</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-label-caps font-label-caps text-on-surface-variant">Risk Rating</p>
                    <p className={`text-headline-md font-bold px-2 py-0.5 rounded inline-block ${badgeColor(opp.risk)}`}>{opp.risk.toUpperCase()}</p>
                  </div>
                  <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg">
                    <span className="material-symbols-outlined text-outline">security</span>
                  </div>
                </div>
                <div className="pt-gutter border-t border-outline-variant">
                  <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-3">Strategic Timeline</p>
                  <div className="flex flex-col gap-3">
                    {opp.timeline.map(t => (
                      <div key={t.phase} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-on-tertiary-container mt-1.5 shrink-0" />
                        <div>
                          <p className="text-body-sm font-bold">{t.phase}</p>
                          <p className="text-[11px] text-on-surface-variant">{t.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/roadmap')}
                className="w-full mt-gutter py-4 bg-primary text-on-primary font-bold rounded-lg text-label-caps font-label-caps flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                View Roadmap <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            {/* Confidence */}
            <div className="executive-card rounded-xl p-gutter">
              <div className="flex justify-between items-start mb-gutter">
                <h4 className="text-label-caps font-label-caps text-on-surface-variant uppercase">Opportunity Health</h4>
                <span className="text-headline-md font-headline-md text-primary">{opp.fit}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-on-surface-variant">CONFIDENCE</span>
                  <span className="text-on-tertiary-container">{opp.confidence.toUpperCase()}</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-on-tertiary-container" style={{ width: opp.confidence === 'High' ? '95%' : '65%' }} />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined text-on-tertiary-container icon-filled">verified</span>
                <div>
                  <p className="text-body-sm font-bold">AWS Well-Architected</p>
                  <p className="text-[11px] text-on-surface-variant">Verified migration path</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}
