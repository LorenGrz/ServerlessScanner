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

const makeScanResult = (productName = 'Your Product', stack = []) => ({
  id: Date.now().toString(),
  productName,
  score: 84,
  scoreDelta: '+12pts Since Last Scan',
  estimatedAnnualSavings: 42500,
  estimatedMonthlySavings: 3541,
  complexityTier: 'Medium-Low',
  confidence: 94,
  executiveSummary: `The ${productName} infrastructure shows significant potential for operational cost reduction through asynchronous offloading. Migration of non-core services like email triggers and reporting will yield high-ROI wins with minimal risk. Core relational databases should remain stateful to preserve strict transactional consistency.`,
  stack,
  opportunities: [
    {
      id: '1',
      rank: 1,
      name: 'Email Reminders',
      icon: 'mail',
      description: 'Event-driven triggers via AWS Lambda',
      detail: `Current overhead for EC2-based mail workers is $1,200/mo with 84% idle time. Shifting to Lambda + SES reduces costs to ~$45/mo while increasing delivery reliability during peak hours.`,
      awsTarget: 'EventBridge Scheduler + Lambda + SES',
      awsServices: ['EventBridge', 'Lambda', 'SES'],
      fit: 94,
      savings: 'High',
      savingsAmount: 1155,
      complexity: 'Low',
      risk: 'Low',
      confidence: 'High',
      roiLabel: 'HIGH ROI',
      compositeScore: 4.7,
      migrationDays: 14,
      architectureNodes: [
        { id: 'eb', label: 'EventBridge', sublabel: 'Scheduler', icon: 'schedule', type: 'source' },
        { id: 'lambda', label: 'Lambda', sublabel: 'Node.js 22.x', icon: 'terminal', type: 'target' },
        { id: 'ses', label: 'SES', sublabel: 'Transactional', icon: 'mail', type: 'sink' },
      ],
      timeline: [
        { phase: 'Phase 1: Provision', detail: 'Create EventBridge rule + IAM role (2 days)' },
        { phase: 'Phase 2: Migrate', detail: 'Port email logic to Lambda handler (5 days)' },
        { phase: 'Phase 3: Cutover', detail: 'Disable EC2 worker, monitor 5 days (7 days)' },
      ],
      codePreview: `Resources:\n  EmailReminderFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      Handler: index.handler\n      Runtime: nodejs22.x\n      Events:\n        DailySchedule:\n          Type: ScheduleV2\n          Properties:\n            ScheduleExpression: "cron(0 8 * * ? *)"`,
    },
    {
      id: '2',
      rank: 2,
      name: 'Stripe Webhooks',
      icon: 'webhook',
      description: 'Stateless payment reconciliation',
      detail: `Webhook processing currently runs on a shared Express server. Isolating into Lambda + API Gateway eliminates shared-state bugs, adds automatic retries via SQS, and removes $380/mo of over-provisioned compute.`,
      awsTarget: 'API Gateway + Lambda + DynamoDB',
      awsServices: ['API Gateway', 'Lambda', 'SQS', 'DynamoDB'],
      fit: 91,
      savings: 'Medium',
      savingsAmount: 380,
      complexity: 'Low',
      risk: 'Low',
      confidence: 'High',
      roiLabel: 'HIGH ROI',
      compositeScore: 4.55,
      migrationDays: 10,
      architectureNodes: [
        { id: 'apigw', label: 'API Gateway', sublabel: 'POST /webhook', icon: 'hub', type: 'source' },
        { id: 'lambda', label: 'Lambda', sublabel: 'Node.js 22.x', icon: 'terminal', type: 'target' },
        { id: 'dynamo', label: 'DynamoDB', sublabel: 'Idempotency', icon: 'database', type: 'sink' },
      ],
      timeline: [
        { phase: 'Phase 1: Endpoint', detail: 'Create API Gateway + Lambda (2 days)' },
        { phase: 'Phase 2: Logic', detail: 'Port webhook handler + add SQS DLQ (4 days)' },
        { phase: 'Phase 3: Cutover', detail: 'Update Stripe webhook URL, monitor (4 days)' },
      ],
      codePreview: `Resources:\n  StripeWebhookFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      Handler: webhook.handler\n      Runtime: nodejs22.x\n      Events:\n        StripeWebhook:\n          Type: Api\n          Properties:\n            Path: /webhook/stripe\n            Method: POST`,
    },
    {
      id: '3',
      rank: 3,
      name: 'Monthly Reports',
      icon: 'description',
      description: 'Batch-process PDF generation',
      detail: `Monthly PDF generation currently blocks the main Express process for 15–20 minutes. Offloading to Lambda + S3 removes this bottleneck, stores output as presigned URLs, and delivers via SES.`,
      awsTarget: 'EventBridge + Lambda + S3',
      awsServices: ['EventBridge', 'Lambda', 'S3', 'SES'],
      fit: 86,
      savings: 'High',
      savingsAmount: 620,
      complexity: 'Medium',
      risk: 'Medium',
      confidence: 'Medium',
      roiLabel: 'HIGH ROI',
      compositeScore: 4.15,
      migrationDays: 21,
      architectureNodes: [
        { id: 'eb', label: 'EventBridge', sublabel: 'Monthly cron', icon: 'schedule', type: 'source' },
        { id: 'lambda', label: 'Lambda', sublabel: 'PDF generator', icon: 'terminal', type: 'target' },
        { id: 's3', label: 'S3', sublabel: 'Report storage', icon: 'cloud', type: 'sink' },
      ],
      timeline: [
        { phase: 'Phase 1: Storage', detail: 'Create S3 bucket + presigned URL logic (3 days)' },
        { phase: 'Phase 2: Migrate', detail: 'Port PDF generation to Lambda (10 days)' },
        { phase: 'Phase 3: Schedule', detail: 'EventBridge cron + SES delivery (8 days)' },
      ],
      codePreview: `Resources:\n  MonthlyReportFunction:\n    Type: AWS::Serverless::Function\n    Properties:\n      Handler: report.handler\n      Runtime: nodejs22.x\n      Timeout: 300\n      Events:\n        MonthlyTrigger:\n          Type: ScheduleV2\n          Properties:\n            ScheduleExpression: "cron(0 6 1 * ? *)"`,
    },
  ],
  doNotMigrate: [
    {
      name: 'Core Booking Database',
      reason: 'The PostgreSQL instance maintains strict consistency for slot locks. Migrating to DynamoDB at this stage poses a risk to booking integrity due to high-contention row locking requirements.',
      revisitWhen: 'Q3 — after booking engine is refactored to support optimistic locking',
    },
    {
      name: 'Real-time Trainer Notifications',
      reason: 'Bidirectional WebSocket connections require persistent state. Lambda is not the right model.',
      revisitWhen: 'When switching to unidirectional push-only notifications',
    },
  ],
  roadmap: [
    {
      week: 'Week 1–2',
      title: 'Infrastructure Setup',
      icon: 'cloud_queue',
      status: 'scheduled',
      tasks: [
        { id: '1.1', label: 'Provision IAM roles with least-privilege for Lambda→SES', done: false },
        { id: '1.2', label: 'Create EventBridge Scheduler rule for daily email trigger', done: false },
        { id: '1.3', label: 'Set up CloudWatch alarm: Lambda error rate > 1%', done: false },
      ],
    },
    {
      week: 'Week 3',
      title: 'Email Service Migration',
      icon: 'mail',
      status: 'pending',
      tasks: [
        { id: '2.1', label: 'Port email worker logic to Lambda handler', done: false },
        { id: '2.2', label: 'Deploy to staging, run shadow traffic comparison', done: false },
        { id: '2.3', label: 'Disable EC2 worker after 5 clean days', done: false },
      ],
    },
    {
      week: 'Week 4',
      title: 'Webhook Migration & Cutover',
      icon: 'rocket_launch',
      status: 'roadmap',
      tasks: [
        { id: '3.1', label: 'Create API Gateway endpoint + Lambda webhook handler', done: false },
        { id: '3.2', label: 'Update Stripe webhook URL to new endpoint', done: false },
        { id: '3.3', label: 'Monitor for 5 business days, decommission shared server process', done: false },
      ],
    },
  ],
  openQuestions: [
    { text: 'Is the email sending volume above SES sandbox limits? Verify SES production access.', blocking: true },
    { text: 'Does the Stripe webhook handler use shared in-memory state? Confirm before migrating.', blocking: true },
  ],
})

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
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  if (method === 'POST' && rawPath.endsWith('/api/scan')) {
    let payload = {}
    try { payload = JSON.parse(event.body ?? '{}') } catch { /* ignore */ }
    await new Promise(r => setTimeout(r, 80))
    return OK(makeScanResult(payload.productName, payload.stack), 'application/json')
  }

  if (method === 'POST' && rawPath.endsWith('/api/export')) {
    return OK({ url: 'mock-report.pdf', message: 'Report generated successfully' }, 'application/json')
  }

  // Strip /prod prefix if present (API Gateway stage)
  const filePath = rawPath.replace(/^\/prod/, '') || '/'

  const assetPath = join(PUBLIC_DIR, filePath)
  if (existsSync(assetPath) && !assetPath.endsWith('/')) {
    try {
      const ext = extname(assetPath)
      const contentType = MIME[ext] ?? 'application/octet-stream'
      const buf = readFileSync(assetPath)
      const binary = !TEXT_TYPES.has(contentType)
      return OK(buf, contentType, binary)
    } catch { /* fall through */ }
  }

  const indexPath = join(PUBLIC_DIR, 'index.html')
  return OK(readFileSync(indexPath, 'utf8'), 'text/html')
}
