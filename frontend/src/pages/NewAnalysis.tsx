import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const stackOptions = ['React (Frontend)', 'Express (Backend)', 'PostgreSQL (Database)', 'Stripe (Payments)', 'AWS S3 (Storage)']
const stackIcons: Record<string, string> = {
  'React (Frontend)': 'javascript',
  'Express (Backend)': 'terminal',
  'PostgreSQL (Database)': 'database',
  'Stripe (Payments)': 'payments',
  'AWS S3 (Storage)': 'cloud',
}

const uploadedFiles = [
  { name: 'auth_workflow_v2.png', size: '1.4 MB', done: true },
  { name: 'infra_specs.pdf', size: '3.8 MB', done: false, progress: 65 },
]

export default function NewAnalysis() {
  const navigate = useNavigate()
  const dropRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [stack, setStack] = useState(['React (Frontend)', 'Express (Backend)', 'PostgreSQL (Database)'])
  const [scanning, setScanning] = useState(false)
  const [productName, setProductName] = useState('Gym Booking SaaS')

  const handleDrag = (e: React.DragEvent, over: boolean) => {
    e.preventDefault()
    setIsDragOver(over)
  }

  const removeStack = (item: string) => setStack(s => s.filter(x => x !== item))
  const addStack = (item: string) => { if (!stack.includes(item)) setStack(s => [...s, item]) }

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => navigate('/progress'), 1200)
  }

  const readiness = Math.min(100, 60 + stack.length * 8 + (productName ? 10 : 0))

  return (
    <Layout title="New Analysis" subtitle="Initiate Migration Scan">
      <div className="mb-stack-lg">
        <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Initiate Migration Scan</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          Upload your existing system blueprints and provide product context to generate a high-ROI serverless roadmap.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Upload Panel */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-stack-md">
          <div className="executive-card rounded-xl p-stack-lg">
            <div className="flex justify-between items-center mb-stack-md">
              <div className="flex items-center gap-stack-sm">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary icon-filled">upload_file</span>
                </div>
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary">Step 1: Upload Assets</h2>
                  <p className="text-body-sm text-on-surface-variant">Screenshots and workflow diagrams</p>
                </div>
              </div>
              <label className="cursor-pointer text-label-caps font-label-caps text-on-secondary-container bg-secondary-fixed hover:bg-secondary-fixed-dim px-4 py-2 rounded-lg transition-colors">
                Browse Files
                <input type="file" className="hidden" multiple accept=".png,.jpg,.pdf" />
              </label>
            </div>

            {/* Drop zone */}
            <div
              ref={dropRef}
              onDragEnter={e => handleDrag(e, true)}
              onDragOver={e => handleDrag(e, true)}
              onDragLeave={e => handleDrag(e, false)}
              onDrop={e => { handleDrag(e, false) }}
              className={`border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center transition-all group ${
                isDragOver ? 'border-primary bg-surface-container' : 'border-outline-variant bg-surface-bright hover:border-primary'
              }`}
            >
              <div className="w-14 h-14 bg-surface-container-high rounded-full flex items-center justify-center mb-stack-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[28px]">cloud_upload</span>
              </div>
              <p className="text-headline-md font-headline-md text-primary mb-1">Drag and drop assets here</p>
              <p className="text-body-sm text-on-surface-variant">Supports PNG, JPEG, PDF up to 25MB</p>
              <div className="mt-stack-md flex gap-stack-sm">
                {['SCREENSHOTS', 'DIAGRAMS', 'README'].map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded text-[10px] font-bold text-on-surface-variant border border-outline-variant">
                    <span className="material-symbols-outlined text-[13px]">{tag === 'SCREENSHOTS' ? 'image' : tag === 'DIAGRAMS' ? 'account_tree' : 'article'}</span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* File list */}
            <div className="mt-stack-md flex flex-col gap-2">
              {uploadedFiles.map(f => (
                <div key={f.name} className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-surface-container-high rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[18px]">{f.name.endsWith('.pdf') ? 'description' : 'image'}</span>
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-primary">{f.name}</p>
                      <p className="text-[10px] text-on-surface-variant">{f.size} • {f.done ? 'Complete' : `Uploading ${f.progress}%`}</p>
                    </div>
                  </div>
                  {f.done
                    ? <span className="material-symbols-outlined text-on-tertiary-container icon-filled">check_circle</span>
                    : <div className="w-16 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all" style={{ width: `${f.progress}%` }} />
                      </div>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: 'lightbulb', text: 'Upload raw SQL schemas for deeper database optimization insights.' },
              { icon: 'security', text: 'Data is processed locally and never stored. All scan logs are encrypted.' },
              { icon: 'bolt', text: 'Scanning usually takes 2–5 minutes depending on infrastructure complexity.' },
            ].map(({ icon, text }) => (
              <div key={icon} className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant">
                <span className="material-symbols-outlined text-secondary icon-filled mb-2 block">{icon}</span>
                <p className="text-body-sm text-on-surface">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Context */}
        <section className="col-span-12 lg:col-span-5">
          <div className="executive-card rounded-xl p-stack-lg flex flex-col h-full">
            <div className="flex items-center gap-stack-sm mb-stack-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary icon-filled">dataset</span>
              </div>
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">Step 2: Product Context</h2>
                <p className="text-body-sm text-on-surface-variant">Core technology specifications</p>
              </div>
            </div>

            <form className="flex flex-col gap-stack-md flex-1">
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant block mb-1">Product Name</label>
                <input
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none px-3 py-2 text-body-lg transition-all rounded-t-lg"
                  placeholder="e.g. Gym Booking SaaS"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant block mb-2">Technology Stack</label>
                <div className="flex flex-col gap-2">
                  {stack.map(item => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                      <div className="bg-white p-1 rounded border border-outline-variant w-8 h-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[15px]">{stackIcons[item] ?? 'code'}</span>
                      </div>
                      <span className="text-body-sm font-bold flex-1">{item}</span>
                      <button type="button" onClick={() => removeStack(item)} className="material-symbols-outlined text-outline-variant hover:text-error transition-colors text-[18px]">close</button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {stackOptions.filter(o => !stack.includes(o)).map(opt => (
                    <button key={opt} type="button" onClick={() => addStack(opt)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-outline-variant rounded-lg text-label-caps font-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-all text-[11px]">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      {opt.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant block mb-1">Pain Points (optional)</label>
                <textarea
                  className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none px-3 py-2 text-body-sm resize-none transition-all rounded-t-lg"
                  rows={3}
                  placeholder="e.g. High EC2 costs during off-peak hours, slow monthly report generation..."
                />
              </div>
            </form>

            <div className="mt-stack-lg pt-stack-md border-t border-outline-variant">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-label-caps font-label-caps text-on-surface-variant">Scanner Readiness</p>
                  <p className="text-headline-md font-headline-md text-primary">{readiness}% Complete</p>
                </div>
                <div className="w-full max-w-[120px] h-2 bg-surface-container rounded-full overflow-hidden ml-4">
                  <div className="bg-secondary-container h-full transition-all duration-500" style={{ width: `${readiness}%` }} />
                </div>
              </div>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="w-full bg-primary text-on-primary py-4 rounded-lg text-headline-md font-headline-md font-bold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Initializing...
                  </>
                ) : 'Run Scan'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
