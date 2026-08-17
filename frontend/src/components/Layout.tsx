import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-bright">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 h-full overflow-hidden">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-margin-mobile lg:p-margin-desktop pb-24 lg:pb-8 custom-scrollbar overflow-y-auto">
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
