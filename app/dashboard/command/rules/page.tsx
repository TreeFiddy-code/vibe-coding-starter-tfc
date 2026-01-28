'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  DollarSignIcon,
  PackageIcon,
  TruckIcon,
  UsersIcon,
  ClockIcon,
  LucideIcon,
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

interface Rule {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  action: string;
  status: 'Active' | 'Inactive';
  triggeredToday: number;
  icon: LucideIcon;
}

interface Escalation {
  id: string;
  rule: string;
  trigger: string;
  time: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const categoryIcons: Record<string, LucideIcon> = {
  Orders: DollarSignIcon,
  Suppliers: UsersIcon,
  Shipping: TruckIcon,
  Inventory: PackageIcon,
};

const initialRules: Rule[] = [
  {
    id: 'RUL-001',
    name: 'High-Value Order Approval',
    description: 'Orders over $500 require human approval before processing',
    category: 'Orders',
    condition: 'Order total > $500',
    action: 'Require approval',
    status: 'Active',
    triggeredToday: 12,
    icon: DollarSignIcon,
  },
  {
    id: 'RUL-002',
    name: 'New Supplier Review',
    description: 'First orders from new suppliers need manual verification',
    category: 'Suppliers',
    condition: 'Supplier orders < 3',
    action: 'Manual review',
    status: 'Active',
    triggeredToday: 3,
    icon: UsersIcon,
  },
  {
    id: 'RUL-003',
    name: 'International Shipping Hold',
    description: 'International orders held for customs documentation',
    category: 'Shipping',
    condition: 'Ship country != US',
    action: 'Hold for review',
    status: 'Active',
    triggeredToday: 8,
    icon: TruckIcon,
  },
  {
    id: 'RUL-004',
    name: 'Low Stock Alert',
    description: 'Alert when inventory falls below threshold',
    category: 'Inventory',
    condition: 'Stock < reorder point',
    action: 'Send alert',
    status: 'Active',
    triggeredToday: 15,
    icon: PackageIcon,
  },
  {
    id: 'RUL-005',
    name: 'Rush Order Priority',
    description: 'Prioritize orders with express shipping',
    category: 'Orders',
    condition: 'Shipping = Express',
    action: 'Set high priority',
    status: 'Active',
    triggeredToday: 24,
    icon: ClockIcon,
  },
  {
    id: 'RUL-006',
    name: 'Bulk Order Split',
    description: 'Split orders with more than 10 items',
    category: 'Orders',
    condition: 'Items > 10',
    action: 'Split shipment',
    status: 'Inactive',
    triggeredToday: 0,
    icon: PackageIcon,
  },
];

const initialEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    rule: 'High-Value Order Approval',
    trigger: 'ORD-8421 ($587.99)',
    time: '12 min ago',
    status: 'Pending',
  },
  {
    id: 'ESC-002',
    rule: 'New Supplier Review',
    trigger: 'Supplier: EcoGoods Wholesale',
    time: '45 min ago',
    status: 'Pending',
  },
  {
    id: 'ESC-003',
    rule: 'International Shipping Hold',
    trigger: 'ORD-8419 (Germany)',
    time: '1 hour ago',
    status: 'Approved',
  },
];

const categoryColors: Record<string, string> = {
  Orders: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Suppliers: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Shipping: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Inventory: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const actionOptions = [
  'Require approval',
  'Manual review',
  'Hold for review',
  'Send alert',
  'Set high priority',
  'Split shipment',
  'Auto-reject',
  'Escalate to manager',
  'Apply discount',
  'Flag for audit',
];

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [escalations, setEscalations] = useState<Escalation[]>(initialEscalations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [escalationDialogOpen, setEscalationDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [escalationAction, setEscalationAction] = useState<'approve' | 'reject' | null>(null);

  // Form state
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    category: '',
    condition: '',
    action: '',
  });

  const categories = ['all', 'Orders', 'Suppliers', 'Shipping', 'Inventory'];

  const ruleStats = {
    totalRules: rules.length,
    active: rules.filter(r => r.status === 'Active').length,
    inactive: rules.filter(r => r.status === 'Inactive').length,
    triggeredToday: rules.reduce((sum, r) => sum + r.triggeredToday, 0),
    escalationsToday: escalations.filter(e => e.status === 'Pending').length,
  };

  const handleCreateRule = () => {
    if (!ruleForm.name || !ruleForm.category || !ruleForm.condition || !ruleForm.action) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newId = `RUL-${String(rules.length + 1).padStart(3, '0')}`;
    const newRule: Rule = {
      id: newId,
      name: ruleForm.name,
      description: ruleForm.description,
      category: ruleForm.category,
      condition: ruleForm.condition,
      action: ruleForm.action,
      status: 'Active',
      triggeredToday: 0,
      icon: categoryIcons[ruleForm.category] || PackageIcon,
    };

    setRules([...rules, newRule]);
    setCreateModalOpen(false);
    setRuleForm({ name: '', description: '', category: '', condition: '', action: '' });
    toast.success(`Rule "${newRule.name}" created successfully`);
  };

  const handleOpenEdit = (rule: Rule) => {
    setSelectedRule(rule);
    setRuleForm({
      name: rule.name,
      description: rule.description,
      category: rule.category,
      condition: rule.condition,
      action: rule.action,
    });
    setEditModalOpen(true);
  };

  const handleUpdateRule = () => {
    if (!selectedRule || !ruleForm.name || !ruleForm.category || !ruleForm.condition || !ruleForm.action) {
      toast.error('Please fill in all required fields');
      return;
    }

    setRules(rules.map(r => {
      if (r.id === selectedRule.id) {
        return {
          ...r,
          name: ruleForm.name,
          description: ruleForm.description,
          category: ruleForm.category,
          condition: ruleForm.condition,
          action: ruleForm.action,
          icon: categoryIcons[ruleForm.category] || r.icon,
        };
      }
      return r;
    }));

    setEditModalOpen(false);
    setSelectedRule(null);
    setRuleForm({ name: '', description: '', category: '', condition: '', action: '' });
    toast.success(`Rule "${ruleForm.name}" updated successfully`);
  };

  const handleToggleRule = (rule: Rule) => {
    setRules(rules.map(r => {
      if (r.id === rule.id) {
        const newStatus = r.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(`Rule "${r.name}" ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
        return { ...r, status: newStatus as 'Active' | 'Inactive' };
      }
      return r;
    }));
  };

  const handleDeleteRule = (rule: Rule) => {
    setSelectedRule(rule);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRule) return;

    setRules(rules.filter(r => r.id !== selectedRule.id));
    toast.success(`Rule "${selectedRule.name}" deleted`);
    setDeleteDialogOpen(false);
    setSelectedRule(null);
  };

  const handleEscalationAction = (escalation: Escalation, action: 'approve' | 'reject') => {
    setSelectedEscalation(escalation);
    setEscalationAction(action);
    setEscalationDialogOpen(true);
  };

  const confirmEscalationAction = () => {
    if (!selectedEscalation || !escalationAction) return;

    setEscalations(escalations.map(e => {
      if (e.id === selectedEscalation.id) {
        return {
          ...e,
          status: escalationAction === 'approve' ? 'Approved' : 'Rejected',
        };
      }
      return e;
    }));

    toast.success(
      escalationAction === 'approve'
        ? `Escalation "${selectedEscalation.trigger}" approved`
        : `Escalation "${selectedEscalation.trigger}" rejected`
    );
    setEscalationDialogOpen(false);
    setSelectedEscalation(null);
    setEscalationAction(null);
  };

  return (
    <DashboardLayout
      title="Automation Rules"
      subtitle="Define guardrails, triggers, and escalation rules for AI agents."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{ruleStats.totalRules}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Rules</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{ruleStats.active}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{ruleStats.inactive}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Inactive</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{ruleStats.triggeredToday}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Triggered Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{ruleStats.escalationsToday}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Escalations</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Rules List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Rules"
              action={
                <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  New Rule
                </Button>
              }
            />
            <div className="p-4">
              {/* Category Filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {category === 'all' ? 'All Rules' : category}
                  </button>
                ))}
              </div>

              {/* Rules */}
              <div className="space-y-3">
                {rules
                  .filter((rule) => selectedCategory === 'all' || rule.category === selectedCategory)
                  .map((rule) => (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        rule.status === 'Active'
                          ? 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                          : 'border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              rule.status === 'Active'
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            <rule.icon className={`w-5 h-5 ${rule.status === 'Active' ? 'text-white' : 'text-slate-500'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-gray-100">{rule.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[rule.category]}`}>
                                {rule.category}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{rule.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleRule(rule)}
                            className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                              rule.status === 'Active' ? 'text-green-600' : 'text-slate-400'
                            }`}
                            title={rule.status === 'Active' ? 'Deactivate rule' : 'Activate rule'}
                          >
                            {rule.status === 'Active' ? (
                              <ToggleRightIcon className="w-5 h-5" />
                            ) : (
                              <ToggleLeftIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(rule)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                            title="Edit rule"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Delete rule"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">If:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{rule.condition}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Then:</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{rule.action}</span>
                        </div>
                        {rule.triggeredToday > 0 && (
                          <Chip variant="info" size="sm">
                            {rule.triggeredToday} triggered today
                          </Chip>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Escalations Queue */}
        <div>
          <Card>
            <CardHeader
              title="Escalations Queue"
              action={<Chip variant="warning" size="sm">{escalations.filter((e) => e.status === 'Pending').length} pending</Chip>}
            />
            <div className="p-4 space-y-3">
              {escalations.map((escalation) => (
                <div key={escalation.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-sm">{escalation.rule}</span>
                    <Chip
                      variant={
                        escalation.status === 'Pending'
                          ? 'warning'
                          : escalation.status === 'Approved'
                          ? 'success'
                          : 'error'
                      }
                      size="sm"
                    >
                      {escalation.status}
                    </Chip>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{escalation.trigger}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{escalation.time}</span>
                    {escalation.status === 'Pending' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEscalationAction(escalation, 'approve')}
                          className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                          title="Approve"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEscalationAction(escalation, 'reject')}
                          className="p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          title="Reject"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader title="Rule Performance" />
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Auto-resolved</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-gray-100">148 (95%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Escalated</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-gray-100">8 (5%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <div className="h-2 bg-amber-500 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Rule Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Rule</DialogTitle>
            <DialogDescription>
              Define a new automation rule with conditions and actions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rule-name">Rule Name *</Label>
              <Input
                id="rule-name"
                placeholder="e.g., High-Value Order Approval"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-description">Description</Label>
              <Textarea
                id="rule-description"
                placeholder="Describe what this rule does..."
                value={ruleForm.description}
                onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-category">Category *</Label>
              <Select
                value={ruleForm.category}
                onValueChange={(value) => setRuleForm({ ...ruleForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Orders">Orders</SelectItem>
                  <SelectItem value="Suppliers">Suppliers</SelectItem>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-condition">Condition (If) *</Label>
              <Input
                id="rule-condition"
                placeholder="e.g., Order total > $500"
                value={ruleForm.condition}
                onChange={(e) => setRuleForm({ ...ruleForm, condition: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Define the condition that triggers this rule
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-action">Action (Then) *</Label>
              <Select
                value={ruleForm.action}
                onValueChange={(value) => setRuleForm({ ...ruleForm, action: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateRule}>
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Modify the automation rule settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-name">Rule Name *</Label>
              <Input
                id="edit-rule-name"
                placeholder="e.g., High-Value Order Approval"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-description">Description</Label>
              <Textarea
                id="edit-rule-description"
                placeholder="Describe what this rule does..."
                value={ruleForm.description}
                onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-category">Category *</Label>
              <Select
                value={ruleForm.category}
                onValueChange={(value) => setRuleForm({ ...ruleForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Orders">Orders</SelectItem>
                  <SelectItem value="Suppliers">Suppliers</SelectItem>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-condition">Condition (If) *</Label>
              <Input
                id="edit-rule-condition"
                placeholder="e.g., Order total > $500"
                value={ruleForm.condition}
                onChange={(e) => setRuleForm({ ...ruleForm, condition: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-action">Action (Then) *</Label>
              <Select
                value={ruleForm.action}
                onValueChange={(value) => setRuleForm({ ...ruleForm, action: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateRule}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedRule?.name}&rdquo;? This action cannot be undone.
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

      {/* Escalation Action Dialog */}
      <AlertDialog open={escalationDialogOpen} onOpenChange={setEscalationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {escalationAction === 'approve' ? 'Approve Escalation?' : 'Reject Escalation?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {escalationAction === 'approve'
                ? `Are you sure you want to approve "${selectedEscalation?.trigger}"? This will allow the action to proceed.`
                : `Are you sure you want to reject "${selectedEscalation?.trigger}"? This will block the action.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEscalationAction}
              className={
                escalationAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-600'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-600'
              }
            >
              {escalationAction === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
