import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

const primaryTabs = [
  { to: '/new', icon: 'add_circle', label: 'New' },
  { to: '/dashboard', icon: 'assessment', label: 'Score' },
  { to: '/opportunity/1', icon: 'lightbulb', label: 'Opps' },
  { to: '/roadmap', icon: 'route', label: 'Roadmap' },
]

const moreTabs = [
  { to: '/architecture', icon: 'account_tree', label: 'Architecture' },
  { to: '/export', icon: 'file_download', label: 'Export' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  const isMoreActive = moreTabs.some(t => location.pathname === t.to)

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-[58px] z-[49] lg:hidden transition-transform duration-300 ${
          moreOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="bg-surface-container-lowest border-t border-outline-variant rounded-t-2xl px-4 pt-3 pb-5 shadow-xl">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-4" />
          <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-3 px-1">More views</p>
          <div className="grid grid-cols-3 gap-2">
            {moreTabs.map(({ to, icon, label }) => (
              <button
                key={to}
                onClick={() => { navigate(to); setMoreOpen(false) }}
                className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl transition-colors ${
                  location.pathname === to
                    ? 'bg-primary-container text-on-primary-container'
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">{icon}</span>
                <span className="text-[11px] font-bold">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center px-1 py-1.5 shadow-lg">
        {primaryTabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMoreOpen(false)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all min-w-[60px] ${
                isActive
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span className="text-[10px] font-bold mt-0.5">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen(o => !o)}
          className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all min-w-[60px] ${
            isMoreActive || moreOpen
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">{moreOpen ? 'close' : 'more_horiz'}</span>
          <span className="text-[10px] font-bold mt-0.5">More</span>
        </button>
      </nav>
    </>
  )
}
