import { useNavigate } from 'react-router-dom'

export default function NoScanPlaceholder() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
      <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-outline text-[36px]">qr_code_scanner</span>
      </div>
      <div>
        <p className="text-label-caps font-label-caps text-on-surface-variant mb-2">NO ANALYSIS YET</p>
        <p className="text-body-lg text-on-surface-variant max-w-xs">
          Run a scan to generate your serverless migration assessment.
        </p>
      </div>
      <button
        onClick={() => navigate('/new')}
        className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-label-caps font-label-caps hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Start New Scan
      </button>
    </div>
  )
}
