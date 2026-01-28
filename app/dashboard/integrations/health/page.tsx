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
import { Textarea } from '@/components/shared/ui/textarea';
import { Label } from '@/components/shared/ui/label';
import { toast } from 'sonner';
import {
  HeartPulseIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  RefreshCwIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ActivityIcon,
  ServerIcon,
  DatabaseIcon,
  GlobeIcon,
  ExternalLinkIcon,
  Loader2Icon,
} from 'lucide-react';

interface Service {
  name: string;
  status: string;
  uptime: string;
  responseTime: string;
  lastCheck: string;
  icon: typeof ServerIcon;
}

interface Incident {
  id: string;
  title: string;
  status: string;
  severity: string;
  started: string;
  resolved?: string;
  affected: string[];
  description?: string;
  updates?: { time: string; message: string }[];
}

const initialServices: Service[] = [
  {
    name: 'API Gateway',
    status: 'Operational',
    uptime: '99.99%',
    responseTime: '45ms',
    lastCheck: '30 sec ago',
    icon: ServerIcon,
  },
  {
    name: 'Order Processing',
    status: 'Operational',
    uptime: '99.98%',
    responseTime: '89ms',
    lastCheck: '30 sec ago',
    icon: ActivityIcon,
  },
  {
    name: 'Inventory Sync',
    status: 'Operational',
    uptime: '99.95%',
    responseTime: '156ms',
    lastCheck: '30 sec ago',
    icon: RefreshCwIcon,
  },
  {
    name: 'Database Cluster',
    status: 'Operational',
    uptime: '99.99%',
    responseTime: '12ms',
    lastCheck: '30 sec ago',
    icon: DatabaseIcon,
  },
  {
    name: 'Amazon Integration',
    status: 'Operational',
    uptime: '99.92%',
    responseTime: '234ms',
    lastCheck: '30 sec ago',
    icon: GlobeIcon,
  },
  {
    name: 'Shopify Integration',
    status: 'Operational',
    uptime: '99.96%',
    responseTime: '189ms',
    lastCheck: '30 sec ago',
    icon: GlobeIcon,
  },
  {
    name: 'eBay Integration',
    status: 'Degraded',
    uptime: '98.45%',
    responseTime: '456ms',
    lastCheck: '30 sec ago',
    icon: GlobeIcon,
  },
  {
    name: 'Social Commerce',
    status: 'Operational',
    uptime: '99.89%',
    responseTime: '145ms',
    lastCheck: '30 sec ago',
    icon: GlobeIcon,
  },
];

const initialIncidents: Incident[] = [
  {
    id: 'INC-042',
    title: 'eBay API Rate Limiting',
    status: 'Investigating',
    severity: 'Minor',
    started: '2 hours ago',
    affected: ['eBay Integration'],
    description: 'eBay API is returning rate limit errors more frequently than normal, causing increased latency and occasional sync failures.',
    updates: [
      { time: '2 hours ago', message: 'Issue detected via automated monitoring.' },
      { time: '1 hour ago', message: 'Engineering team investigating root cause.' },
      { time: '30 min ago', message: 'Identified increased request volume from competitor analysis feature.' },
    ],
  },
  {
    id: 'INC-041',
    title: 'Elevated API Latency',
    status: 'Resolved',
    severity: 'Minor',
    started: '14 days ago',
    resolved: '14 days ago',
    affected: ['API Gateway'],
    description: 'API Gateway experienced elevated latency due to a misconfigured load balancer rule.',
    updates: [
      { time: '14 days ago', message: 'Issue detected via automated monitoring.' },
      { time: '14 days ago', message: 'Root cause identified - load balancer misconfiguration.' },
      { time: '14 days ago', message: 'Configuration corrected. Issue resolved.' },
    ],
  },
  {
    id: 'INC-040',
    title: 'Database Maintenance',
    status: 'Resolved',
    severity: 'Maintenance',
    started: '21 days ago',
    resolved: '21 days ago',
    affected: ['Database Cluster'],
    description: 'Scheduled maintenance window for database index optimization and minor version upgrade.',
    updates: [
      { time: '21 days ago', message: 'Maintenance window started.' },
      { time: '21 days ago', message: 'Index optimization completed.' },
      { time: '21 days ago', message: 'Version upgrade completed. All systems operational.' },
    ],
  },
];

const uptimeHistory = [
  { date: 'Today', uptime: 99.97 },
  { date: 'Yesterday', uptime: 100 },
  { date: 'Jan 25', uptime: 100 },
  { date: 'Jan 24', uptime: 99.89 },
  { date: 'Jan 23', uptime: 100 },
  { date: 'Jan 22', uptime: 100 },
  { date: 'Jan 21', uptime: 99.95 },
];

const statusColors: Record<string, { bg: string; text: string; icon: typeof CheckCircleIcon }> = {
  Operational: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', icon: CheckCircleIcon },
  Degraded: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: AlertTriangleIcon },
  Down: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', icon: XCircleIcon },
};

const severityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Major: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Minor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Maintenance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export default function HealthPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [refreshingServices, setRefreshingServices] = useState<Set<string>>(new Set());

  // Modal states
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [incidentDetailOpen, setIncidentDetailOpen] = useState(false);
  const [addUpdateOpen, setAddUpdateOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');

  // Calculate overall health
  const overallHealth = {
    status: services.some(s => s.status === 'Down')
      ? 'Major Outage'
      : services.some(s => s.status === 'Degraded')
        ? 'Partial Outage'
        : 'Operational',
    uptime: '99.97%',
    lastIncident: incidents.find(i => i.status !== 'Resolved')?.started || '14 days ago',
    avgResponseTime: Math.round(
      services.reduce((sum, s) => sum + parseInt(s.responseTime), 0) / services.length
    ) + 'ms',
  };

  const handleRefreshService = (serviceName: string) => {
    setRefreshingServices(prev => new Set(prev).add(serviceName));

    setTimeout(() => {
      setServices(prev => prev.map(s =>
        s.name === serviceName ? { ...s, lastCheck: 'Just now' } : s
      ));
      setRefreshingServices(prev => {
        const next = new Set(prev);
        next.delete(serviceName);
        return next;
      });
      toast.success('Service checked', {
        description: `${serviceName} health check completed.`,
      });
    }, 1500);
  };

  const handleOpenServiceDetail = (service: Service) => {
    setSelectedService(service);
    setServiceDetailOpen(true);
  };

  const handleOpenIncidentDetail = (incident: Incident) => {
    setSelectedIncident(incident);
    setIncidentDetailOpen(true);
  };

  const handleResolveIncident = () => {
    if (!selectedIncident) return;

    setIncidents(prev => prev.map(i =>
      i.id === selectedIncident.id
        ? {
            ...i,
            status: 'Resolved',
            resolved: 'Just now',
            updates: [...(i.updates || []), { time: 'Just now', message: 'Issue resolved and verified.' }],
          }
        : i
    ));

    // Update affected services
    setServices(prev => prev.map(s =>
      selectedIncident.affected.includes(s.name)
        ? { ...s, status: 'Operational' }
        : s
    ));

    setIncidentDetailOpen(false);
    toast.success('Incident resolved', {
      description: `${selectedIncident.id} has been marked as resolved.`,
    });
  };

  const handleAddUpdate = () => {
    if (!selectedIncident || !updateMessage.trim()) return;

    setIncidents(prev => prev.map(i =>
      i.id === selectedIncident.id
        ? {
            ...i,
            updates: [...(i.updates || []), { time: 'Just now', message: updateMessage }],
          }
        : i
    ));

    setSelectedIncident(prev => prev ? {
      ...prev,
      updates: [...(prev.updates || []), { time: 'Just now', message: updateMessage }],
    } : null);

    setUpdateMessage('');
    setAddUpdateOpen(false);
    toast.success('Update posted', {
      description: 'Incident update has been added.',
    });
  };

  return (
    <DashboardLayout
      title="Integration Health"
      subtitle="Monitor the health and performance of all platform integrations."
    >
      {/* Overall Status Banner */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                overallHealth.status === 'Operational'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                <HeartPulseIcon className={`w-8 h-8 ${
                  overallHealth.status === 'Operational'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">All Systems {overallHealth.status}</h2>
                  <Chip variant={overallHealth.status === 'Operational' ? 'success' : 'warning'} size="sm">
                    {overallHealth.status}
                  </Chip>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Last incident: {overallHealth.lastIncident} · Uptime: {overallHealth.uptime}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900 dark:text-gray-100">{overallHealth.avgResponseTime}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Response Time</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Services Status */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Service Status" action={<Chip variant="info" size="sm">Live</Chip>} />
            <div className="p-4 space-y-3">
              {services.map((service) => {
                const StatusIcon = statusColors[service.status]?.icon || CheckCircleIcon;
                const statusStyle = statusColors[service.status] || statusColors.Operational;
                const isRefreshing = refreshingServices.has(service.name);
                return (
                  <div
                    key={service.name}
                    onClick={() => handleOpenServiceDetail(service)}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        service.status === 'Operational'
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        <service.icon className={`w-5 h-5 ${
                          service.status === 'Operational'
                            ? 'text-slate-600 dark:text-slate-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-gray-100">{service.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Checked {service.lastCheck}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{service.uptime}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Uptime</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          parseInt(service.responseTime) > 300
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-900 dark:text-gray-100'
                        }`}>{service.responseTime}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Response</p>
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {service.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefreshService(service.name);
                        }}
                        disabled={isRefreshing}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50"
                      >
                        {isRefreshing ? (
                          <Loader2Icon className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCwIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Uptime History */}
          <Card>
            <CardHeader title="7-Day Uptime" />
            <div className="p-4 space-y-2">
              {uptimeHistory.map((day, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-16">{day.date}</span>
                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                    <div
                      className={`h-full ${day.uptime === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${day.uptime}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium w-14 text-right ${
                    day.uptime === 100 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {day.uptime}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader title="Recent Incidents" />
            <div className="p-4 space-y-3">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => handleOpenIncidentDetail(incident)}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-sm">{incident.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {incident.affected.join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <Chip
                      variant={incident.status === 'Resolved' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {incident.status}
                    </Chip>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{incident.started}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Service Detail Modal */}
      <Dialog open={serviceDetailOpen} onOpenChange={setServiceDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedService?.name}
              <Chip
                variant={selectedService?.status === 'Operational' ? 'success' : 'warning'}
                size="sm"
              >
                {selectedService?.status}
              </Chip>
            </DialogTitle>
            <DialogDescription>
              Detailed health information and metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Uptime</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedService?.uptime}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Response Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedService?.responseTime}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Last 24 Hours</p>
              <div className="flex gap-1">
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-8 rounded ${
                      Math.random() > 0.05 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    title={`${23 - i} hours ago`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>24h ago</span>
                <span>Now</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900 dark:text-gray-100">Recent Checks</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Last check</span>
                  <span className="text-slate-900 dark:text-gray-100">{selectedService?.lastCheck}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Check interval</span>
                  <span className="text-slate-900 dark:text-gray-100">30 seconds</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Timeout threshold</span>
                  <span className="text-slate-900 dark:text-gray-100">5 seconds</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setServiceDetailOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedService) handleRefreshService(selectedService.name);
                setServiceDetailOpen(false);
              }}
            >
              <RefreshCwIcon className="w-4 h-4 mr-1" />
              Run Health Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Incident Detail Modal */}
      <Dialog open={incidentDetailOpen} onOpenChange={setIncidentDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIncident?.id}: {selectedIncident?.title}
            </DialogTitle>
            <DialogDescription>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${severityColors[selectedIncident?.severity || 'Minor']}`}>
                {selectedIncident?.severity}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Status</span>
              <Chip
                variant={selectedIncident?.status === 'Resolved' ? 'success' : 'warning'}
                size="sm"
              >
                {selectedIncident?.status}
              </Chip>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Started</span>
              <span className="text-slate-900 dark:text-gray-100">{selectedIncident?.started}</span>
            </div>
            {selectedIncident?.resolved && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Resolved</span>
                <span className="text-slate-900 dark:text-gray-100">{selectedIncident.resolved}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-slate-600 dark:text-slate-400">Affected Services</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedIncident?.affected.map((service) => (
                  <Chip key={service} variant="neutral" size="sm">{service}</Chip>
                ))}
              </div>
            </div>

            {selectedIncident?.description && (
              <div className="text-sm">
                <span className="text-slate-600 dark:text-slate-400">Description</span>
                <p className="mt-1 text-slate-900 dark:text-gray-100">{selectedIncident.description}</p>
              </div>
            )}

            {selectedIncident?.updates && selectedIncident.updates.length > 0 && (
              <div className="text-sm">
                <span className="text-slate-600 dark:text-slate-400">Timeline</span>
                <div className="mt-2 space-y-3">
                  {selectedIncident.updates.map((update, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                        {index < (selectedIncident.updates?.length || 0) - 1 && (
                          <div className="flex-1 w-px bg-slate-200 dark:bg-slate-700" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{update.time}</p>
                        <p className="text-slate-900 dark:text-gray-100">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIncidentDetailOpen(false)}>
              Close
            </Button>
            {selectedIncident?.status !== 'Resolved' && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setAddUpdateOpen(true)}
                >
                  Add Update
                </Button>
                <Button variant="primary" onClick={handleResolveIncident}>
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Mark Resolved
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Update Modal */}
      <Dialog open={addUpdateOpen} onOpenChange={setAddUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Incident Update</DialogTitle>
            <DialogDescription>
              Post an update to incident {selectedIncident?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="updateMessage">Update Message</Label>
              <Textarea
                id="updateMessage"
                placeholder="Describe the current status or progress..."
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddUpdateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUpdate}>
              Post Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
