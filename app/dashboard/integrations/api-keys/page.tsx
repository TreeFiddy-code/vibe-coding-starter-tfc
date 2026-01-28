'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar } from '@/components/dashboard';
import {
  KeyIcon,
  PlusIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  TrashIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'Active' | 'Expired';
  created: string;
  lastUsed: string;
  callsToday: number;
  rateLimit: number;
}

const generateRandomKey = (prefix: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const initialApiKeys: ApiKey[] = [
  {
    id: 'KEY-001',
    name: 'Production API Key',
    key: 'omnc_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    permissions: ['read', 'write', 'delete'],
    status: 'Active',
    created: 'Jan 15, 2024',
    lastUsed: '2 min ago',
    callsToday: 8234,
    rateLimit: 50000,
  },
  {
    id: 'KEY-002',
    name: 'Staging API Key',
    key: 'omnc_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    permissions: ['read', 'write'],
    status: 'Active',
    created: 'Jan 20, 2024',
    lastUsed: '1 hour ago',
    callsToday: 1523,
    rateLimit: 10000,
  },
  {
    id: 'KEY-003',
    name: 'Analytics Read-Only',
    key: 'sk_analytics_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    permissions: ['read'],
    status: 'Active',
    created: 'Feb 1, 2024',
    lastUsed: '15 min ago',
    callsToday: 2890,
    rateLimit: 25000,
  },
  {
    id: 'KEY-004',
    name: 'Webhook Service',
    key: 'sk_webhook_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    permissions: ['read', 'write'],
    status: 'Active',
    created: 'Feb 10, 2024',
    lastUsed: '5 min ago',
    callsToday: 200,
    rateLimit: 5000,
  },
  {
    id: 'KEY-005',
    name: 'Legacy Integration',
    key: 'sk_legacy_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    permissions: ['read'],
    status: 'Expired',
    created: 'Dec 1, 2023',
    lastUsed: '30 days ago',
    callsToday: 0,
    rateLimit: 1000,
  },
];

const usageHistory = [
  { date: 'Today', calls: 12847, status: 'normal' },
  { date: 'Yesterday', calls: 14231, status: 'normal' },
  { date: 'Jan 25', calls: 11892, status: 'normal' },
  { date: 'Jan 24', calls: 45892, status: 'warning' },
  { date: 'Jan 23', calls: 13421, status: 'normal' },
];

const rateLimitOptions = [
  { value: '1000', label: '1,000/day' },
  { value: '5000', label: '5,000/day' },
  { value: '10000', label: '10,000/day' },
  { value: '25000', label: '25,000/day' },
  { value: '50000', label: '50,000/day' },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [newGeneratedKey, setNewGeneratedKey] = useState<string>('');

  // Form state
  const [keyForm, setKeyForm] = useState({
    name: '',
    rateLimit: '10000',
    permissions: {
      read: true,
      write: false,
      delete: false,
    },
  });

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const handleGenerateKey = () => {
    if (!keyForm.name) {
      toast.error('Please enter a name for the API key');
      return;
    }

    const permissions = Object.entries(keyForm.permissions)
      .filter(([, enabled]) => enabled)
      .map(([perm]) => perm);

    if (permissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    const newKey = generateRandomKey('sk_');
    const newId = `KEY-${String(apiKeys.length + 1).padStart(3, '0')}`;
    const newApiKey: ApiKey = {
      id: newId,
      name: keyForm.name,
      key: newKey,
      permissions,
      status: 'Active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never',
      callsToday: 0,
      rateLimit: parseInt(keyForm.rateLimit),
    };

    setApiKeys([...apiKeys, newApiKey]);
    setNewGeneratedKey(newKey);
    setCreateModalOpen(false);
    setNewKeyModalOpen(true);
    setKeyForm({
      name: '',
      rateLimit: '10000',
      permissions: { read: true, write: false, delete: false },
    });
  };

  const handleRotateKey = (apiKey: ApiKey) => {
    setSelectedKey(apiKey);
    setRotateDialogOpen(true);
  };

  const confirmRotateKey = () => {
    if (!selectedKey) return;

    const newKey = generateRandomKey('sk_');
    setApiKeys(apiKeys.map(k => {
      if (k.id === selectedKey.id) {
        return { ...k, key: newKey };
      }
      return k;
    }));

    setNewGeneratedKey(newKey);
    setRotateDialogOpen(false);
    setNewKeyModalOpen(true);
    toast.success(`API key "${selectedKey.name}" has been rotated`);
    setSelectedKey(null);
  };

  const handleDeleteKey = (apiKey: ApiKey) => {
    setSelectedKey(apiKey);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteKey = () => {
    if (!selectedKey) return;

    setApiKeys(apiKeys.filter(k => k.id !== selectedKey.id));
    toast.success(`API key "${selectedKey.name}" deleted`);
    setDeleteDialogOpen(false);
    setSelectedKey(null);
  };

  const apiStats = {
    totalKeys: apiKeys.length,
    active: apiKeys.filter(k => k.status === 'Active').length,
    expired: apiKeys.filter(k => k.status === 'Expired').length,
    callsToday: apiKeys.reduce((sum, k) => sum + k.callsToday, 0),
    rateLimit: '50,000/day',
  };

  return (
    <DashboardLayout
      title="API Keys"
      subtitle="Manage API keys for programmatic access to your OmniCart AI account."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{apiStats.totalKeys}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Keys</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{apiStats.active}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{apiStats.expired}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Expired</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{apiStats.callsToday.toLocaleString()}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Calls Today</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{apiStats.rateLimit}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Rate Limit</p>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* API Keys List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="API Keys"
              action={
                <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Generate New Key
                </Button>
              }
            />
            <div className="p-4 space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    apiKey.status === 'Active'
                      ? 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                      : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        apiKey.status === 'Active'
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <KeyIcon className={`w-5 h-5 ${apiKey.status === 'Active' ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-gray-100">{apiKey.name}</h3>
                          <Chip variant={apiKey.status === 'Active' ? 'success' : 'error'} size="sm">
                            {apiKey.status}
                          </Chip>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Created {apiKey.created} · Last used {apiKey.lastUsed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {apiKey.status === 'Active' && (
                        <button
                          onClick={() => handleRotateKey(apiKey)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                          title="Rotate Key"
                        >
                          <RefreshCwIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteKey(apiKey)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        title="Delete Key"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* API Key Display */}
                  <div className="flex items-center gap-2 mb-3 p-2 rounded bg-slate-100 dark:bg-slate-800">
                    <code className="flex-1 text-sm text-slate-700 dark:text-slate-300 font-mono">
                      {visibleKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•')}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      title={visibleKeys[apiKey.id] ? 'Hide Key' : 'Show Key'}
                    >
                      {visibleKeys[apiKey.id] ? (
                        <EyeOffIcon className="w-4 h-4 text-slate-500" />
                      ) : (
                        <EyeIcon className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      title="Copy Key"
                    >
                      <CopyIcon className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  {/* Permissions */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Permissions:</span>
                    {apiKey.permissions.map((perm) => (
                      <span
                        key={perm}
                        className={`text-xs px-2 py-0.5 rounded ${
                          perm === 'delete'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : perm === 'write'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>

                  {/* Usage */}
                  {apiKey.status === 'Active' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Daily Usage</span>
                        <span className="text-slate-900 dark:text-gray-100">
                          {apiKey.callsToday.toLocaleString()} / {apiKey.rateLimit.toLocaleString()}
                        </span>
                      </div>
                      <ProgressBar
                        value={(apiKey.callsToday / apiKey.rateLimit) * 100}
                        variant={apiKey.callsToday / apiKey.rateLimit > 0.8 ? 'warning' : 'success'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Usage History */}
          <Card>
            <CardHeader title="Usage History" />
            <div className="p-4 space-y-3">
              {usageHistory.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{day.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-gray-100">
                      {day.calls.toLocaleString()}
                    </span>
                    {day.status === 'warning' && (
                      <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Tips */}
          <Card>
            <CardHeader title="Security Best Practices" />
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Never expose API keys in client-side code
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Rotate keys regularly (every 90 days recommended)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use separate keys for different environments
                </p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-green-500 mt-0.5" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Grant minimum required permissions
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create API Key Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key with specific permissions and rate limits.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="key-name">Key Name *</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production API Key"
                value={keyForm.name}
                onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rate-limit">Rate Limit</Label>
              <Select
                value={keyForm.rateLimit}
                onValueChange={(value) => setKeyForm({ ...keyForm, rateLimit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate limit" />
                </SelectTrigger>
                <SelectContent>
                  {rateLimitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label>Permissions</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-read"
                    checked={keyForm.permissions.read}
                    onCheckedChange={(checked) =>
                      setKeyForm({
                        ...keyForm,
                        permissions: { ...keyForm.permissions, read: checked as boolean },
                      })
                    }
                  />
                  <label htmlFor="perm-read" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Read
                  </label>
                  <span className="text-xs text-muted-foreground">- View data and analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-write"
                    checked={keyForm.permissions.write}
                    onCheckedChange={(checked) =>
                      setKeyForm({
                        ...keyForm,
                        permissions: { ...keyForm.permissions, write: checked as boolean },
                      })
                    }
                  />
                  <label htmlFor="perm-write" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Write
                  </label>
                  <span className="text-xs text-muted-foreground">- Create and update data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-delete"
                    checked={keyForm.permissions.delete}
                    onCheckedChange={(checked) =>
                      setKeyForm({
                        ...keyForm,
                        permissions: { ...keyForm.permissions, delete: checked as boolean },
                      })
                    }
                  />
                  <label htmlFor="perm-delete" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Delete
                  </label>
                  <span className="text-xs text-muted-foreground text-red-500">- Remove data (dangerous)</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleGenerateKey}>
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Key Generated Modal */}
      <Dialog open={newKeyModalOpen} onOpenChange={setNewKeyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Your new API key has been generated. Make sure to copy it now - you won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
              <code className="text-sm text-slate-900 dark:text-gray-100 font-mono break-all">
                {newGeneratedKey}
              </code>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This key will only be shown once. Store it securely and never share it publicly.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="primary"
              onClick={() => {
                handleCopyKey(newGeneratedKey);
                setNewKeyModalOpen(false);
                setNewGeneratedKey('');
              }}
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              Copy & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rotate Key Confirmation Dialog */}
      <AlertDialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rotate API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to rotate &ldquo;{selectedKey?.name}&rdquo;? The current key will be invalidated immediately and a new key will be generated. Any applications using the current key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRotateKey}>
              Rotate Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedKey?.name}&rdquo;? This action cannot be undone and any applications using this key will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteKey}
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
