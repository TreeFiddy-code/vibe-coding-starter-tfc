'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button } from '@/components/dashboard';
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
import { Textarea } from '@/components/shared/ui/textarea';
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
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  EyeIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  RefreshCwIcon,
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  channel: string;
  items: number;
  total: string;
  status: string;
  date: string;
  shippingMethod: string;
  tracking?: string;
  exceptionReason?: string;
  address?: string;
  products?: { name: string; qty: number; price: string }[];
}

const initialOrders: Order[] = [
  {
    id: 'ORD-8421',
    customer: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    channel: 'Amazon',
    items: 3,
    total: '$127.99',
    status: 'Processing',
    date: '2024-01-27 10:42 AM',
    shippingMethod: 'Express',
    address: '123 Main St, Seattle, WA 98101',
    products: [
      { name: 'Wireless Earbuds', qty: 1, price: '$49.99' },
      { name: 'Phone Case', qty: 2, price: '$78.00' },
    ],
  },
  {
    id: 'ORD-8420',
    customer: 'John Davidson',
    email: 'john.d@email.com',
    channel: 'Shopify',
    items: 1,
    total: '$45.00',
    status: 'Shipped',
    date: '2024-01-27 09:18 AM',
    shippingMethod: 'Standard',
    tracking: 'TRK-892341',
    address: '456 Oak Ave, Portland, OR 97201',
    products: [{ name: 'Bluetooth Speaker', qty: 1, price: '$45.00' }],
  },
  {
    id: 'ORD-8419',
    customer: 'Emily Roberts',
    email: 'emily.r@email.com',
    channel: 'eBay',
    items: 2,
    total: '$89.50',
    status: 'Pending',
    date: '2024-01-27 08:55 AM',
    shippingMethod: 'International',
    address: '789 Pine Rd, London, UK SW1A 1AA',
    products: [
      { name: 'Laptop Stand', qty: 1, price: '$59.50' },
      { name: 'Mouse Pad', qty: 1, price: '$30.00' },
    ],
  },
  {
    id: 'ORD-8418',
    customer: 'Mike Thompson',
    email: 'mike.t@email.com',
    channel: 'Amazon',
    items: 5,
    total: '$234.99',
    status: 'Exception',
    date: '2024-01-26 04:30 PM',
    shippingMethod: 'Express',
    exceptionReason: 'Address verification required',
    address: '321 Elm St Apt 5, Los Angeles, CA 90001',
    products: [
      { name: 'Mechanical Keyboard', qty: 1, price: '$129.99' },
      { name: 'Keycaps', qty: 1, price: '$45.00' },
      { name: 'Wrist Rest', qty: 1, price: '$30.00' },
      { name: 'USB Hub', qty: 2, price: '$30.00' },
    ],
  },
  {
    id: 'ORD-8417',
    customer: 'Lisa Chen',
    email: 'lisa.c@email.com',
    channel: 'Social',
    items: 2,
    total: '$156.00',
    status: 'Delivered',
    date: '2024-01-26 02:15 PM',
    shippingMethod: 'Standard',
    tracking: 'TRK-891234',
    address: '555 Cedar Ln, San Francisco, CA 94102',
    products: [
      { name: 'Smart Watch', qty: 1, price: '$120.00' },
      { name: 'Watch Band', qty: 1, price: '$36.00' },
    ],
  },
  {
    id: 'ORD-8416',
    customer: 'David Park',
    email: 'david.p@email.com',
    channel: 'Shopify',
    items: 1,
    total: '$99.99',
    status: 'Delivered',
    date: '2024-01-26 11:20 AM',
    shippingMethod: 'Express',
    tracking: 'TRK-890567',
    address: '888 Maple Dr, Austin, TX 78701',
    products: [{ name: 'Wireless Charger', qty: 1, price: '$99.99' }],
  },
];

const channelColors: Record<string, string> = {
  Amazon: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Shopify: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  eBay: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

const statusConfig: Record<string, { icon: typeof CheckCircleIcon; color: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = {
  Pending: { icon: ClockIcon, color: 'text-amber-500', variant: 'warning' },
  Processing: { icon: RefreshCwIcon, color: 'text-blue-500', variant: 'info' },
  Shipped: { icon: TruckIcon, color: 'text-purple-500', variant: 'info' },
  Delivered: { icon: CheckCircleIcon, color: 'text-green-500', variant: 'success' },
  Exception: { icon: AlertTriangleIcon, color: 'text-red-500', variant: 'error' },
  Cancelled: { icon: XCircleIcon, color: 'text-slate-500', variant: 'neutral' },
};

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form states
  const [filterForm, setFilterForm] = useState({
    channel: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });
  const [exportFormat, setExportFormat] = useState('csv');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // Calculate stats
  const orderStats = {
    totalOrders: orders.length + 1241,
    pending: orders.filter(o => o.status === 'Pending').length + 40,
    processing: orders.filter(o => o.status === 'Processing').length + 155,
    shipped: orders.filter(o => o.status === 'Shipped').length + 233,
    delivered: orders.filter(o => o.status === 'Delivered').length + 810,
    exceptions: orders.filter(o => o.status === 'Exception').length + 2,
  };

  const handleOpenOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleExport = () => {
    setExportOpen(false);
    toast.success('Export started', {
      description: `Exporting orders as ${exportFormat.toUpperCase()}...`,
    });
  };

  const handleProcessOrder = () => {
    if (!selectedOrder) return;

    setOrders(prev => prev.map(o =>
      o.id === selectedOrder.id
        ? { ...o, status: 'Processing' }
        : o
    ));

    setProcessOpen(false);
    toast.success('Order processed', {
      description: `${selectedOrder.id} is now being processed.`,
    });
  };

  const handleShipOrder = () => {
    if (!selectedOrder || !trackingNumber || !carrier) {
      toast.error('Missing information', {
        description: 'Please provide tracking number and carrier.',
      });
      return;
    }

    setOrders(prev => prev.map(o =>
      o.id === selectedOrder.id
        ? { ...o, status: 'Shipped', tracking: trackingNumber }
        : o
    ));

    setShipOpen(false);
    setTrackingNumber('');
    setCarrier('');
    toast.success('Order shipped', {
      description: `${selectedOrder.id} has been shipped with tracking ${trackingNumber}.`,
    });
  };

  const handleResolveException = () => {
    if (!selectedOrder) return;

    setOrders(prev => prev.map(o =>
      o.id === selectedOrder.id
        ? {
            ...o,
            status: 'Processing',
            exceptionReason: undefined,
            address: newAddress || o.address,
          }
        : o
    ));

    setResolveOpen(false);
    setResolutionNote('');
    setNewAddress('');
    toast.success('Exception resolved', {
      description: `${selectedOrder.id} exception has been resolved and order is now processing.`,
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <DashboardLayout
      title="Order Management"
      subtitle="Track, manage, and fulfill customer orders across all channels."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{orderStats.totalOrders}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{orderStats.pending}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{orderStats.processing}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Processing</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{orderStats.shipped}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Shipped</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{orderStats.delivered}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Delivered</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{orderStats.exceptions}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Exceptions</p>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader
          title="Orders"
          action={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setExportOpen(true)}>
                <DownloadIcon className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)}>
                <FilterIcon className="w-4 h-4 mr-1" />
                Filter
              </Button>
            </div>
          }
        />
        <div className="p-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Exception'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Channel</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || ClockIcon;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900 dark:text-gray-100">{order.id}</p>
                        {order.tracking && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{order.tracking}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900 dark:text-gray-100">{order.customer}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{order.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${channelColors[order.channel]}`}>
                          {order.channel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{order.items}</td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-gray-100">{order.total}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${statusConfig[order.status]?.color}`} />
                          <Chip variant={statusConfig[order.status]?.variant || 'neutral'} size="sm">
                            {order.status}
                          </Chip>
                        </div>
                        {order.exceptionReason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{order.exceptionReason}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{order.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenOrderDetail(order)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {order.status === 'Pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setProcessOpen(true);
                              }}
                            >
                              Process
                            </Button>
                          )}
                          {order.status === 'Processing' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShipOpen(true);
                              }}
                            >
                              Ship
                            </Button>
                          )}
                          {order.status === 'Exception' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewAddress(order.address || '');
                                setResolveOpen(true);
                              }}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order {selectedOrder?.id}
              <Chip variant={statusConfig[selectedOrder?.status || 'Pending']?.variant || 'neutral'} size="sm">
                {selectedOrder?.status}
              </Chip>
            </DialogTitle>
            <DialogDescription>{selectedOrder?.date}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customer</p>
                <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder?.customer}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedOrder?.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedOrder?.total}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Shipping Address</p>
              <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder?.address}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Channel</p>
                <span className={`text-xs px-2 py-1 rounded-full ${channelColors[selectedOrder?.channel || 'Amazon']}`}>
                  {selectedOrder?.channel}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Shipping Method</p>
                <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder?.shippingMethod}</p>
              </div>
              {selectedOrder?.tracking && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tracking</p>
                  <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder.tracking}</p>
                </div>
              )}
            </div>
            {selectedOrder?.exceptionReason && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">Exception</p>
                <p className="text-sm text-red-600 dark:text-red-400">{selectedOrder.exceptionReason}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Order Items</p>
              <div className="space-y-2">
                {selectedOrder?.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{product.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {product.qty}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOrderDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Orders</DialogTitle>
            <DialogDescription>Choose format and options for your export.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Include Fields</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="includeCustomer" defaultChecked />
                <Label htmlFor="includeCustomer" className="font-normal">Customer Information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="includeProducts" defaultChecked />
                <Label htmlFor="includeProducts" className="font-normal">Product Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="includeShipping" defaultChecked />
                <Label htmlFor="includeShipping" className="font-normal">Shipping Information</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setExportOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport}>
              <DownloadIcon className="w-4 h-4 mr-1" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>Apply filters to narrow down your order list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Channel</Label>
              <Select
                value={filterForm.channel}
                onValueChange={(value) => setFilterForm(prev => ({ ...prev, channel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Shopify">Shopify</SelectItem>
                  <SelectItem value="eBay">eBay</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filterForm.dateFrom}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filterForm.dateTo}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Min Amount</Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="$0"
                  value={filterForm.minAmount}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, minAmount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Max Amount</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="$10000"
                  value={filterForm.maxAmount}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, maxAmount: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setFilterForm({ channel: 'all', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '' });
            }}>
              Clear
            </Button>
            <Button variant="primary" onClick={() => {
              setFilterOpen(false);
              toast.success('Filters applied');
            }}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Order Modal */}
      <Dialog open={processOpen} onOpenChange={setProcessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Start processing this order for fulfillment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 dark:text-slate-400">
              This will move the order to &quot;Processing&quot; status. The customer will be notified that their order is being prepared.
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setProcessOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProcessOrder}>
              Start Processing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ship Order Modal */}
      <Dialog open={shipOpen} onOpenChange={setShipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Enter shipping details to mark this order as shipped.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShipOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleShipOrder}>
              <TruckIcon className="w-4 h-4 mr-1" />
              Confirm Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Exception Modal */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Exception</DialogTitle>
            <DialogDescription>
              {selectedOrder?.exceptionReason}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newAddress">Corrected Address (if applicable)</Label>
              <Textarea
                id="newAddress"
                placeholder="Enter corrected shipping address..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolutionNote">Resolution Note</Label>
              <Textarea
                id="resolutionNote"
                placeholder="Describe how this was resolved..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResolveOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResolveException}>
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Resolve & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
