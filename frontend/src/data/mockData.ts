export const mockAnalysis = {
  id: '1',
  productName: 'Gym Booking SaaS',
  score: 84,
  scoreDelta: '+12pts Since June',
  estimatedAnnualSavings: 42500,
  estimatedMonthlySavings: 3541,
  complexityTier: 'Medium-Low',
  confidence: 94,
  executiveSummary:
    'The Gym Booking SaaS infrastructure shows significant potential for operational cost reduction through asynchronous offloading. Migration of non-core services like email triggers and reporting will yield high-ROI wins with minimal risk. Core relational databases should remain stateful to preserve strict transactional consistency for booking slots.',
  stack: ['React (Frontend)', 'Express (Backend)', 'PostgreSQL (Database)', 'Stripe (Payments)'],
  opportunities: [
    {
      id: '1',
      rank: 1,
      name: 'Email Reminders',
      icon: 'mail',
      description: 'Event-driven triggers via AWS Lambda',
      detail:
        'Current overhead for EC2-based mail workers is $1,200/mo with 84% idle time. Shifting to Lambda + SES triggers reduces costs to ~$45/mo while increasing delivery reliability during peak booking hours.',
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
      codePreview: `Resources:
  EmailReminderFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs22.x
      Events:
        DailySchedule:
          Type: ScheduleV2
          Properties:
            ScheduleExpression: "cron(0 8 * * ? *)"`,
    },
    {
      id: '2',
      rank: 2,
      name: 'Stripe Webhooks',
      icon: 'webhook',
      description: 'Stateless payment reconciliation',
      detail:
        'Webhook processing currently runs on a shared Express server. Isolating into Lambda + API Gateway eliminates shared-state bugs, adds automatic retries via SQS, and removes $380/mo of over-provisioned compute.',
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
      codePreview: `Resources:
  StripeWebhookFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: webhook.handler
      Runtime: nodejs22.x
      Events:
        StripeWebhook:
          Type: Api
          Properties:
            Path: /webhook/stripe
            Method: POST`,
    },
    {
      id: '3',
      rank: 3,
      name: 'Monthly Reports',
      icon: 'description',
      description: 'Batch-process PDF generation',
      detail:
        'Monthly PDF generation currently blocks the main Express process for 15–20 minutes. Offloading to Lambda + S3 removes this bottleneck, stores output as presigned URLs, and delivers via SES.',
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
      codePreview: `Resources:
  MonthlyReportFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: report.handler
      Runtime: nodejs22.x
      Timeout: 300
      Events:
        MonthlyTrigger:
          Type: ScheduleV2
          Properties:
            ScheduleExpression: "cron(0 6 1 * ? *)"`,
    },
  ],
  doNotMigrate: [
    {
      name: 'Core Booking Database',
      reason:
        'The PostgreSQL instance maintains strict consistency for slot locks. Migrating to DynamoDB or Aurora Serverless at this stage poses a risk to booking integrity due to high-contention row locking requirements.',
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
      color: 'bg-primary',
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
      color: 'bg-secondary-container',
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
      color: 'bg-on-tertiary-container',
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
}

export type Analysis = typeof mockAnalysis
export type Opportunity = typeof mockAnalysis.opportunities[0]
