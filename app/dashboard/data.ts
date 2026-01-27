// Dashboard sample data for OmniCart_AI

export const userData = {
  name: 'Avery Chen',
  initials: 'AC',
  role: 'Ops Manager',
  timezone: 'PST (UTC-8)',
  workspaceId: 'WS-7842',
  lastLogin: '08:42 AM',
  lastSync: '30 sec ago',
  description:
    'Managing multi-channel operations across Amazon, Shopify, eBay, and social commerce. AI agents handle fulfillment automation while you maintain oversight and control.',
};

export const workspaceData = {
  name: "Avery's Ops",
  platformCount: 4,
  agentsStatus: 'online',
};

export const quickActions = [
  {
    id: 'connect',
    icon: 'link',
    title: 'Connect Platform',
    description: 'Link a new marketplace or sales channel',
  },
  {
    id: 'deploy',
    icon: 'bot',
    title: 'Deploy Agent Pods',
    description: 'Spin up AI automation for fulfillment tasks',
  },
  {
    id: 'rules',
    icon: 'shield',
    title: 'Update Rules',
    description: 'Modify guardrails and escalation triggers',
  },
];

export const agentActivity = {
  online: 12,
  busy: 8,
  queued: 24,
  escalations: 3,
  note: 'Agent pods are operating within normal parameters. 3 escalations require human review.',
};

export const platformPerformance = [
  { name: 'Amazon', status: 'Agents stable', percentage: 94 },
  { name: 'Shopify', status: 'Sync healthy', percentage: 88 },
  { name: 'eBay', status: 'Rate limits', percentage: 72 },
  { name: 'Social', status: 'New channel', percentage: 45 },
];

export const businessOverview = {
  revenue: '$124,582',
  orders: 1247,
  onTimeRate: '96.2%',
  exceptions: 12,
};

export type AutomationMode = 'Autonomous' | 'Supervised';

export const automationControl: {
  mode: AutomationMode;
  successRate: number;
  escalationRate: number;
  exceptionRate: number;
  coveragePercent: number;
  notes: string;
} = {
  mode: 'Supervised',
  successRate: 94.2,
  escalationRate: 2.8,
  exceptionRate: 3.0,
  coveragePercent: 78,
  notes:
    'Automation coverage at 78%. Human approval required for orders over $500, new suppliers, and shipping exceptions. Escalations are routed to your dashboard within 5 minutes.',
};

export const integrationHealth = [
  { platform: 'Amazon', status: 'healthy' as const },
  { platform: 'Shopify', status: 'healthy' as const },
  { platform: 'eBay', status: 'degraded' as const },
  { platform: 'Social', status: 'healthy' as const },
];

export const announcements = [
  { id: 1, title: 'New eBay rate limit policy in effect', time: '18 min ago' },
  { id: 2, title: 'Shopify API v2024-01 migration complete', time: 'Today' },
  { id: 3, title: 'Holiday surge automation rules activated', time: 'This week' },
];

export type OperationStatus =
  | 'Running'
  | 'Queued'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Exception';

export interface Operation {
  id: string;
  channel: string;
  channelColor: string;
  title: string;
  status: OperationStatus;
  sla: string;
  trend: number[];
}

export const currentOperations: Operation[] = [
  {
    id: 'ORD-8421',
    channel: 'Amazon',
    channelColor: 'bg-orange-500',
    title: 'Multi-item fulfillment',
    status: 'Running',
    sla: '2h 14m',
    trend: [3, 5, 2, 8, 4, 6, 7],
  },
  {
    id: 'ORD-8420',
    channel: 'Shopify',
    channelColor: 'bg-green-500',
    title: 'Express shipping request',
    status: 'Processing',
    sla: '45m',
    trend: [2, 4, 6, 3, 5, 4, 6],
  },
  {
    id: 'ORD-8419',
    channel: 'eBay',
    channelColor: 'bg-blue-500',
    title: 'International order',
    status: 'Queued',
    sla: '4h 30m',
    trend: [1, 2, 1, 3, 2, 4, 3],
  },
  {
    id: 'ORD-8418',
    channel: 'Amazon',
    channelColor: 'bg-orange-500',
    title: 'Return processing',
    status: 'Exception',
    sla: '1h 05m',
    trend: [5, 3, 6, 2, 7, 4, 8],
  },
  {
    id: 'ORD-8417',
    channel: 'Social',
    channelColor: 'bg-pink-500',
    title: 'Influencer order bundle',
    status: 'Shipped',
    sla: '—',
    trend: [4, 6, 5, 7, 6, 8, 9],
  },
  {
    id: 'ORD-8416',
    channel: 'Shopify',
    channelColor: 'bg-green-500',
    title: 'Subscription renewal',
    status: 'Delivered',
    sla: '—',
    trend: [6, 7, 8, 7, 9, 8, 10],
  },
];

export const sidebarNavigation = {
  platformHub: ['Amazon', 'Shopify', 'eBay', 'Social'],
  management: ['Product Management', 'Supplier Management', 'Order Management'],
  commandCenter: ['Agents', 'Workflows', 'Rules'],
  support: ['Customer Service', 'Escalations'],
  integrations: ['Integration Portal', 'Webhooks', 'API Keys', 'Health'],
};
