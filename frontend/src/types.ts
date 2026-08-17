export interface ArchitectureNode {
  id: string
  label: string
  sublabel: string
  icon: string
  type: 'source' | 'target' | 'sink'
}

export interface TimelineItem {
  phase: string
  detail: string
}

export interface RoadmapTask {
  id: string
  label: string
  done: boolean
}

export interface Opportunity {
  id: string
  rank: number
  name: string
  icon: string
  description: string
  detail: string
  awsTarget: string
  awsServices: string[]
  fit: number
  savings: 'High' | 'Medium' | 'Low'
  savingsAmount: number
  complexity: 'Low' | 'Medium' | 'High'
  risk: 'Low' | 'Medium' | 'High'
  confidence: 'High' | 'Medium' | 'Low'
  roiLabel: string
  compositeScore: number
  migrationDays: number
  architectureNodes: ArchitectureNode[]
  timeline: TimelineItem[]
  codePreview: string
}

export interface DoNotMigrateItem {
  name: string
  reason: string
  revisitWhen: string
}

export interface RoadmapItem {
  week: string
  title: string
  icon: string
  status: 'scheduled' | 'pending' | 'roadmap'
  tasks: RoadmapTask[]
}

export interface OpenQuestion {
  text: string
  blocking: boolean
}

export interface Analysis {
  id: string
  productName: string
  score: number
  scoreDelta: string
  estimatedAnnualSavings: number
  estimatedMonthlySavings: number
  complexityTier: string
  confidence: number
  executiveSummary: string
  stack: string[]
  opportunities: Opportunity[]
  doNotMigrate: DoNotMigrateItem[]
  roadmap: RoadmapItem[]
  openQuestions: OpenQuestion[]
}
