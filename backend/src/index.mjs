import { readFileSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, 'public')

const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' })
const MODEL_ID = 'us.anthropic.claude-haiku-4-5-20251001-v1:0'

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

function buildPrompt(productName, stack, painPoints) {
  const id = Date.now().toString()
  return `You are an AWS serverless migration consultant. Analyze the backend workloads and return JSON only — no markdown, no explanation.

Product: ${productName}
Stack: ${stack.join(', ')}
Pain Points: ${painPoints || 'Not specified'}

ANALYSIS RULES:
- Opportunities = specific backend processes to migrate (batch jobs, async tasks, webhooks, APIs, schedulers). NEVER suggest migrating a frontend framework (React, Vue, Angular, Next.js) — those are already serverless-compatible client assets.
- doNotMigrate = backend services with high statefulness, tight latency requirements, or complex data dependencies (e.g. real-time websocket servers, large relational databases with complex transactions, monolithic session stores). NEVER list frontend frameworks or static assets here — they are irrelevant to this analysis.
- estimatedAnnualSavings = realistic EC2/server cost reduction. Base estimate: $40k-$120k for small stacks (1-3 backend services), $120k-$400k for medium stacks (4-6 services), scale by complexity. Keep it grounded — do not inflate.
- score = 0-100 reflecting how much of the stack is serverless-ready (high score = many stateless backend workloads present).
- All string values max 120 chars. Exactly 3 opportunities, 2 doNotMigrate, 3 roadmap weeks.

{"id":"${id}","productName":"${productName}","score":<0-100>,"scoreDelta":"<+Npts vs industry avg>","estimatedAnnualSavings":<USD>,"estimatedMonthlySavings":<USD>,"complexityTier":"<Low|Medium-Low|Medium|Medium-High|High>","confidence":<0-100>,"executiveSummary":"<2 sentences on backend migration potential>","stack":${JSON.stringify(stack)},"opportunities":[{"id":"1","rank":1,"name":"<backend workload name>","icon":"<mail|webhook|description|storage|notifications|schedule|cloud|sync|bolt|timer>","description":"<1 sentence on what backend process this replaces>","detail":"<2 sentences with specific $ savings and AWS services>","awsTarget":"<Lambda + SQS + S3 style>","awsServices":["<svc>"],"fit":<0-100>,"savings":"<High|Medium|Low>","savingsAmount":<USD/mo>,"complexity":"<Low|Medium|High>","risk":"<Low|Medium|High>","confidence":"<High|Medium|Low>","roiLabel":"<HIGH ROI|MEDIUM ROI|LOW ROI>","compositeScore":<1.0-5.0>,"migrationDays":<N>,"architectureNodes":[{"id":"src","label":"<source system>","sublabel":"<current tech>","icon":"<symbol>","type":"source"},{"id":"fn","label":"Lambda","sublabel":"Node.js 22.x","icon":"terminal","type":"target"},{"id":"sink","label":"<downstream>","sublabel":"<AWS service>","icon":"<symbol>","type":"sink"}],"timeline":[{"phase":"Phase 1: <name>","detail":"<task> (N days)"},{"phase":"Phase 2: <name>","detail":"<task> (N days)"}],"codePreview":"Resources:\\n  Fn:\\n    Type: AWS::Serverless::Function\\n    Properties:\\n      Handler: index.handler\\n      Runtime: nodejs22.x"}],"doNotMigrate":[{"name":"<stateful backend component>","reason":"<technical reason it is not serverless-ready>","revisitWhen":"<condition or timeframe>"}],"roadmap":[{"week":"Week 1-2","title":"<title>","icon":"cloud_queue","status":"scheduled","tasks":[{"id":"1.1","label":"<task>","done":false},{"id":"1.2","label":"<task>","done":false}]},{"week":"Week 3","title":"<title>","icon":"bolt","status":"pending","tasks":[{"id":"2.1","label":"<task>","done":false},{"id":"2.2","label":"<task>","done":false}]},{"week":"Week 4","title":"<title>","icon":"rocket_launch","status":"roadmap","tasks":[{"id":"3.1","label":"<task>","done":false},{"id":"3.2","label":"<task>","done":false}]}],"openQuestions":[{"text":"<blocking technical question>","blocking":true},{"text":"<risk or dependency question>","blocking":false}]}

Fill all <placeholders> with real values for this product. Return only the completed JSON.`
}

const OK = (body, contentType = 'text/html', binary = false) => ({
  statusCode: 200,
  headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' },
  body: binary ? body.toString('base64') : (typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf8') : JSON.stringify(body)),
  isBase64Encoded: binary,
})

const ERR = (status, message) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify({ error: message }),
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

    const { productName = 'Unknown Product', stack = [], painPoints = '' } = payload
    const prompt = buildPrompt(productName, stack, painPoints)

    try {
      const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 8192,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
        }),
      })

      const raw = await bedrock.send(command)
      const body = JSON.parse(new TextDecoder().decode(raw.body))
      let text = body.content[0].text.trim()
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }
      const result = JSON.parse(text)
      return OK(result, 'application/json')
    } catch (err) {
      console.error('Bedrock error:', err)
      return ERR(500, `Analysis failed: ${err.message}`)
    }
  }

  if (method === 'POST' && rawPath.endsWith('/api/export')) {
    return OK({ url: 'report.pdf', message: 'Report generated successfully' }, 'application/json')
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
