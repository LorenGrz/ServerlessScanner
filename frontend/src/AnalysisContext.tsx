import { createContext, useContext, useState, ReactNode } from 'react'
import { mockAnalysis } from './data/mockData'

export type Analysis = typeof mockAnalysis

export interface ScanParams {
  productName: string
  stack: string[]
  painPoints: string
}

interface AnalysisContextType {
  analysis: Analysis
  setAnalysis: (a: Analysis) => void
  scanParams: ScanParams | null
  setScanParams: (p: ScanParams) => void
}

const AnalysisContext = createContext<AnalysisContextType>({
  analysis: mockAnalysis,
  setAnalysis: () => {},
  scanParams: null,
  setScanParams: () => {},
})

function loadStored(): Analysis {
  try {
    const raw = localStorage.getItem('scanner_analysis')
    return raw ? (JSON.parse(raw) as Analysis) : mockAnalysis
  } catch {
    return mockAnalysis
  }
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysisState] = useState<Analysis>(loadStored)
  const [scanParams, setScanParams] = useState<ScanParams | null>(null)

  const setAnalysis = (a: Analysis) => {
    setAnalysisState(a)
    try { localStorage.setItem('scanner_analysis', JSON.stringify(a)) } catch { /* ignore */ }
  }

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, scanParams, setScanParams }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export const useAnalysis = () => useContext(AnalysisContext)
