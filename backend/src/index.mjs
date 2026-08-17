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
  return `You are an AWS serverless migration expert. Analyze this product and return a migration assessment JSON.

Product: ${productName}
Stack: ${stack.join(', ')}
Pain Points: ${painPoints || 'Not specified'}

Return ONLY a valid JSON object — no markdown, no code fences, no explanation. Use this exact schema:

{
  "id": "${id}",
  "productName": "${productName}",
  "score": <integer 0-100 serverless-readiness score>,
  "scoreDelta": <string like "+8pts since last scan">,
  "estimatedAnnualSavings": <total annual USD savings integer>,
  "estimatedMonthlySavings": <total monthly USD savings integer>,
  "complexityTier": <"Low"|"Medium-Low"|"Medium"|"Medium-High"|"High">,
  "confidence": <integer 0-100>,
  "executiveSummary": <2-3 sentence executive summary specific to this product>,
  "stack": ${JSON.stringify(stack)},
  "opportunities": [
    {
      "id": "1",
      "rank": 1,
      "name": <workflow name>,
      "icon": <one of: mail|webhook|description|storage|notifications|terminal|hub|schedule|cloud|sync|bolt|settings_suggest|timer>,
      "description": <one sentence>,
      "detail": <2-3 sentences with specific cost and time estimates>,
      "awsTarget": <"ServiceA + ServiceB + ServiceC">,
      "awsServices": [<array of AWS service name strings>],
      "fit": <integer 0-100>,
      "savings": <"High"|"Medium"|"Low">,
      "savingsAmount": <monthly USD integer>,
      "complexity": <"Low"|"Medium"|"High">,
      "risk": <"Low"|"Medium"|"High">,
      "confidence": <"High"|"Medium"|"Low">,
      "roiLabel": <"HIGH ROI"|"MEDIUM ROI"|"LOW ROI">,
      "compositeScore": <float 1.0-5.0>,
      "migrationDays": <integer>,
      "architectureNodes": [
        {"id": "src", "label": <source service>, "sublabel": <short detail>, "icon": <material-symbols name>, "type": "source"},
        {"id": "fn", "label": "Lambda", "sublabel": "Node.js 22.x", "icon": "terminal", "type": "target"},
        {"id": "sink", "label": <AWS target service>, "sublabel": <short detail>, "icon": <material-symbols name>, "type": "sink"}
      ],
      "timeline": [
        {"phase": "Phase 1: <name>", "detail": "<description> (N days)"},
        {"phase": "Phase 2: <name>", "detail": "<description> (N days)"},
        {"phase": "Phase 3: <name>", "detail": "<description> (N days)"}
      ],
      "codePreview": <short AWS SAM YAML snippet, max 8 lines, use \\n for newlines>
    }
  ],
  "doNotMigrate": [
    {"name": <component name>, "reason": <why not serverless now>, "revisitWhen": <when to reconsider>}
  ],
  "roadmap": [
    {
      "week": "Week 1-2",
      "title": <phase title>,
      "icon": <material-symbols name like cloud_queue|mail|rocket_launch|settings>,
      "status": "scheduled",
      "tasks": [
        {"id": "1.1", "label": <task description>, "done": false},
        {"id": "1.2", "label": <task description>, "done": false},
        {"id": "1.3", "label": <task description>, "done": false}
      ]
    },
    {
      "week": "Week 3",
      "title": <phase title>,
      "icon": <material-symbols name>,
      "status": "pending",
      "tasks": [
        {"id": "2.1", "label": <task description>, "done": false},
        {"id": "2.2", "label": <task description>, "done": false},
        {"id": "2.3", "label": <task description>, "done": false}
      ]
    },
    {
      "week": "Week 4",
      "title": <phase title>,
      "icon": <material-symbols name>,
      "status": "roadmap",
      "tasks": [
        {"id": "3.1", "label": <task description>, "done": false},
        {"id": "3.2", "label": <task description>, "done": false},
        {"id": "3.3", "label": <task description>, "done": false}
      ]
    }
  ],
  "openQuestions": [
    {"text": <question about a migration blocker or risk>, "blocking": true},
    {"text": <another question>, "blocking": false}
  ]
}

Generate 2-4 opportunities ranked by ROI. Provide 1-3 do-not-migrate items. Use realistic USD amounts based on the stack. Respond with ONLY the JSON object.`
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
