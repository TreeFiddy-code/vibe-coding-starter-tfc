'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  MessageSquareIcon,
  ArrowUpIcon,
  FilterIcon,
  EyeIcon,
  BotIcon,
  ShieldAlertIcon,
  PlusIcon,
  HistoryIcon,
  FileTextIcon,
  SearchIcon,
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
import { Checkbox } from '@/components/shared/ui/checkbox';
import { toast } from 'sonner';

interface EscalationDetails {
  [key: string]: string | number;
}

interface AuditEntry {
  action: string;
  user: string;
  timestamp: string;
  note?: string;
}

interface Note {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Escalation {
  id: string;
  type: string;
  source: string;
  trigger: string;
  customer: string | null;
  priority: string;
  status: string;
  created: string;
  aiRecommendation: string;
  details: EscalationDetails;
  notes?: Note[];
  auditTrail?: AuditEntry[];
}

const escalationStats = {
  pendingReview: 8,
  inProgress: 5,
  resolvedToday: 23,
  avgResolutionTime: '18 min',
  escalationRate: '3.2%',
};

const initialEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    type: 'Order Issue',
    source: 'High-Value Order Rule',
    trigger: 'Order ORD-8421 ($587.99) requires approval',
    customer: 'Sarah Mitchell',
    priority: 'High',
    status: 'Pending',
    created: '12 min ago',
    aiRecommendation: 'Approve - Customer has good history (15 orders, 0 returns)',
    details: {
      orderTotal: '$587.99',
      customerOrders: 15,
      customerReturns: 0,
      riskScore: 'Low',
    },
    notes: [],
    auditTrail: [
      { action: 'Escalation created', user: 'System', timestamp: '12 min ago' },
      { action: 'AI recommendation generated', user: 'AI', timestamp: '12 min ago' },
    ],
  },
  {
    id: 'ESC-002',
    type: 'New Supplier',
    source: 'Supplier Verification Rule',
    trigger: 'First order from EcoGoods Wholesale needs review',
    customer: null,
    priority: 'Medium',
    status: 'Pending',
    created: '45 min ago',
    aiRecommendation: 'Review carefully - New supplier, limited verification data',
    details: {
      supplierName: 'EcoGoods Wholesale',
      orderValue: '$3,200',
      productCount: 45,
      riskScore: 'Medium',
    },
    notes: [],
    auditTrail: [
      { action: 'Escalation created', user: 'System', timestamp: '45 min ago' },
    ],
  },
  {
    id: 'ESC-003',
    type: 'Shipping Exception',
    source: 'International Shipping Rule',
    trigger: 'ORD-8419 shipping to Germany requires customs docs',
    customer: 'Hans Mueller',
    priority: 'Medium',
    status: 'In Progress',
    created: '1 hour ago',
    aiRecommendation: 'Standard customs declaration required - auto-generated docs ready',
    details: {
      destination: 'Germany',
      orderValue: '$245.00',
      itemCount: 3,
      riskScore: 'Low',
    },
    notes: [
      { id: '1', text: 'Customs documents being prepared', author: 'John Admin', timestamp: '30 min ago' },
    ],
    auditTrail: [
      { action: 'Escalation created', user: 'System', timestamp: '1 hour ago' },
      { action: 'Status changed to In Progress', user: 'John Admin', timestamp: '30 min ago' },
    ],
  },
  {
    id: 'ESC-004',
    type: 'Customer Complaint',
    source: 'Support AI',
    trigger: 'Customer threatening chargeback on ORD-8412',
    customer: 'Mike Thompson',
    priority: 'High',
    status: 'In Progress',
    created: '2 hours ago',
    aiRecommendation: 'Offer full refund + 20% discount on next order to retain customer',
    details: {
      orderValue: '$156.00',
      issueType: 'Product Quality',
      customerLifetimeValue: '$1,240',
      riskScore: 'High',
    },
    notes: [
      { id: '1', text: 'Contacted customer to understand the issue better', author: 'Sarah Support', timestamp: '1 hour ago' },
      { id: '2', text: 'Customer agreed to replacement instead of refund', author: 'Sarah Support', timestamp: '45 min ago' },
    ],
    auditTrail: [
      { action: 'Escalation created', user: 'Support AI', timestamp: '2 hours ago' },
      { action: 'Assigned to Sarah Support', user: 'System', timestamp: '2 hours ago' },
      { action: 'Status changed to In Progress', user: 'Sarah Support', timestamp: '1 hour ago' },
    ],
  },
  {
    id: 'ESC-005',
    type: 'Inventory Alert',
    source: 'Inventory Monitor',
    trigger: 'Critical stock level - SKU-PRD-042 at 0 units',
    customer: null,
    priority: 'High',
    status: 'Pending',
    created: '3 hours ago',
    aiRecommendation: 'Emergency reorder placed with TechSource Electronics - ETA 3 days',
    details: {
      productName: 'USB-C Hub 7-in-1',
      backorders: 23,
      estimatedLoss: '$1,035/day',
      riskScore: 'High',
    },
    notes: [],
    auditTrail: [
      { action: 'Escalation created', user: 'Inventory Monitor', timestamp: '3 hours ago' },
    ],
  },
];

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
  'In Progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  Resolved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  Rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
};

const typeIcons: Record<string, typeof AlertTriangleIcon> = {
  'Order Issue': ShieldAlertIcon,
  'New Supplier': UserIcon,
  'Shipping Exception': ArrowUpIcon,
  'Customer Complaint': MessageSquareIcon,
  'Inventory Alert': AlertTriangleIcon,
};

export default function EscalationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEscalationId, setSelectedEscalationId] = useState<string | null>(initialEscalations[0]?.id || null);
  const [escalations, setEscalations] = useState<Escalation[]>(initialEscalations);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [investigateOpen, setInvestigateOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [auditTrailOpen, setAuditTrailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Form states
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [filters, setFilters] = useState({
    type: [] as string[],
    priority: [] as string[],
    source: '',
  });

  const statuses = ['all', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

  const selected = escalations.find((e) => e.id === selectedEscalationId);

  // Handlers
  const handleApprove = () => {
    if (!selected) return;

    const auditEntry: AuditEntry = {
      action: 'Approved',
      user: 'Current User',
      timestamp: 'Just now',
      note: approvalNote || undefined,
    };

    setEscalations(escalations.map((e) =>
      e.id === selected.id
        ? {
            ...e,
            status: 'Resolved',
            auditTrail: [...(e.auditTrail || []), auditEntry],
          }
        : e
    ));

    setApproveDialogOpen(false);
    setApprovalNote('');
    toast.success(`Escalation ${selected.id} approved`);
  };

  const handleReject = () => {
    if (!selected || !rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    const auditEntry: AuditEntry = {
      action: 'Rejected',
      user: 'Current User',
      timestamp: 'Just now',
      note: rejectionReason,
    };

    setEscalations(escalations.map((e) =>
      e.id === selected.id
        ? {
            ...e,
            status: 'Rejected',
            auditTrail: [...(e.auditTrail || []), auditEntry],
          }
        : e
    ));

    setRejectDialogOpen(false);
    setRejectionReason('');
    toast.success(`Escalation ${selected.id} rejected`);
  };

  const handleStartInvestigation = () => {
    if (!selected) return;

    const auditEntry: AuditEntry = {
      action: 'Investigation started',
      user: 'Current User',
      timestamp: 'Just now',
      note: investigationNotes || undefined,
    };

    setEscalations(escalations.map((e) =>
      e.id === selected.id
        ? {
            ...e,
            status: 'In Progress',
            auditTrail: [...(e.auditTrail || []), auditEntry],
            notes: investigationNotes
              ? [...(e.notes || []), { id: String(Date.now()), text: investigationNotes, author: 'Current User', timestamp: 'Just now' }]
              : e.notes,
          }
        : e
    ));

    setInvestigateOpen(false);
    setInvestigationNotes('');
    toast.success('Investigation started');
  };

  const handleResolve = () => {
    if (!selected) return;

    const auditEntry: AuditEntry = {
      action: 'Marked as Resolved',
      user: 'Current User',
      timestamp: 'Just now',
    };

    setEscalations(escalations.map((e) =>
      e.id === selected.id
        ? {
            ...e,
            status: 'Resolved',
            auditTrail: [...(e.auditTrail || []), auditEntry],
          }
        : e
    ));

    toast.success(`Escalation ${selected.id} resolved`);
  };

  const handleAddNote = () => {
    if (!selected || !newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    const note: Note = {
      id: String(Date.now()),
      text: newNote,
      author: 'Current User',
      timestamp: 'Just now',
    };

    const auditEntry: AuditEntry = {
      action: 'Note added',
      user: 'Current User',
      timestamp: 'Just now',
    };

    setEscalations(escalations.map((e) =>
      e.id === selected.id
        ? {
            ...e,
            notes: [...(e.notes || []), note],
            auditTrail: [...(e.auditTrail || []), auditEntry],
          }
        : e
    ));

    setAddNoteOpen(false);
    setNewNote('');
    toast.success('Note added');
  };

  const handleApplyFilters = () => {
    toast.success('Filters applied');
    setFilterOpen(false);
  };

  const toggleFilterType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type.includes(type) ? prev.type.filter((t) => t !== type) : [...prev.type, type],
    }));
  };

  const toggleFilterPriority = (priority: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority) ? prev.priority.filter((p) => p !== priority) : [...prev.priority, priority],
    }));
  };

  // Filter escalations
  const filteredEscalations = escalations.filter((e) => {
    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      e.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type.length === 0 || filters.type.includes(e.type);
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(e.priority);
    const matchesSource = !filters.source || e.source.toLowerCase().includes(filters.source.toLowerCase());

    return matchesStatus && matchesSearch && matchesType && matchesPriority && matchesSource;
  });

  return (
    <DashboardLayout
      title="Escalations"
      subtitle="Review and resolve escalated issues that require human decision."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{escalationStats.pendingReview}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Review</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{escalationStats.inProgress}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{escalationStats.resolvedToday}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Resolved Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{escalationStats.avgResolutionTime}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Resolution</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{escalationStats.escalationRate}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Escalation Rate</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Escalations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader
              title="Escalation Queue"
              action={
                <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)}>
                  <FilterIcon className="w-4 h-4" />
                </Button>
              }
            />
            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search escalations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-1 mb-4 flex-wrap">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>

              {/* Escalation Items */}
              <div className="space-y-2">
                {filteredEscalations.map((escalation) => {
                    const TypeIcon = typeIcons[escalation.type] || AlertTriangleIcon;
                    return (
                      <div
                        key={escalation.id}
                        onClick={() => setSelectedEscalationId(escalation.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedEscalationId === escalation.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              escalation.priority === 'High'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-amber-100 dark:bg-amber-900/30'
                            }`}
                          >
                            <TypeIcon
                              className={`w-4 h-4 ${
                                escalation.priority === 'High'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900 dark:text-gray-100 text-sm">{escalation.type}</span>
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${priorityColors[escalation.priority]}`}>
                                {escalation.priority}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{escalation.trigger}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${statusColors[escalation.status].bg} ${statusColors[escalation.status].text}`}>
                                {escalation.status}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{escalation.created}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        </div>

        {/* Escalation Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card>
              <CardHeader
                title={`${selected.type} - ${selected.id}`}
                action={
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selected.status].bg} ${statusColors[selected.status].text}`}>
                    {selected.status}
                  </span>
                }
              />
              <div className="p-4 space-y-4">
                {/* Trigger Info */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Triggered by: {selected.source}</p>
                  <p className="font-medium text-slate-900 dark:text-gray-100">{selected.trigger}</p>
                  {selected.customer && (
                    <div className="flex items-center gap-2 mt-2">
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{selected.customer}</span>
                    </div>
                  )}
                </div>

                {/* AI Recommendation */}
                <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BotIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium text-primary-700 dark:text-primary-300">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-primary-800 dark:text-primary-200">{selected.aiRecommendation}</p>
                </div>

                {/* Details */}
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-gray-100 mb-3">Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selected.details).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p
                          className={`font-semibold ${
                            key === 'riskScore'
                              ? value === 'High'
                                ? 'text-red-600 dark:text-red-400'
                                : value === 'Medium'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-green-600 dark:text-green-400'
                              : 'text-slate-900 dark:text-gray-100'
                          }`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                {selected.notes && selected.notes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <MessageSquareIcon className="w-4 h-4" />
                      Notes ({selected.notes.length})
                    </h4>
                    <div className="space-y-2">
                      {selected.notes.map((note) => (
                        <div key={note.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-sm">{note.text}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <UserIcon className="w-3 h-3" />
                            <span>{note.author}</span>
                            <span>·</span>
                            <span>{note.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Trail Button */}
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setAuditTrailOpen(true)}
                  >
                    <HistoryIcon className="w-4 h-4 mr-1" />
                    View Audit Trail ({selected.auditTrail?.length || 0} entries)
                  </Button>
                </div>

                {/* Action Buttons */}
                {selected.status === 'Pending' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => setApproveDialogOpen(true)}>
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setInvestigateOpen(true)}>
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Investigate
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 text-red-600 dark:text-red-400" onClick={() => setRejectDialogOpen(true)}>
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {selected.status === 'In Progress' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="primary" size="sm" className="flex-1" onClick={handleResolve}>
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Mark Resolved
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setAddNoteOpen(true)}>
                      <MessageSquareIcon className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                )}

                {(selected.status === 'Resolved' || selected.status === 'Rejected') && (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-sm text-slate-500">
                      This escalation has been {selected.status.toLowerCase()}.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Select an escalation to view details
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Escalation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this escalation? This action will mark it as resolved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="approval-note">Note (optional)</Label>
            <Textarea
              id="approval-note"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="Add any notes about this approval..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Escalation</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this escalation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Reason *</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this escalation is being rejected..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Investigate Modal */}
      <Dialog open={investigateOpen} onOpenChange={setInvestigateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <EyeIcon className="w-5 h-5" />
              Start Investigation
            </DialogTitle>
            <DialogDescription>
              Begin investigating this escalation. This will change the status to &quot;In Progress&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="investigation-notes">Initial Notes</Label>
              <Textarea
                id="investigation-notes"
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
                placeholder="Add any initial notes or observations..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setInvestigateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStartInvestigation}>
              Start Investigation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5" />
              Add Note
            </DialogTitle>
            <DialogDescription>
              Add a note to this escalation for tracking purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="new-note">Note</Label>
              <Textarea
                id="new-note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddNoteOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddNote}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Trail Modal */}
      <Dialog open={auditTrailOpen} onOpenChange={setAuditTrailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="w-5 h-5" />
              Audit Trail - {selected?.id}
            </DialogTitle>
            <DialogDescription>
              Complete history of actions taken on this escalation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {selected?.auditTrail?.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.action}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <UserIcon className="w-3 h-3" />
                      <span>{entry.user}</span>
                      <span>·</span>
                      <ClockIcon className="w-3 h-3" />
                      <span>{entry.timestamp}</span>
                    </div>
                    {entry.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                        &quot;{entry.note}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="primary" onClick={() => setAuditTrailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Escalations</DialogTitle>
            <DialogDescription>Narrow down the escalation queue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Type</Label>
              <div className="space-y-2">
                {['Order Issue', 'New Supplier', 'Shipping Exception', 'Customer Complaint', 'Inventory Alert'].map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-type-${type}`}
                      checked={filters.type.includes(type)}
                      onCheckedChange={() => toggleFilterType(type)}
                    />
                    <Label htmlFor={`filter-type-${type}`} className="font-normal">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Priority</Label>
              <div className="space-y-2">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <div key={priority} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-priority-${priority}`}
                      checked={filters.priority.includes(priority)}
                      onCheckedChange={() => toggleFilterPriority(priority)}
                    />
                    <Label htmlFor={`filter-priority-${priority}`} className="font-normal">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="filter-source">Source</Label>
              <Input
                id="filter-source"
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                placeholder="Filter by source..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFilters({ type: [], priority: [], source: '' })}>
              Clear All
            </Button>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
