import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/dashboard', icon: 'assessment', label: 'Score' },
  { to: '/opportunity/1', icon: 'lightbulb', label: 'Opportunities' },
  { to: '/roadmap', icon: 'route', label: 'Roadmap' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center px-2 py-2 shadow-lg">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all text-label-caps font-label-caps ${
              isActive
                ? 'bg-primary-container text-on-primary-container scale-95'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
          <span className="text-[10px] font-bold mt-0.5">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
