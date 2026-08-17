import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import NoScanPlaceholder from '../components/NoScanPlaceholder'
import { useAnalysis } from '../AnalysisContext'

const services = [
  { id: 'eventbridge', label: 'EventBridge', sublabel: 'Scheduler / Rules', icon: 'schedule', color: 'bg-secondary-container/20 text-on-secondary-container', connections: ['lambda1'] },
  { id: 'apigw', label: 'API Gateway', sublabel: 'POST /webhook', icon: 'hub', color: 'bg-surface-container-high text-primary', connections: ['lambda2'] },
  { id: 'lambda1', label: 'Lambda', sublabel: 'Email Processor', icon: 'terminal', color: 'bg-primary text-on-primary', connections: ['ses', 's3'] },
  { id: 'lambda2', label: 'Lambda', sublabel: 'Webhook Handler', icon: 'terminal', color: 'bg-primary text-on-primary', connections: ['dynamo'] },
  { id: 'ses', label: 'SES', sublabel: 'Email Delivery', icon: 'mail', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', connections: [] },
  { id: 's3', label: 'S3', sublabel: 'Report Storage', icon: 'cloud', color: 'bg-surface-container-high text-primary', connections: [] },
  { id: 'dynamo', label: 'DynamoDB', sublabel: 'Idempotency', icon: 'database', color: 'bg-surface-container-high text-primary', connections: [] },
]

export default function Architecture() {
  const navigate = useNavigate()
  const { analysis } = useAnalysis()

  if (!analysis) return <Layout title="AWS Target Architecture" subtitle="Run a scan to get started"><NoScanPlaceholder /></Layout>

  return (
    <Layout title="AWS Target Architecture" subtitle="Proposed serverless service mapping">
      <div className="flex flex-col gap-stack-lg">

        {/* Legend */}
        <div className="flex items-center gap-6 flex-wrap">
          {[
            { color: 'bg-secondary-container/20 border border-outline-variant', label: 'Event Source' },
            { color: 'bg-primary', label: 'Compute (Lambda)' },
            { color: 'bg-tertiary-fixed', label: 'Downstream Service' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${color}`} />
              <span className="text-label-caps font-label-caps text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>

        {/* Architecture canvas */}
        <div className="executive-card rounded-xl overflow-hidden">
          <div className="px-gutter py-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-headline-md font-headline-md">Full Architecture View</h3>
              <p className="text-body-sm text-on-surface-variant">{analysis.productName} — Partial Serverless Migration</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-label-caps font-label-caps">Proposed</span>
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-caps font-label-caps">Phase 1</span>
            </div>
          </div>

          <div className="p-8 bg-surface-bright min-h-[360px]">
            {/* Row 1: Sources */}
            <div className="mb-8">
              <p className="text-label-caps font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Event Sources</p>
              <div className="flex gap-6 flex-wrap">
                {services.filter(s => ['eventbridge', 'apigw'].includes(s.id)).map(svc => (
                  <div key={svc.id} className="executive-card rounded-xl p-5 w-44 hover:border-primary transition-colors cursor-pointer group">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${svc.color} group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined">{svc.icon}</span>
                    </div>
                    <p className="font-bold text-body-sm text-primary">{svc.label}</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">{svc.sublabel}</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-on-surface-variant">
                      <span className="w-2 h-0.5 bg-outline-variant" />
                      <span className="technical-connector inline-block" />
                      <span className="material-symbols-outlined text-[12px] text-outline-variant">arrow_forward</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Compute */}
            <div className="mb-8">
              <p className="text-label-caps font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Compute Layer</p>
              <div className="flex gap-6 flex-wrap">
                {services.filter(s => s.id.startsWith('lambda')).map(svc => (
                  <div key={svc.id} className={`rounded-xl p-5 w-44 cursor-pointer group border-2 border-secondary`}>
                    <div className="absolute -top-3 left-1/2 hidden" />
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${svc.color} group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined">{svc.icon}</span>
                    </div>
                    <p className="font-bold text-body-sm text-primary">{svc.label}</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">{svc.sublabel}</p>
                    <div className="mt-3 pt-3 border-t border-outline-variant">
                      <span className="text-[10px] font-bold text-outline">Runtime</span>
                      <span className="block text-[11px] font-data-mono">nodejs22.x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Downstream */}
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Downstream Services</p>
              <div className="flex gap-6 flex-wrap">
                {services.filter(s => ['ses', 's3', 'dynamo'].includes(s.id)).map(svc => (
                  <div key={svc.id} className="executive-card rounded-xl p-5 w-44 hover:border-primary transition-colors cursor-pointer group">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${svc.color} group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined">{svc.icon}</span>
                    </div>
                    <p className="font-bold text-body-sm text-primary">{svc.label}</p>
                    <p className="text-[11px] text-on-surface-variant mt-1">{svc.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service cards detail */}
        <div>
          <h4 className="text-headline-md font-headline-md mb-stack-md">Service Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {analysis.opportunities.map(opp => (
              <button
                key={opp.id}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
                className="executive-card rounded-lg p-gutter text-left hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary icon-filled">{opp.icon}</span>
                  <span className="font-bold text-primary">{opp.name}</span>
                </div>
                <p className="text-label-caps font-label-caps text-on-tertiary-container bg-[#ECFDF5] px-2 py-1 rounded inline-block mb-3">{opp.awsTarget}</p>
                <p className="text-body-sm text-on-surface-variant">{opp.description}</p>
                <div className="mt-3 flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant group-hover:text-primary transition-colors">
                  View detail <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Do not migrate */}
        <div className="bg-error-container/20 border border-error/20 p-gutter rounded-lg">
          <div className="flex items-center gap-2 mb-stack-md text-error">
            <span className="material-symbols-outlined icon-filled">warning</span>
            <h4 className="font-bold text-headline-md">Excluded from Migration</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.doNotMigrate.map(item => (
              <div key={item.name} className="executive-card border-error/10 p-4 rounded-lg">
                <p className="font-bold text-primary">{item.name}</p>
                <p className="text-body-sm text-on-surface-variant mt-1">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
