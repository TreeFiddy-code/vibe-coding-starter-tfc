'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar } from '@/components/dashboard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
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
import {
  PlugIcon,
  PlusIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  RefreshCwIcon,
  SettingsIcon,
  ExternalLinkIcon,
  ShoppingCartIcon,
  StoreIcon,
  BoxIcon,
  UsersIcon,
  Loader2Icon,
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: typeof StoreIcon;
  status: string;
  health: string;
  lastSync: string;
  ordersSync: boolean;
  inventorySync: boolean;
  priceSync: boolean;
  apiCalls: string;
  color: string;
}

interface AvailableIntegration {
  name: string;
  category: string;
  popular: boolean;
}

const initialPlatforms: Platform[] = [
  {
    id: 'amazon',
    name: 'Amazon Seller Central',
    icon: StoreIcon,
    status: 'Connected',
    health: 'Healthy',
    lastSync: '2 min ago',
    ordersSync: true,
    inventorySync: true,
    priceSync: true,
    apiCalls: '2,341 / 10,000',
    color: 'bg-orange-500',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: ShoppingCartIcon,
    status: 'Connected',
    health: 'Healthy',
    lastSync: '5 min ago',
    ordersSync: true,
    inventorySync: true,
    priceSync: true,
    apiCalls: '1,823 / 10,000',
    color: 'bg-green-500',
  },
  {
    id: 'ebay',
    name: 'eBay',
    icon: BoxIcon,
    status: 'Connected',
    health: 'Degraded',
    lastSync: '15 min ago',
    ordersSync: true,
    inventorySync: true,
    priceSync: false,
    apiCalls: '7,234 / 10,000',
    color: 'bg-blue-500',
  },
  {
    id: 'social',
    name: 'Social Commerce',
    icon: UsersIcon,
    status: 'Connected',
    health: 'Healthy',
    lastSync: '8 min ago',
    ordersSync: true,
    inventorySync: false,
    priceSync: false,
    apiCalls: '456 / 10,000',
    color: 'bg-pink-500',
  },
];

const availableIntegrations: AvailableIntegration[] = [
  { name: 'WooCommerce', category: 'E-commerce', popular: true },
  { name: 'BigCommerce', category: 'E-commerce', popular: true },
  { name: 'Walmart Marketplace', category: 'Marketplace', popular: true },
  { name: 'Etsy', category: 'Marketplace', popular: false },
  { name: 'Google Shopping', category: 'Advertising', popular: true },
  { name: 'Meta Commerce', category: 'Social', popular: true },
];

const healthColors: Record<string, { bg: string; text: string; icon: typeof CheckCircleIcon }> = {
  Healthy: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: CheckCircleIcon },
  Degraded: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: AlertTriangleIcon },
  Down: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', icon: XCircleIcon },
};

export default function IntegrationsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [syncingPlatforms, setSyncingPlatforms] = useState<Set<string>>(new Set());

  // Modal states
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectIntegrationOpen, setConnectIntegrationOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedNewIntegration, setSelectedNewIntegration] = useState<AvailableIntegration | null>(null);

  // Form states for settings
  const [settingsForm, setSettingsForm] = useState({
    ordersSync: true,
    inventorySync: true,
    priceSync: true,
    syncInterval: '5',
    alertOnError: true,
    autoRetry: true,
  });

  // Form states for new integration connection
  const [connectionForm, setConnectionForm] = useState({
    apiKey: '',
    apiSecret: '',
    storeUrl: '',
    enableOrderSync: true,
    enableInventorySync: true,
    enablePriceSync: false,
  });

  // Calculate stats
  const integrationStats = {
    totalConnected: platforms.length,
    healthy: platforms.filter(p => p.health === 'Healthy').length,
    degraded: platforms.filter(p => p.health === 'Degraded').length,
    lastSync: platforms.reduce((earliest, p) => {
      const mins = parseInt(p.lastSync) || 0;
      const earliestMins = parseInt(earliest) || 0;
      return mins < earliestMins ? p.lastSync : earliest;
    }, platforms[0]?.lastSync || 'N/A'),
  };

  const handleRefreshSync = (platformId: string) => {
    setSyncingPlatforms(prev => new Set(prev).add(platformId));

    // Simulate sync
    setTimeout(() => {
      setPlatforms(prev => prev.map(p =>
        p.id === platformId
          ? { ...p, lastSync: 'Just now', health: 'Healthy' }
          : p
      ));
      setSyncingPlatforms(prev => {
        const next = new Set(prev);
        next.delete(platformId);
        return next;
      });
      toast.success('Sync completed', {
        description: `${platforms.find(p => p.id === platformId)?.name} has been synced successfully.`,
      });
    }, 2000);
  };

  const handleOpenSettings = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSettingsForm({
      ordersSync: platform.ordersSync,
      inventorySync: platform.inventorySync,
      priceSync: platform.priceSync,
      syncInterval: '5',
      alertOnError: true,
      autoRetry: true,
    });
    setSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    if (!selectedPlatform) return;

    setPlatforms(prev => prev.map(p =>
      p.id === selectedPlatform.id
        ? {
            ...p,
            ordersSync: settingsForm.ordersSync,
            inventorySync: settingsForm.inventorySync,
            priceSync: settingsForm.priceSync,
          }
        : p
    ));

    setSettingsOpen(false);
    toast.success('Settings saved', {
      description: `${selectedPlatform.name} settings have been updated.`,
    });
  };

  const handleConnectIntegration = (integration: AvailableIntegration) => {
    setSelectedNewIntegration(integration);
    setConnectionForm({
      apiKey: '',
      apiSecret: '',
      storeUrl: '',
      enableOrderSync: true,
      enableInventorySync: true,
      enablePriceSync: false,
    });
    setConnectIntegrationOpen(true);
  };

  const handleSubmitConnection = () => {
    if (!selectedNewIntegration) return;
    if (!connectionForm.apiKey || !connectionForm.apiSecret) {
      toast.error('Missing credentials', {
        description: 'Please provide both API Key and API Secret.',
      });
      return;
    }

    // Add new platform
    const newPlatform: Platform = {
      id: selectedNewIntegration.name.toLowerCase().replace(/\s+/g, '-'),
      name: selectedNewIntegration.name,
      icon: PlugIcon,
      status: 'Connected',
      health: 'Healthy',
      lastSync: 'Just now',
      ordersSync: connectionForm.enableOrderSync,
      inventorySync: connectionForm.enableInventorySync,
      priceSync: connectionForm.enablePriceSync,
      apiCalls: '0 / 10,000',
      color: 'bg-purple-500',
    };

    setPlatforms(prev => [...prev, newPlatform]);
    setConnectIntegrationOpen(false);
    toast.success('Integration connected', {
      description: `${selectedNewIntegration.name} has been connected successfully.`,
    });
  };

  return (
    <DashboardLayout
      title="Integration Portal"
      subtitle="Connect and manage your e-commerce platform integrations."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <PlugIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{integrationStats.totalConnected}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Connected</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{integrationStats.healthy}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Healthy</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{integrationStats.degraded}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Degraded</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <RefreshCwIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{integrationStats.lastSync}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last Sync</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Connected Platforms */}
      <Card>
        <CardHeader
          title="Connected Platforms"
          action={
            <Button variant="primary" size="sm" onClick={() => setAddIntegrationOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Integration
            </Button>
          }
        />
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const HealthIcon = healthColors[platform.health]?.icon || CheckCircleIcon;
            const healthStyle = healthColors[platform.health] || healthColors.Healthy;
            const isSyncing = syncingPlatforms.has(platform.id);
            return (
              <div
                key={platform.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${platform.color} flex items-center justify-center`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-gray-100">{platform.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${healthStyle.bg} ${healthStyle.text}`}>
                          <HealthIcon className="w-3 h-3" />
                          {platform.health}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Synced {platform.lastSync}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50"
                      onClick={() => handleRefreshSync(platform.id)}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCwIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                      onClick={() => handleOpenSettings(platform)}
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Sync Status</span>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 ${platform.ordersSync ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                        <CheckCircleIcon className="w-3 h-3" /> Orders
                      </span>
                      <span className={`flex items-center gap-1 ${platform.inventorySync ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                        <CheckCircleIcon className="w-3 h-3" /> Inventory
                      </span>
                      <span className={`flex items-center gap-1 ${platform.priceSync ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                        <CheckCircleIcon className="w-3 h-3" /> Prices
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">API Usage</span>
                      <span className="text-slate-900 dark:text-gray-100">{platform.apiCalls}</span>
                    </div>
                    <ProgressBar
                      value={parseInt(platform.apiCalls.split(' / ')[0].replace(',', '')) / 100}
                      variant={parseInt(platform.apiCalls.split(' / ')[0].replace(',', '')) > 7000 ? 'warning' : 'success'}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader title="Available Integrations" />
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {availableIntegrations.map((integration) => (
              <button
                key={integration.name}
                onClick={() => handleConnectIntegration(integration)}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <PlugIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  {integration.popular && (
                    <Chip variant="info" size="sm">Popular</Chip>
                  )}
                </div>
                <p className="font-medium text-slate-900 dark:text-gray-100 text-sm">{integration.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{integration.category}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Add Integration Modal */}
      <Dialog open={addIntegrationOpen} onOpenChange={setAddIntegrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
            <DialogDescription>
              Select a platform to connect to your OmniCart account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {availableIntegrations.map((integration) => (
              <button
                key={integration.name}
                onClick={() => {
                  setAddIntegrationOpen(false);
                  handleConnectIntegration(integration);
                }}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <PlugIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  {integration.popular && (
                    <Chip variant="info" size="sm">Popular</Chip>
                  )}
                </div>
                <p className="font-medium text-slate-900 dark:text-gray-100">{integration.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{integration.category}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Platform Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPlatform?.name} Settings</DialogTitle>
            <DialogDescription>
              Configure sync options and notifications for this integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Sync Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ordersSync"
                  checked={settingsForm.ordersSync}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, ordersSync: !!checked }))}
                />
                <Label htmlFor="ordersSync" className="font-normal">Sync Orders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inventorySync"
                  checked={settingsForm.inventorySync}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, inventorySync: !!checked }))}
                />
                <Label htmlFor="inventorySync" className="font-normal">Sync Inventory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priceSync"
                  checked={settingsForm.priceSync}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, priceSync: !!checked }))}
                />
                <Label htmlFor="priceSync" className="font-normal">Sync Prices</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="syncInterval">Sync Interval</Label>
              <Select
                value={settingsForm.syncInterval}
                onValueChange={(value) => setSettingsForm(prev => ({ ...prev, syncInterval: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Notifications</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alertOnError"
                  checked={settingsForm.alertOnError}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, alertOnError: !!checked }))}
                />
                <Label htmlFor="alertOnError" className="font-normal">Alert on sync errors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoRetry"
                  checked={settingsForm.autoRetry}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, autoRetry: !!checked }))}
                />
                <Label htmlFor="autoRetry" className="font-normal">Auto-retry failed syncs</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect Integration Modal */}
      <Dialog open={connectIntegrationOpen} onOpenChange={setConnectIntegrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedNewIntegration?.name}</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect this platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={connectionForm.apiKey}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret *</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your API secret"
                value={connectionForm.apiSecret}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, apiSecret: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeUrl">Store URL (optional)</Label>
              <Input
                id="storeUrl"
                placeholder="https://your-store.com"
                value={connectionForm.storeUrl}
                onChange={(e) => setConnectionForm(prev => ({ ...prev, storeUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Enable Sync Features</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableOrderSync"
                  checked={connectionForm.enableOrderSync}
                  onCheckedChange={(checked) => setConnectionForm(prev => ({ ...prev, enableOrderSync: !!checked }))}
                />
                <Label htmlFor="enableOrderSync" className="font-normal">Order Sync</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableInventorySync"
                  checked={connectionForm.enableInventorySync}
                  onCheckedChange={(checked) => setConnectionForm(prev => ({ ...prev, enableInventorySync: !!checked }))}
                />
                <Label htmlFor="enableInventorySync" className="font-normal">Inventory Sync</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enablePriceSync"
                  checked={connectionForm.enablePriceSync}
                  onCheckedChange={(checked) => setConnectionForm(prev => ({ ...prev, enablePriceSync: !!checked }))}
                />
                <Label htmlFor="enablePriceSync" className="font-normal">Price Sync</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConnectIntegrationOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitConnection}>
              Connect Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
