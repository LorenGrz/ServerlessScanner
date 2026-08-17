import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnalysisProvider } from './AnalysisContext'
import NewAnalysis from './pages/NewAnalysis'
import Progress from './pages/Progress'
import Dashboard from './pages/Dashboard'
import OpportunityDetail from './pages/OpportunityDetail'
import Architecture from './pages/Architecture'
import Roadmap from './pages/Roadmap'
import Export from './pages/Export'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AnalysisProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/new" replace />} />
        <Route path="/new" element={<NewAnalysis />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunity/:id" element={<OpportunityDetail />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/export" element={<Export />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/new" replace />} />
      </Routes>
    </BrowserRouter>
    </AnalysisProvider>
  )
}
