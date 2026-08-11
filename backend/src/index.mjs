import { readFileSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, 'public')

const TEXT_TYPES = new Set(['text/html', 'application/javascript', 'text/css', 'application/json', 'image/svg+xml', 'font/woff', 'font/woff2'])

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

const OK = (body, contentType = 'text/html', binary = false) => ({
  statusCode: 200,
  headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' },
  body: binary ? body.toString('base64') : (typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf8') : JSON.stringify(body)),
  isBase64Encoded: binary,
})

export const handler = async (event) => {
  const method = event.httpMethod ?? event.requestContext?.http?.method ?? 'GET'
  const rawPath = event.path ?? event.rawPath ?? '/'

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' }
  }

  if (method === 'POST' && rawPath === '/prod/api/scan') {
    await new Promise(r => setTimeout(r, 80))
    return OK(MOCK_RESULT, 'application/json')
  }

  if (method === 'POST' && rawPath === '/prod/api/export') {
    return OK({ url: 'mock-report.pdf', message: 'Report generated successfully' }, 'application/json')
  }

  // Strip /prod prefix if present (API Gateway stage)
  const filePath = rawPath.replace(/^\/prod/, '') || '/'

  // Static assets
  const assetPath = join(PUBLIC_DIR, filePath)
  if (existsSync(assetPath) && !assetPath.endsWith('/')) {
    try {
      const ext = extname(assetPath)
      const contentType = MIME[ext] ?? 'application/octet-stream'
      const buf = readFileSync(assetPath)
      const binary = !TEXT_TYPES.has(contentType)
      return OK(buf, contentType, binary)
    } catch {
      // fall through to SPA fallback
    }
  }

  // SPA fallback
  const indexPath = join(PUBLIC_DIR, 'index.html')
  return OK(readFileSync(indexPath, 'utf8'), 'text/html')
}
