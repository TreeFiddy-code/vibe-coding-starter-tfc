'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
import {
  GitBranchIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  ClockIcon,
  CheckCircleIcon,
  ZapIcon,
  ArrowRightIcon,
  EyeIcon,
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
import { toast } from 'sonner';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Paused' | 'Draft';
  trigger: string;
  steps: number;
  executions: number;
  successRate: number;
  avgDuration: string;
  lastRun: string;
}

const initialWorkflows: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Order Fulfillment Pipeline',
    description: 'Automated order processing from receipt to shipping',
    status: 'Active',
    trigger: 'New Order',
    steps: 6,
    executions: 234,
    successRate: 98.2,
    avgDuration: '4.2 min',
    lastRun: '2 min ago',
  },
  {
    id: 'WF-002',
    name: 'Inventory Restock Alert',
    description: 'Monitor stock levels and create purchase orders',
    status: 'Active',
    trigger: 'Low Stock',
    steps: 4,
    executions: 89,
    successRate: 99.1,
    avgDuration: '1.8 min',
    lastRun: '15 min ago',
  },
  {
    id: 'WF-003',
    name: 'Price Optimization',
    description: 'Dynamic pricing based on market conditions',
    status: 'Active',
    trigger: 'Schedule (hourly)',
    steps: 5,
    executions: 24,
    successRate: 95.8,
    avgDuration: '8.5 min',
    lastRun: '32 min ago',
  },
  {
    id: 'WF-004',
    name: 'Customer Review Response',
    description: 'Automated response to customer reviews',
    status: 'Paused',
    trigger: 'New Review',
    steps: 3,
    executions: 45,
    successRate: 91.2,
    avgDuration: '0.8 min',
    lastRun: '2 hours ago',
  },
  {
    id: 'WF-005',
    name: 'Multi-Channel Sync',
    description: 'Sync inventory and prices across all platforms',
    status: 'Active',
    trigger: 'Schedule (15 min)',
    steps: 8,
    executions: 96,
    successRate: 94.7,
    avgDuration: '3.2 min',
    lastRun: '8 min ago',
  },
  {
    id: 'WF-006',
    name: 'Return Processing',
    description: 'Handle return requests and refunds',
    status: 'Draft',
    trigger: 'Return Request',
    steps: 5,
    executions: 0,
    successRate: 0,
    avgDuration: '-',
    lastRun: 'Never',
  },
];

const recentExecutions = [
  { workflow: 'Order Fulfillment Pipeline', order: 'ORD-8421', status: 'Completed', duration: '3.8 min', time: '2 min ago' },
  { workflow: 'Multi-Channel Sync', status: 'Completed', duration: '2.9 min', time: '8 min ago' },
  { workflow: 'Inventory Restock Alert', alert: 'SKU-PRD-042', status: 'Completed', duration: '1.5 min', time: '15 min ago' },
  { workflow: 'Price Optimization', status: 'Running', duration: '5.2 min', time: '32 min ago' },
  { workflow: 'Order Fulfillment Pipeline', order: 'ORD-8420', status: 'Completed', duration: '4.1 min', time: '45 min ago' },
];

const triggerOptions = [
  'New Order',
  'Low Stock',
  'New Review',
  'Return Request',
  'Price Change',
  'Schedule (15 min)',
  'Schedule (hourly)',
  'Schedule (daily)',
  'Manual Trigger',
  'Webhook',
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  Paused: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  Draft: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [confirmAction, setConfirmAction] = useState<'pause' | 'start' | null>(null);

  // Form state
  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    description: '',
    trigger: '',
    steps: 1,
  });

  const workflowStats = {
    totalWorkflows: workflows.length,
    active: workflows.filter(w => w.status === 'Active').length,
    paused: workflows.filter(w => w.status === 'Paused').length,
    draft: workflows.filter(w => w.status === 'Draft').length,
    executionsToday: workflows.reduce((sum, w) => sum + w.executions, 0),
    successRate: workflows.filter(w => w.successRate > 0).length > 0
      ? (workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.filter(w => w.successRate > 0).length).toFixed(1)
      : 0,
  };

  const handleCreateWorkflow = () => {
    if (!workflowForm.name || !workflowForm.trigger) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newId = `WF-${String(workflows.length + 1).padStart(3, '0')}`;
    const newWorkflow: Workflow = {
      id: newId,
      name: workflowForm.name,
      description: workflowForm.description,
      status: 'Draft',
      trigger: workflowForm.trigger,
      steps: workflowForm.steps,
      executions: 0,
      successRate: 0,
      avgDuration: '-',
      lastRun: 'Never',
    };

    setWorkflows([...workflows, newWorkflow]);
    setCreateModalOpen(false);
    setWorkflowForm({ name: '', description: '', trigger: '', steps: 1 });
    toast.success(`Workflow "${newWorkflow.name}" created as draft`);
  };

  const handleOpenEdit = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setWorkflowForm({
      name: workflow.name,
      description: workflow.description,
      trigger: workflow.trigger,
      steps: workflow.steps,
    });
    setEditModalOpen(true);
  };

  const handleUpdateWorkflow = () => {
    if (!selectedWorkflow || !workflowForm.name || !workflowForm.trigger) {
      toast.error('Please fill in all required fields');
      return;
    }

    setWorkflows(workflows.map(w => {
      if (w.id === selectedWorkflow.id) {
        return {
          ...w,
          name: workflowForm.name,
          description: workflowForm.description,
          trigger: workflowForm.trigger,
          steps: workflowForm.steps,
        };
      }
      return w;
    }));

    setEditModalOpen(false);
    setSelectedWorkflow(null);
    setWorkflowForm({ name: '', description: '', trigger: '', steps: 1 });
    toast.success(`Workflow "${workflowForm.name}" updated successfully`);
  };

  const handlePauseStart = (workflow: Workflow, action: 'pause' | 'start') => {
    setSelectedWorkflow(workflow);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const confirmPauseStart = () => {
    if (!selectedWorkflow || !confirmAction) return;

    setWorkflows(workflows.map(w => {
      if (w.id === selectedWorkflow.id) {
        return {
          ...w,
          status: confirmAction === 'pause' ? 'Paused' as const : 'Active' as const,
        };
      }
      return w;
    }));

    toast.success(
      confirmAction === 'pause'
        ? `Workflow "${selectedWorkflow.name}" paused`
        : `Workflow "${selectedWorkflow.name}" activated`
    );
    setConfirmDialogOpen(false);
    setSelectedWorkflow(null);
    setConfirmAction(null);
  };

  const handleCopyWorkflow = (workflow: Workflow) => {
    const newId = `WF-${String(workflows.length + 1).padStart(3, '0')}`;
    const copiedWorkflow: Workflow = {
      ...workflow,
      id: newId,
      name: `${workflow.name} (Copy)`,
      status: 'Draft',
      executions: 0,
      successRate: 0,
      avgDuration: '-',
      lastRun: 'Never',
    };

    setWorkflows([...workflows, copiedWorkflow]);
    toast.success(`Workflow "${workflow.name}" duplicated`);
  };

  const handleViewDetails = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setDetailsModalOpen(true);
  };

  const handleDeleteWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedWorkflow) return;

    setWorkflows(workflows.filter(w => w.id !== selectedWorkflow.id));
    toast.success(`Workflow "${selectedWorkflow.name}" deleted`);
    setDeleteDialogOpen(false);
    setSelectedWorkflow(null);
  };

  return (
    <DashboardLayout
      title="Workflows"
      subtitle="Create and manage automated workflows for your e-commerce operations."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{workflowStats.totalWorkflows}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Workflows</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{workflowStats.active}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{workflowStats.paused}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Paused</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{workflowStats.draft}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Draft</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{workflowStats.executionsToday}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Executions Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{workflowStats.successRate}%</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Success Rate</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Workflows"
              action={
                <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  New Workflow
                </Button>
              }
            />
            <div className="p-4 space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <GitBranchIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-gray-100">{workflow.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[workflow.status].bg} ${statusColors[workflow.status].text}`}>
                            {workflow.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {workflow.status === 'Active' && (
                        <button
                          onClick={() => handlePauseStart(workflow, 'pause')}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400"
                          title="Pause Workflow"
                        >
                          <PauseIcon className="w-4 h-4" />
                        </button>
                      )}
                      {(workflow.status === 'Paused' || workflow.status === 'Draft') && (
                        <button
                          onClick={() => handlePauseStart(workflow, 'start')}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-green-600 dark:text-green-400"
                          title="Start Workflow"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(workflow)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        title="Edit Workflow"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
                            <CopyIcon className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(workflow)}>
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyWorkflow(workflow)}>
                            <CopyIcon className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteWorkflow(workflow)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <ZapIcon className="w-3 h-3" />
                      {workflow.trigger}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {workflow.steps} steps
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Executions</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{workflow.executions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Success Rate</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">
                        {workflow.successRate > 0 ? `${workflow.successRate}%` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Avg Duration</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{workflow.avgDuration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Last Run</p>
                      <p className="font-semibold text-slate-900 dark:text-gray-100">{workflow.lastRun}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Executions */}
        <div>
          <Card>
            <CardHeader title="Recent Executions" action={<Chip variant="info" size="sm">Live</Chip>} />
            <div className="p-4 space-y-3">
              {recentExecutions.map((execution, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-sm truncate">
                      {execution.workflow}
                    </span>
                    <Chip
                      variant={execution.status === 'Completed' ? 'success' : execution.status === 'Running' ? 'info' : 'error'}
                      size="sm"
                    >
                      {execution.status}
                    </Chip>
                  </div>
                  {(execution.order || execution.alert) && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {execution.order || execution.alert}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {execution.duration}
                    </div>
                    <span>{execution.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Workflow Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Define a new automated workflow with trigger and steps.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workflow-name">Workflow Name *</Label>
              <Input
                id="workflow-name"
                placeholder="e.g., Order Fulfillment Pipeline"
                value={workflowForm.name}
                onChange={(e) => setWorkflowForm({ ...workflowForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                placeholder="Describe what this workflow does..."
                value={workflowForm.description}
                onChange={(e) => setWorkflowForm({ ...workflowForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workflow-trigger">Trigger *</Label>
              <Select
                value={workflowForm.trigger}
                onValueChange={(value) => setWorkflowForm({ ...workflowForm, trigger: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerOptions.map((trigger) => (
                    <SelectItem key={trigger} value={trigger}>
                      {trigger}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workflow-steps">Number of Steps</Label>
              <Input
                id="workflow-steps"
                type="number"
                min={1}
                max={20}
                value={workflowForm.steps}
                onChange={(e) => setWorkflowForm({ ...workflowForm, steps: parseInt(e.target.value) || 1 })}
              />
              <p className="text-xs text-muted-foreground">
                Steps can be configured in the workflow editor after creation
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateWorkflow}>
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workflow Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Workflow</DialogTitle>
            <DialogDescription>
              Modify workflow settings and configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-workflow-name">Workflow Name *</Label>
              <Input
                id="edit-workflow-name"
                value={workflowForm.name}
                onChange={(e) => setWorkflowForm({ ...workflowForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-workflow-description">Description</Label>
              <Textarea
                id="edit-workflow-description"
                value={workflowForm.description}
                onChange={(e) => setWorkflowForm({ ...workflowForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-workflow-trigger">Trigger *</Label>
              <Select
                value={workflowForm.trigger}
                onValueChange={(value) => setWorkflowForm({ ...workflowForm, trigger: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerOptions.map((trigger) => (
                    <SelectItem key={trigger} value={trigger}>
                      {trigger}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-workflow-steps">Number of Steps</Label>
              <Input
                id="edit-workflow-steps"
                type="number"
                min={1}
                max={20}
                value={workflowForm.steps}
                onChange={(e) => setWorkflowForm({ ...workflowForm, steps: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateWorkflow}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Workflow Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedWorkflow?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedWorkflow && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <GitBranchIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedWorkflow.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedWorkflow.id}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedWorkflow.status].bg} ${statusColors[selectedWorkflow.status].text}`}>
                  {selectedWorkflow.status}
                </span>
              </div>

              {selectedWorkflow.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedWorkflow.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground">Trigger</p>
                  <p className="font-medium mt-1">{selectedWorkflow.trigger}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-muted-foreground">Steps</p>
                  <p className="font-medium mt-1">{selectedWorkflow.steps}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-2xl font-bold">{selectedWorkflow.executions}</p>
                  <p className="text-sm text-muted-foreground">Executions</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                  <p className="text-2xl font-bold">
                    {selectedWorkflow.successRate > 0 ? `${selectedWorkflow.successRate}%` : '-'}
                  </p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <p className="font-medium">{selectedWorkflow.avgDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Run</p>
                  <p className="font-medium">{selectedWorkflow.lastRun}</p>
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

      {/* Confirm Pause/Start Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'pause' ? 'Pause Workflow?' : 'Start Workflow?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'pause'
                ? `Are you sure you want to pause "${selectedWorkflow?.name}"? No new executions will be triggered.`
                : `Are you sure you want to start "${selectedWorkflow?.name}"? The workflow will begin processing triggers.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPauseStart}>
              {confirmAction === 'pause' ? 'Pause' : 'Start'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedWorkflow?.name}&rdquo;? This action cannot be undone and all execution history will be lost.
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
