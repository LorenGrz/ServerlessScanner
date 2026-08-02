import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  subtitle?: string
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const navigate = useNavigate()
  return (
    <header className="flex justify-between items-center w-full px-margin-mobile lg:px-margin-desktop h-16 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <div className="lg:hidden w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary icon-filled text-[16px]">qr_code_scanner</span>
        </div>
        <div>
          <h2 className="text-headline-md font-headline-md font-black text-primary leading-none">{title}</h2>
          {subtitle && <p className="text-label-caps font-label-caps text-on-surface-variant hidden md:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/export')}
          className="hidden sm:block bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-label-caps font-label-caps hover:opacity-80 active:opacity-60 transition-opacity"
        >
          Export Brief
        </button>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors">
          notifications
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container shrink-0">
          <div className="w-full h-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[16px]">person</span>
          </div>
        </div>
      </div>
    </header>
  )
}
