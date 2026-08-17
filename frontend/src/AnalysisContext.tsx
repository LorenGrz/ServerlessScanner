import { createContext, useContext, useState, ReactNode } from 'react'
import type { Analysis } from './types'

export type { Analysis }

export interface ScanParams {
  productName: string
  stack: string[]
  painPoints: string
}

interface AnalysisContextType {
  analysis: Analysis | null
  setAnalysis: (a: Analysis | null) => void
  scanParams: ScanParams | null
  setScanParams: (p: ScanParams) => void
}

const AnalysisContext = createContext<AnalysisContextType>({
  analysis: null,
  setAnalysis: () => {},
  scanParams: null,
  setScanParams: () => {},
})

function loadStored(): Analysis | null {
  try {
    const raw = localStorage.getItem('scanner_analysis')
    return raw ? (JSON.parse(raw) as Analysis) : null
  } catch {
    return null
  }
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysisState] = useState<Analysis | null>(loadStored)
  const [scanParams, setScanParams] = useState<ScanParams | null>(null)

  const setAnalysis = (a: Analysis | null) => {
    setAnalysisState(a)
    try {
      if (a) localStorage.setItem('scanner_analysis', JSON.stringify(a))
      else localStorage.removeItem('scanner_analysis')
    } catch { /* ignore */ }
  }

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, scanParams, setScanParams }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export const useAnalysis = () => useContext(AnalysisContext)
