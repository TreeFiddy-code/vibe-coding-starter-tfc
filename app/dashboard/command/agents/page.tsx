'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar } from '@/components/dashboard';
import {
  BotIcon,
  PlayIcon,
  PauseIcon,
  SettingsIcon,
  ActivityIcon,
  ZapIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MoreVerticalIcon,
  PlusIcon,
  CopyIcon,
  TrashIcon,
  EyeIcon,
  RefreshCwIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/shared/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { Switch } from '@/components/shared/ui/switch';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Busy' | 'Offline';
  currentTask: string;
  tasksToday: number;
  successRate: number;
  uptime: string;
  lastActive: string;
  description?: string;
  autoRestart?: boolean;
  maxRetries?: number;
  alertThreshold?: number;
}

const initialAgents: Agent[] = [
  {
    id: 'AGT-001',
    name: 'Inventory Monitor',
    type: 'Monitoring',
    status: 'Online',
    currentTask: 'Scanning Amazon inventory levels',
    tasksToday: 234,
    successRate: 99.2,
    uptime: '99.9%',
    lastActive: 'Now',
    description: 'Monitors inventory levels across all platforms',
    autoRestart: true,
    maxRetries: 3,
    alertThreshold: 10,
  },
  {
    id: 'AGT-002',
    name: 'Order Processor',
    type: 'Fulfillment',
    status: 'Busy',
    currentTask: 'Processing batch of 12 orders',
    tasksToday: 156,
    successRate: 97.8,
    uptime: '99.5%',
    lastActive: 'Now',
    description: 'Processes incoming orders automatically',
    autoRestart: true,
    maxRetries: 5,
    alertThreshold: 5,
  },
  {
    id: 'AGT-003',
    name: 'Price Optimizer',
    type: 'Optimization',
    status: 'Online',
    currentTask: 'Analyzing competitor prices',
    tasksToday: 89,
    successRate: 94.5,
    uptime: '98.2%',
    lastActive: 'Now',
    description: 'Optimizes product pricing based on market data',
    autoRestart: false,
    maxRetries: 2,
    alertThreshold: 15,
  },
  {
    id: 'AGT-004',
    name: 'Customer Support Bot',
    type: 'Support',
    status: 'Busy',
    currentTask: 'Handling 3 customer inquiries',
    tasksToday: 67,
    successRate: 92.1,
    uptime: '99.8%',
    lastActive: 'Now',
    description: 'Handles customer inquiries and support tickets',
    autoRestart: true,
    maxRetries: 3,
    alertThreshold: 20,
  },
  {
    id: 'AGT-005',
    name: 'Shipping Coordinator',
    type: 'Logistics',
    status: 'Online',
    currentTask: 'Idle - awaiting tasks',
    tasksToday: 45,
    successRate: 98.9,
    uptime: '99.7%',
    lastActive: '2 min ago',
    description: 'Coordinates shipping and logistics operations',
    autoRestart: true,
    maxRetries: 4,
    alertThreshold: 8,
  },
  {
    id: 'AGT-006',
    name: 'Review Analyzer',
    type: 'Analytics',
    status: 'Offline',
    currentTask: 'Scheduled maintenance',
    tasksToday: 0,
    successRate: 96.4,
    uptime: '95.2%',
    lastActive: '1 hour ago',
    description: 'Analyzes customer reviews for insights',
    autoRestart: false,
    maxRetries: 2,
    alertThreshold: 25,
  },
];

const recentActivity = [
  { agent: 'Order Processor', action: 'Processed order ORD-8421', time: '2 min ago', status: 'success' },
  { agent: 'Inventory Monitor', action: 'Low stock alert: SKU-PRD-042', time: '5 min ago', status: 'warning' },
  { agent: 'Price Optimizer', action: 'Updated 23 product prices', time: '12 min ago', status: 'success' },
  { agent: 'Customer Support Bot', action: 'Escalated ticket #4521', time: '18 min ago', status: 'info' },
  { agent: 'Shipping Coordinator', action: 'Generated 15 shipping labels', time: '25 min ago', status: 'success' },
];

const agentTypes = [
  'Monitoring',
  'Fulfillment',
  'Optimization',
  'Support',
  'Logistics',
  'Analytics',
];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Online: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
  Busy: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  Offline: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [confirmAction, setConfirmAction] = useState<'pause' | 'start' | 'restart' | null>(null);

  // Form state for new agent
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: '',
    description: '',
    autoRestart: true,
    maxRetries: 3,
    alertThreshold: 10,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    autoRestart: true,
    maxRetries: 3,
    alertThreshold: 10,
  });

  const agentStats = {
    totalAgents: agents.length,
    online: agents.filter(a => a.status === 'Online').length,
    busy: agents.filter(a => a.status === 'Busy').length,
    offline: agents.filter(a => a.status === 'Offline').length,
    tasksCompleted: agents.reduce((sum, a) => sum + a.tasksToday, 0),
    avgResponseTime: '1.2s',
  };

  const handleDeployAgent = () => {
    if (!newAgent.name || !newAgent.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newId = `AGT-${String(agents.length + 1).padStart(3, '0')}`;
    const agent: Agent = {
      id: newId,
      name: newAgent.name,
      type: newAgent.type,
      status: 'Online',
      currentTask: 'Initializing...',
      tasksToday: 0,
      successRate: 100,
      uptime: '100%',
      lastActive: 'Now',
      description: newAgent.description,
      autoRestart: newAgent.autoRestart,
      maxRetries: newAgent.maxRetries,
      alertThreshold: newAgent.alertThreshold,
    };

    setAgents([...agents, agent]);
    setDeployModalOpen(false);
    setNewAgent({
      name: '',
      type: '',
      description: '',
      autoRestart: true,
      maxRetries: 3,
      alertThreshold: 10,
    });
    toast.success(`Agent "${agent.name}" deployed successfully`);
  };

  const handlePauseStart = (agent: Agent, action: 'pause' | 'start') => {
    setSelectedAgent(agent);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const confirmPauseStart = () => {
    if (!selectedAgent || !confirmAction) return;

    setAgents(agents.map(a => {
      if (a.id === selectedAgent.id) {
        return {
          ...a,
          status: confirmAction === 'pause' ? 'Offline' as const : 'Online' as const,
          currentTask: confirmAction === 'pause' ? 'Paused by user' : 'Initializing...',
          lastActive: confirmAction === 'pause' ? 'Now' : 'Now',
        };
      }
      return a;
    }));

    toast.success(
      confirmAction === 'pause'
        ? `Agent "${selectedAgent.name}" paused`
        : `Agent "${selectedAgent.name}" started`
    );
    setConfirmDialogOpen(false);
    setSelectedAgent(null);
    setConfirmAction(null);
  };

  const handleOpenSettings = (agent: Agent) => {
    setSelectedAgent(agent);
    setSettingsForm({
      autoRestart: agent.autoRestart ?? true,
      maxRetries: agent.maxRetries ?? 3,
      alertThreshold: agent.alertThreshold ?? 10,
    });
    setSettingsModalOpen(true);
  };

  const handleSaveSettings = () => {
    if (!selectedAgent) return;

    setAgents(agents.map(a => {
      if (a.id === selectedAgent.id) {
        return {
          ...a,
          autoRestart: settingsForm.autoRestart,
          maxRetries: settingsForm.maxRetries,
          alertThreshold: settingsForm.alertThreshold,
        };
      }
      return a;
    }));

    toast.success(`Settings saved for "${selectedAgent.name}"`);
    setSettingsModalOpen(false);
    setSelectedAgent(null);
  };

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setDetailsModalOpen(true);
  };

  const handleCloneAgent = (agent: Agent) => {
    const newId = `AGT-${String(agents.length + 1).padStart(3, '0')}`;
    const clonedAgent: Agent = {
      ...agent,
      id: newId,
      name: `${agent.name} (Copy)`,
      status: 'Offline',
      currentTask: 'Not started',
      tasksToday: 0,
      lastActive: 'Never',
    };

    setAgents([...agents, clonedAgent]);
    toast.success(`Agent "${agent.name}" cloned successfully`);
  };

  const handleRestartAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setConfirmAction('restart');
    setConfirmDialogOpen(true);
  };

  const confirmRestart = () => {
    if (!selectedAgent) return;

    setAgents(agents.map(a => {
      if (a.id === selectedAgent.id) {
        return {
          ...a,
          status: 'Online' as const,
          currentTask: 'Restarting...',
          lastActive: 'Now',
        };
      }
      return a;
    }));

    toast.success(`Agent "${selectedAgent.name}" is restarting`);
    setConfirmDialogOpen(false);
    setSelectedAgent(null);
    setConfirmAction(null);
  };

  const handleDeleteAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedAgent) return;

    setAgents(agents.filter(a => a.id !== selectedAgent.id));
    toast.success(`Agent "${selectedAgent.name}" deleted`);
    setDeleteDialogOpen(false);
    setSelectedAgent(null);
  };

  return (
    <DashboardLayout
      title="AI Agents"
      subtitle="Monitor and manage your autonomous AI agents and their tasks."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-2">
              <BotIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{agentStats.totalAgents}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Agents</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{agentStats.online}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Online</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
              <ActivityIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{agentStats.busy}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Busy</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
              <PauseIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{agentStats.offline}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Offline</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
              <ZapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{agentStats.tasksCompleted}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tasks Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
              <ClockIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{agentStats.avgResponseTime}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Response</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Agents List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Active Agents"
              action={
                <Button variant="primary" size="sm" onClick={() => setDeployModalOpen(true)}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Deploy Agent
                </Button>
              }
            />
            <div className="p-4 space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <BotIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-gray-100">{agent.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[agent.status].bg} ${statusColors[agent.status].text}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusColors[agent.status].dot} mr-1`}></span>
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{agent.type} · {agent.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {agent.status !== 'Offline' ? (
                        <button
                          onClick={() => handlePauseStart(agent, 'pause')}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                          title="Pause Agent"
                        >
                          <PauseIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePauseStart(agent, 'start')}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-green-600 dark:text-green-400"
                          title="Start Agent"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenSettings(agent)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        title="Agent Settings"
                      >
                        <SettingsIcon className="w-4 h-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            <MoreVerticalIcon className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(agent)}>
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloneAgent(agent)}>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            Clone Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRestartAgent(agent)}>
                            <RefreshCwIcon className="w-4 h-4 mr-2" />
                            Restart
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteAgent(agent)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span className="font-medium">Current:</span> {agent.currentTask}
                  </p>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tasks Today</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{agent.tasksToday}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Success Rate</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{agent.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Uptime</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{agent.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Last Active</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{agent.lastActive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader title="Recent Activity" action={<Chip variant="info" size="sm">Live</Chip>} />
            <div className="p-4 space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.status === 'success'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : activity.status === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}
                  >
                    {activity.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {activity.status === 'warning' && <AlertTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    {activity.status === 'info' && <ActivityIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-gray-100 text-sm">{activity.agent}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{activity.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Deploy Agent Modal */}
      <Dialog open={deployModalOpen} onOpenChange={setDeployModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Deploy New Agent</DialogTitle>
            <DialogDescription>
              Configure and deploy a new AI agent to automate your e-commerce operations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Inventory Monitor"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Agent Type *</Label>
              <Select
                value={newAgent.type}
                onValueChange={(value) => setNewAgent({ ...newAgent, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this agent will do..."
                value={newAgent.description}
                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoRestart">Auto Restart</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically restart agent on failure
                </p>
              </div>
              <Switch
                id="autoRestart"
                checked={newAgent.autoRestart}
                onCheckedChange={(checked) => setNewAgent({ ...newAgent, autoRestart: checked })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxRetries">Max Retries</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  min={1}
                  max={10}
                  value={newAgent.maxRetries}
                  onChange={(e) => setNewAgent({ ...newAgent, maxRetries: parseInt(e.target.value) || 3 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  min={1}
                  max={100}
                  value={newAgent.alertThreshold}
                  onChange={(e) => setNewAgent({ ...newAgent, alertThreshold: parseInt(e.target.value) || 10 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeployModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeployAgent}>
              Deploy Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agent Settings</DialogTitle>
            <DialogDescription>
              Configure settings for {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="settings-autoRestart">Auto Restart</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically restart on failure
                </p>
              </div>
              <Switch
                id="settings-autoRestart"
                checked={settingsForm.autoRestart}
                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, autoRestart: checked })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="settings-maxRetries">Max Retries</Label>
              <Input
                id="settings-maxRetries"
                type="number"
                min={1}
                max={10}
                value={settingsForm.maxRetries}
                onChange={(e) => setSettingsForm({ ...settingsForm, maxRetries: parseInt(e.target.value) || 3 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="settings-alertThreshold">Alert Threshold (%)</Label>
              <Input
                id="settings-alertThreshold"
                type="number"
                min={1}
                max={100}
                value={settingsForm.alertThreshold}
                onChange={(e) => setSettingsForm({ ...settingsForm, alertThreshold: parseInt(e.target.value) || 10 })}
              />
              <p className="text-sm text-muted-foreground">
                Trigger alert when success rate drops below this threshold
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <BotIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedAgent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAgent.type} · {selectedAgent.id}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedAgent.status].bg} ${statusColors[selectedAgent.status].text}`}>
                  {selectedAgent.status}
                </span>
              </div>

              {selectedAgent.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedAgent.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground">Current Task</p>
                  <p className="font-medium mt-1">{selectedAgent.currentTask}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground">Last Active</p>
                  <p className="font-medium mt-1">{selectedAgent.lastActive}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-2xl font-bold">{selectedAgent.tasksToday}</p>
                  <p className="text-sm text-muted-foreground">Tasks Today</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-2xl font-bold">{selectedAgent.successRate}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-2xl font-bold">{selectedAgent.uptime}</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Auto Restart</p>
                  <p className="font-medium">{selectedAgent.autoRestart ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Retries</p>
                  <p className="font-medium">{selectedAgent.maxRetries}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alert Threshold</p>
                  <p className="font-medium">{selectedAgent.alertThreshold}%</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Pause/Start/Restart Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'pause' && 'Pause Agent?'}
              {confirmAction === 'start' && 'Start Agent?'}
              {confirmAction === 'restart' && 'Restart Agent?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'pause' && `Are you sure you want to pause "${selectedAgent?.name}"? This will stop all current tasks.`}
              {confirmAction === 'start' && `Are you sure you want to start "${selectedAgent?.name}"? The agent will begin processing tasks.`}
              {confirmAction === 'restart' && `Are you sure you want to restart "${selectedAgent?.name}"? Current tasks will be interrupted.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction === 'restart' ? confirmRestart : confirmPauseStart}>
              {confirmAction === 'pause' && 'Pause'}
              {confirmAction === 'start' && 'Start'}
              {confirmAction === 'restart' && 'Restart'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedAgent?.name}&rdquo;? This action cannot be undone and all agent data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
