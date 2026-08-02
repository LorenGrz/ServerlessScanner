import { useState } from 'react'
import Layout from '../components/Layout'

type Tab = 'scan' | 'aws' | 'notifications' | 'integrations'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'scan', label: 'Scan Preferences', icon: 'tune' },
  { id: 'aws', label: 'AWS Config', icon: 'cloud' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'integrations', label: 'Integrations', icon: 'extension' },
]

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-surface-container-high'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : ''}`} />
    </button>
  )
}

const contextHelp: Record<Tab, { title: string; bullets: string[] }> = {
  scan: {
    title: 'What this affects',
    bullets: [
      'Scan depth controls how many workflow patterns are analyzed.',
      'Auto-detect stack reduces setup time but may miss custom frameworks.',
      'Confidence threshold filters out low-certainty opportunities from the report.',
    ],
  },
  aws: {
    title: 'AWS Configuration',
    bullets: [
      'Default region sets where new resources will be recommended.',
      'IAM Role ARN is used to estimate actual costs via Cost Explorer.',
      'Cost data enriches savings estimates with your real pricing.',
    ],
  },
  notifications: {
    title: 'Notification behavior',
    bullets: [
      'Scan complete emails include a summary and link to the dashboard.',
      'Weekly digest provides a rolling ROI summary across all analyses.',
    ],
  },
  integrations: {
    title: 'Integration scope',
    bullets: [
      'GitHub allows auto-import of README and architecture files.',
      'Jira creates tickets automatically for each roadmap task.',
      'Slack posts scan results to your chosen channel.',
    ],
  },
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('scan')
  const [depth, setDepth] = useState<'Quick' | 'Standard' | 'Deep'>('Standard')
  const [autoDetect, setAutoDetect] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState(70)
  const [region, setRegion] = useState('us-east-1')
  const [roleArn, setRoleArn] = useState('')
  const [costData, setCostData] = useState(false)
  const [emailOnComplete, setEmailOnComplete] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [slackWebhook, setSlackWebhook] = useState('')
  const [githubConnected, setGithubConnected] = useState(false)
  const [jiraConnected, setJiraConnected] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const help = contextHelp[activeTab]

  return (
    <Layout title="Settings" subtitle="Scan preferences and integrations">
      <div className="flex flex-col gap-stack-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-headline-lg font-headline-lg text-primary">Settings</h1>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-lg font-bold text-label-caps font-label-caps hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {saved ? <><span className="material-symbols-outlined text-[18px]">check</span> Saved!</> : <><span className="material-symbols-outlined text-[18px]">save</span> Save Changes</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Tab nav */}
          <div className="lg:col-span-3">
            <div className="executive-card rounded-xl overflow-hidden">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-b border-outline-variant last:border-0 text-label-caps font-label-caps ${
                    activeTab === t.id
                      ? 'bg-secondary-container text-on-secondary-container font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-6 executive-card rounded-xl p-gutter flex flex-col gap-stack-lg">
            {activeTab === 'scan' && (
              <>
                <div>
                  <h3 className="text-headline-md font-headline-md mb-stack-md">Scan Depth</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Quick', 'Standard', 'Deep'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDepth(d)}
                        className={`p-3 rounded-lg border text-center transition-all ${depth === d ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant hover:border-primary text-on-surface-variant'}`}
                      >
                        <p className="font-bold text-body-sm">{d}</p>
                        <p className="text-[10px] mt-1 opacity-70">{d === 'Quick' ? '~1 min' : d === 'Standard' ? '~3 min' : '~8 min'}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant">
                  <div>
                    <p className="font-bold text-primary">Auto-detect Stack</p>
                    <p className="text-body-sm text-on-surface-variant">Infer technology stack from uploaded files</p>
                  </div>
                  <Toggle enabled={autoDetect} onChange={setAutoDetect} />
                </div>
                <div className="border-t border-outline-variant pt-3">
                  <div className="flex justify-between mb-2">
                    <p className="font-bold text-primary">Confidence Threshold</p>
                    <span className="text-label-caps font-label-caps text-secondary">{confidenceThreshold}%</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mb-3">Filter out opportunities below this confidence level</p>
                  <input type="range" min={50} max={95} step={5} value={confidenceThreshold}
                    onChange={e => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-black" />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                    <span>50% (Broad)</span><span>95% (Strict)</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'aws' && (
              <>
                <div>
                  <label className="text-label-caps font-label-caps text-on-surface-variant block mb-2">Default AWS Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)}
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none px-3 py-2 text-body-lg">
                    {['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-label-caps font-label-caps text-on-surface-variant block mb-2">IAM Role ARN (for cost estimation)</label>
                  <input value={roleArn} onChange={e => setRoleArn(e.target.value)}
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none px-3 py-2 text-body-lg font-data-mono text-[13px]"
                    placeholder="arn:aws:iam::123456789012:role/scanner-read-role" />
                  <p className="text-[11px] text-on-surface-variant mt-1">Read-only role used to pull Cost Explorer data</p>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant">
                  <div>
                    <p className="font-bold text-primary">Live Cost Data</p>
                    <p className="text-body-sm text-on-surface-variant">Enrich savings estimates with actual AWS costs</p>
                  </div>
                  <Toggle enabled={costData} onChange={setCostData} />
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-bold text-primary">Email on Scan Complete</p>
                    <p className="text-body-sm text-on-surface-variant">Receive a summary email when analysis finishes</p>
                  </div>
                  <Toggle enabled={emailOnComplete} onChange={setEmailOnComplete} />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant">
                  <div>
                    <p className="font-bold text-primary">Weekly ROI Digest</p>
                    <p className="text-body-sm text-on-surface-variant">Rolling summary of savings across all analyses</p>
                  </div>
                  <Toggle enabled={weeklyDigest} onChange={setWeeklyDigest} />
                </div>
                {emailOnComplete && (
                  <div className="border-t border-outline-variant pt-3">
                    <label className="text-label-caps font-label-caps text-on-surface-variant block mb-2">Notification Email</label>
                    <input className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none px-3 py-2 text-body-lg"
                      placeholder="cto@company.com" type="email" />
                  </div>
                )}
              </>
            )}

            {activeTab === 'integrations' && (
              <>
                {[
                  { label: 'GitHub', icon: 'code', desc: 'Auto-import README and architecture files from repos', connected: githubConnected, toggle: setGithubConnected },
                  { label: 'Jira', icon: 'task_alt', desc: 'Create tickets automatically for each roadmap task', connected: jiraConnected, toggle: setJiraConnected },
                ].map(({ label, icon, desc, connected, toggle }) => (
                  <div key={label} className="flex items-center justify-between py-4 border-b border-outline-variant last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">{icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary">{label}</p>
                        <p className="text-body-sm text-on-surface-variant">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(!connected)}
                      className={`px-4 py-2 rounded-lg text-label-caps font-label-caps font-bold transition-all ${
                        connected
                          ? 'bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error'
                          : 'bg-primary text-on-primary hover:opacity-90'
                      }`}
                    >
                      {connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
                <div className="border-t border-outline-variant pt-4">
                  <label className="text-label-caps font-label-caps text-on-surface-variant block mb-2">Slack Webhook URL</label>
                  <input value={slackWebhook} onChange={e => setSlackWebhook(e.target.value)}
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:outline-none px-3 py-2 text-body-lg font-data-mono text-[13px]"
                    placeholder="https://hooks.slack.com/services/..." />
                  <p className="text-[11px] text-on-surface-variant mt-1">Posts scan results to your chosen Slack channel</p>
                </div>
              </>
            )}
          </div>

          {/* Context help */}
          <div className="lg:col-span-3">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-gutter sticky top-24">
              <div className="flex items-center gap-2 mb-stack-md">
                <span className="material-symbols-outlined text-secondary icon-filled">info</span>
                <h4 className="font-bold text-primary">{help.title}</h4>
              </div>
              <ul className="flex flex-col gap-3">
                {help.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface-variant">
                    <span className="text-outline mt-1 shrink-0">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
