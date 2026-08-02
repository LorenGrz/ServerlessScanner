import { readFileSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, 'public')

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

const MOCK_RESULT = {
  productName: 'Gym Booking SaaS',
  score: 84,
  estimatedAnnualSavings: 42500,
  confidence: 94,
  executiveSummary:
    'The Gym Booking SaaS platform shows strong serverless migration potential. Three high-ROI workflows identified: email reminders, Stripe webhook processing, and monthly report generation. Combined these account for ~40% of current infrastructure cost at near-zero serverless equivalents.',
  opportunities: [
    { id: '1', rank: 1, name: 'Email Reminders', fit: 94, savings: '$1,800/mo', complexity: 'Low', risk: 'Low', confidence: 'High', awsTarget: 'EventBridge + Lambda + SES' },
    { id: '2', rank: 2, name: 'Stripe Webhooks', fit: 91, savings: '$950/mo', complexity: 'Low', risk: 'Low', confidence: 'High', awsTarget: 'API Gateway + Lambda + DynamoDB' },
    { id: '3', rank: 3, name: 'Monthly Reports', fit: 86, savings: '$800/mo', complexity: 'Medium', risk: 'Low', confidence: 'High', awsTarget: 'EventBridge + Lambda + S3' },
  ],
  doNotMigrate: [
    { name: 'Core Booking Database', reason: 'PostgreSQL relational model with complex joins — requires stateful persistent connection unsuitable for Lambda cold starts.' },
    { name: 'Real-time Availability Engine', reason: 'Sub-100ms read latency requirement conflicts with Lambda invocation overhead in current traffic patterns.' },
  ],
}

function serveFile(filePath, responseStream) {
  const ext = extname(filePath)
  const contentType = MIME[ext] ?? 'application/octet-stream'
  const body = readFileSync(filePath)
  responseStream.setContentType(contentType)
  responseStream.write(body)
}

export const handler = awslambda.streamifyResponse(async (event, responseStream) => {
  const method = event.httpMethod ?? event.requestContext?.http?.method ?? 'GET'
  const rawPath = event.path ?? event.rawPath ?? '/'

  // API routes
  if (method === 'POST' && rawPath === '/api/scan') {
    await new Promise(r => setTimeout(r, 80))
    responseStream.setContentType('application/json')
    responseStream.write(JSON.stringify(MOCK_RESULT))
    responseStream.end()
    return
  }

  if (method === 'POST' && rawPath === '/api/export') {
    responseStream.setContentType('application/json')
    responseStream.write(JSON.stringify({ url: 'mock-report.pdf', message: 'Report generated successfully' }))
    responseStream.end()
    return
  }

  // Static assets (exact file match)
  const assetPath = join(PUBLIC_DIR, rawPath)
  if (existsSync(assetPath) && !assetPath.endsWith('/')) {
    try {
      serveFile(assetPath, responseStream)
      responseStream.end()
      return
    } catch {
      // fall through to SPA fallback
    }
  }

  // SPA fallback — all other GETs get index.html
  const indexPath = join(PUBLIC_DIR, 'index.html')
  serveFile(indexPath, responseStream)
  responseStream.end()
})
