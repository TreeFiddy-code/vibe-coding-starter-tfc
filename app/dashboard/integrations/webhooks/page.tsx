'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
import {
  WebhookIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  CopyIcon,
  ExternalLinkIcon,
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
import { Checkbox } from '@/components/shared/ui/checkbox';
import { toast } from 'sonner';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'Active' | 'Paused';
  lastTriggered: string;
  successRate: number;
  deliveries: number;
}

const availableEvents = [
  'order.created',
  'order.updated',
  'order.paid',
  'order.shipped',
  'order.delivered',
  'inventory.low',
  'inventory.updated',
  'refund.processed',
];

const initialWebhooks: Webhook[] = [
  {
    id: 'WH-001',
    name: 'Order Created',
    url: 'https://api.example.com/webhooks/orders',
    events: ['order.created', 'order.updated'],
    status: 'Active',
    lastTriggered: '2 min ago',
    successRate: 99.2,
    deliveries: 342,
  },
  {
    id: 'WH-002',
    name: 'Inventory Update',
    url: 'https://inventory.example.com/sync',
    events: ['inventory.low', 'inventory.updated'],
    status: 'Active',
    lastTriggered: '15 min ago',
    successRate: 97.8,
    deliveries: 156,
  },
  {
    id: 'WH-003',
    name: 'Customer Notification',
    url: 'https://notifications.example.com/customer',
    events: ['order.shipped', 'order.delivered'],
    status: 'Active',
    lastTriggered: '1 hour ago',
    successRate: 100,
    deliveries: 89,
  },
  {
    id: 'WH-004',
    name: 'Analytics Tracker',
    url: 'https://analytics.example.com/events',
    events: ['order.created', 'refund.processed'],
    status: 'Paused',
    lastTriggered: '2 days ago',
    successRate: 94.5,
    deliveries: 1203,
  },
  {
    id: 'WH-005',
    name: 'Fulfillment Service',
    url: 'https://fulfillment.example.com/webhook',
    events: ['order.paid'],
    status: 'Active',
    lastTriggered: '5 min ago',
    successRate: 98.9,
    deliveries: 234,
  },
];

const recentDeliveries = [
  { webhook: 'Order Created', event: 'order.created', status: 'Success', responseTime: '124ms', time: '2 min ago' },
  { webhook: 'Fulfillment Service', event: 'order.paid', status: 'Success', responseTime: '89ms', time: '5 min ago' },
  { webhook: 'Inventory Update', event: 'inventory.low', status: 'Success', responseTime: '156ms', time: '15 min ago' },
  { webhook: 'Order Created', event: 'order.updated', status: 'Failed', responseTime: '-', time: '22 min ago' },
  { webhook: 'Customer Notification', event: 'order.shipped', status: 'Success', responseTime: '201ms', time: '1 hour ago' },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);

  // Form state
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
  });

  const webhookStats = {
    totalWebhooks: webhooks.length,
    active: webhooks.filter(w => w.status === 'Active').length,
    paused: webhooks.filter(w => w.status === 'Paused').length,
    eventsToday: webhooks.reduce((sum, w) => sum + w.deliveries, 0),
    successRate: webhooks.length > 0
      ? (webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)
      : 0,
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleCreateWebhook = () => {
    if (!webhookForm.name || !webhookForm.url || webhookForm.events.length === 0) {
      toast.error('Please fill in all required fields and select at least one event');
      return;
    }

    const newId = `WH-${String(webhooks.length + 1).padStart(3, '0')}`;
    const newWebhook: Webhook = {
      id: newId,
      name: webhookForm.name,
      url: webhookForm.url,
      events: webhookForm.events,
      status: 'Active',
      lastTriggered: 'Never',
      successRate: 100,
      deliveries: 0,
    };

    setWebhooks([...webhooks, newWebhook]);
    setCreateModalOpen(false);
    setWebhookForm({ name: '', url: '', events: [] });
    toast.success(`Webhook "${newWebhook.name}" created successfully`);
  };

  const handleOpenEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setWebhookForm({
      name: webhook.name,
      url: webhook.url,
      events: [...webhook.events],
    });
    setEditModalOpen(true);
  };

  const handleUpdateWebhook = () => {
    if (!selectedWebhook || !webhookForm.name || !webhookForm.url || webhookForm.events.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setWebhooks(webhooks.map(w => {
      if (w.id === selectedWebhook.id) {
        return {
          ...w,
          name: webhookForm.name,
          url: webhookForm.url,
          events: webhookForm.events,
        };
      }
      return w;
    }));

    setEditModalOpen(false);
    setSelectedWebhook(null);
    setWebhookForm({ name: '', url: '', events: [] });
    toast.success(`Webhook "${webhookForm.name}" updated successfully`);
  };

  const handleToggleWebhook = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setToggleDialogOpen(true);
  };

  const confirmToggle = () => {
    if (!selectedWebhook) return;

    setWebhooks(webhooks.map(w => {
      if (w.id === selectedWebhook.id) {
        return {
          ...w,
          status: w.status === 'Active' ? 'Paused' as const : 'Active' as const,
        };
      }
      return w;
    }));

    toast.success(
      selectedWebhook.status === 'Active'
        ? `Webhook "${selectedWebhook.name}" paused`
        : `Webhook "${selectedWebhook.name}" activated`
    );
    setToggleDialogOpen(false);
    setSelectedWebhook(null);
  };

  const handleDeleteWebhook = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedWebhook) return;

    setWebhooks(webhooks.filter(w => w.id !== selectedWebhook.id));
    toast.success(`Webhook "${selectedWebhook.name}" deleted`);
    setDeleteDialogOpen(false);
    setSelectedWebhook(null);
  };

  const toggleEvent = (event: string) => {
    setWebhookForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  return (
    <DashboardLayout
      title="Webhooks"
      subtitle="Configure webhook endpoints for real-time event notifications."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{webhookStats.totalWebhooks}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Webhooks</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{webhookStats.active}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{webhookStats.paused}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Paused</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{webhookStats.eventsToday}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Events Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{webhookStats.successRate}%</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Success Rate</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Webhooks List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Webhook Endpoints"
              action={
                <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Webhook
                </Button>
              }
            />
            <div className="p-4 space-y-3">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    webhook.status === 'Active'
                      ? 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                      : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        webhook.status === 'Active'
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}>
                        <WebhookIcon className={`w-5 h-5 ${webhook.status === 'Active' ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-gray-100">{webhook.name}</h3>
                          <Chip variant={webhook.status === 'Active' ? 'success' : 'neutral'} size="sm">
                            {webhook.status}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded truncate max-w-xs">
                            {webhook.url}
                          </code>
                          <button
                            onClick={() => handleCopyUrl(webhook.url)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            title="Copy URL"
                          >
                            <CopyIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleWebhook(webhook)}
                        className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          webhook.status === 'Active' ? 'text-amber-600' : 'text-green-600'
                        }`}
                        title={webhook.status === 'Active' ? 'Pause Webhook' : 'Activate Webhook'}
                      >
                        {webhook.status === 'Active' ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(webhook)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        title="Edit Webhook"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWebhook(webhook)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        title="Delete Webhook"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {event}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Last Triggered</p>
                      <p className="font-medium text-slate-900 dark:text-gray-100">{webhook.lastTriggered}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Success Rate</p>
                      <p className="font-medium text-slate-900 dark:text-gray-100">{webhook.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400">Deliveries</p>
                      <p className="font-medium text-slate-900 dark:text-gray-100">{webhook.deliveries}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Deliveries */}
        <div>
          <Card>
            <CardHeader title="Recent Deliveries" action={<Chip variant="info" size="sm">Live</Chip>} />
            <div className="p-4 space-y-3">
              {recentDeliveries.map((delivery, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-sm">{delivery.webhook}</span>
                    {delivery.status === 'Success' ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{delivery.event}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{delivery.responseTime}</span>
                    <span>{delivery.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Available Events */}
          <Card className="mt-4">
            <CardHeader title="Available Events" />
            <div className="p-4 space-y-2">
              {availableEvents.map((event) => (
                <div key={event} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                  <code className="text-sm text-slate-700 dark:text-slate-300">{event}</code>
                  <ExternalLinkIcon className="w-3 h-3 text-slate-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Webhook Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>
              Configure a new webhook endpoint to receive real-time event notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="webhook-name">Webhook Name *</Label>
              <Input
                id="webhook-name"
                placeholder="e.g., Order Notifications"
                value={webhookForm.name}
                onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="webhook-url">Endpoint URL *</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-server.com/webhook"
                value={webhookForm.url}
                onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
              />
            </div>
            <div className="grid gap-3">
              <Label>Events to Subscribe *</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={`event-${event}`}
                      checked={webhookForm.events.includes(event)}
                      onCheckedChange={() => toggleEvent(event)}
                    />
                    <label
                      htmlFor={`event-${event}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {event}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateWebhook}>
              Add Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Webhook Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Webhook</DialogTitle>
            <DialogDescription>
              Modify webhook settings and subscribed events.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-webhook-name">Webhook Name *</Label>
              <Input
                id="edit-webhook-name"
                value={webhookForm.name}
                onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-webhook-url">Endpoint URL *</Label>
              <Input
                id="edit-webhook-url"
                type="url"
                value={webhookForm.url}
                onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
              />
            </div>
            <div className="grid gap-3">
              <Label>Events to Subscribe *</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-event-${event}`}
                      checked={webhookForm.events.includes(event)}
                      onCheckedChange={() => toggleEvent(event)}
                    />
                    <label
                      htmlFor={`edit-event-${event}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {event}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateWebhook}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Confirmation Dialog */}
      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedWebhook?.status === 'Active' ? 'Pause Webhook?' : 'Activate Webhook?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedWebhook?.status === 'Active'
                ? `Are you sure you want to pause "${selectedWebhook?.name}"? No events will be delivered to this endpoint.`
                : `Are you sure you want to activate "${selectedWebhook?.name}"? Events will start being delivered to this endpoint.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>
              {selectedWebhook?.status === 'Active' ? 'Pause' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedWebhook?.name}&rdquo;? This action cannot be undone and no events will be delivered to this endpoint.
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
