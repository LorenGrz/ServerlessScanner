import Layout from '../components/Layout'
import NoScanPlaceholder from '../components/NoScanPlaceholder'
import { useAnalysis } from '../AnalysisContext'

export default function Export() {
  const { analysis } = useAnalysis()

  if (!analysis) return <Layout title="Export Report" subtitle="Run a scan to get started"><NoScanPlaceholder /></Layout>

  const { productName, score, executiveSummary, opportunities, doNotMigrate, estimatedAnnualSavings, confidence, roadmap } = analysis

  return (
    <Layout title="Export Report" subtitle="Migration brief ready to share">
      <div className="flex flex-col gap-stack-lg">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md">
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary">Migration Brief</h1>
            <p className="text-body-lg text-on-surface-variant">Ready to share with your team or board</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-outline-variant rounded-lg text-label-caps font-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Link
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-lg font-bold text-label-caps font-label-caps hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Download PDF
            </button>
          </div>
        </div>

        {/* Report preview */}
        <div className="executive-card rounded-xl overflow-hidden">
          <div className="bg-primary text-on-primary px-gutter py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined icon-filled">qr_code_scanner</span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps text-white/60">SERVERLESS SCANNER</p>
                <p className="font-bold text-on-primary">Migration Brief</p>
              </div>
            </div>
            <h2 className="text-headline-lg font-headline-lg">{productName}</h2>
            <p className="text-on-primary-container opacity-80 mt-2">Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="p-gutter md:p-margin-desktop space-y-8">
            {/* Score row */}
            <div className="grid grid-cols-3 gap-4 pb-8 border-b border-outline-variant">
              <div className="text-center">
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">SCANNER SCORE</p>
                <p className="text-display-score font-display-score text-primary">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">EST. SAVINGS</p>
                <p className="text-headline-lg font-headline-lg text-on-tertiary-container">${(estimatedAnnualSavings / 1000).toFixed(0)}k/yr</p>
              </div>
              <div className="text-center">
                <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">CONFIDENCE</p>
                <p className="text-headline-lg font-headline-lg text-secondary">{confidence}%</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-3">Executive Summary</p>
              <p className="text-body-lg text-on-surface leading-relaxed">{executiveSummary}</p>
            </div>

            {/* Opportunities table */}
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-3">Top Serverless Opportunities</p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      {['Workflow', 'AWS Target', 'Fit', 'Savings', 'Complexity', 'Risk', 'Confidence'].map(h => (
                        <th key={h} className="text-left text-label-caps font-label-caps text-on-surface-variant py-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities.map(opp => (
                      <tr key={opp.id} className="border-b border-outline-variant">
                        <td className="py-3 pr-4 font-bold text-primary">{opp.name}</td>
                        <td className="py-3 pr-4 text-on-surface-variant font-data-mono text-[12px]">{opp.awsTarget}</td>
                        <td className="py-3 pr-4 font-bold">{opp.fit}</td>
                        <td className="py-3 pr-4">{opp.savings}</td>
                        <td className="py-3 pr-4">{opp.complexity}</td>
                        <td className="py-3 pr-4">{opp.risk}</td>
                        <td className="py-3 pr-4">{opp.confidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Do not migrate */}
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-3">Do Not Migrate Yet</p>
              {doNotMigrate.map(item => (
                <div key={item.name} className="bg-error-container/10 border border-error/10 p-4 rounded-lg mb-3">
                  <p className="font-bold text-primary">{item.name}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">{item.reason}</p>
                </div>
              ))}
            </div>

            {/* 30-day plan */}
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-3">30-Day Migration Plan</p>
              <div className="flex flex-col gap-4">
                {roadmap.map(item => (
                  <div key={item.week} className="flex gap-4 items-start">
                    <div className="w-24 shrink-0">
                      <p className="text-label-caps font-label-caps text-primary font-bold">{item.week}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-primary mb-2">{item.title}</p>
                      <ul className="flex flex-col gap-1">
                        {item.tasks.map(t => (
                          <li key={t.id} className="text-body-sm text-on-surface-variant flex items-start gap-2">
                            <span className="text-outline mt-1">•</span>
                            {t.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-outline-variant text-center">
              <p className="text-body-sm text-on-surface-variant">Generated by Serverless Scanner — Executive Suite</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
