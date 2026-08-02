import { NavLink, useNavigate } from 'react-router-dom'

const navLinks = [
  { to: '/dashboard', icon: 'assessment', label: 'Dashboard' },
  { to: '/opportunity/1', icon: 'lightbulb', label: 'Opportunities' },
  { to: '/architecture', icon: 'account_tree', label: 'Architecture' },
  { to: '/roadmap', icon: 'route', label: 'Roadmap' },
  { to: '/export', icon: 'file_download', label: 'Export' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  return (
    <aside className="hidden lg:flex flex-col h-full py-stack-lg px-gutter bg-surface-container-low border-r border-outline-variant w-64 shrink-0 fixed top-0 left-0 z-40">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary icon-filled text-[20px]">qr_code_scanner</span>
        </div>
        <div>
          <h1 className="text-headline-md font-headline-md font-black text-primary leading-none">Serverless Scanner</h1>
          <p className="text-label-caps font-label-caps text-on-surface-variant opacity-70">Executive Suite</p>
        </div>
      </div>

      <p className="px-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-2">Current Environment</p>
      <div className="flex items-center gap-3 px-4 py-2 mb-4 bg-surface-container-high rounded-lg border border-outline-variant">
        <span className="material-symbols-outlined text-primary icon-filled text-[18px]">fitness_center</span>
        <span className="text-label-caps font-label-caps text-on-surface font-bold">Gym Booking SaaS</span>
      </div>

      <p className="px-4 text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-2">Navigation</p>
      <nav className="flex-1 flex flex-col gap-1">
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-label-caps font-label-caps ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98]'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 border-t border-outline-variant pt-4 flex flex-col gap-2">
        <button
          onClick={() => navigate('/new')}
          className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all text-label-caps font-label-caps"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Scan
        </button>
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors text-label-caps font-label-caps">
          <span className="material-symbols-outlined text-[18px]">help</span> Help
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-error transition-colors text-label-caps font-label-caps">
          <span className="material-symbols-outlined text-[18px]">logout</span> Logout
        </a>
      </div>
    </aside>
  )
}
