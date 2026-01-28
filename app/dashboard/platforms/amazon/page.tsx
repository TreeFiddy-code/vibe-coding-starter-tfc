'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar, StatTile, StatusPill } from '@/components/dashboard';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { toast } from 'sonner';
import {
  PackageIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  TruckIcon,
  XIcon,
  RefreshCwIcon,
} from 'lucide-react';

interface Order {
  id: string;
  status: string;
  items: number;
  total: string;
  time: string;
  customer?: string;
  address?: string;
  products?: { name: string; qty: number; price: string }[];
}

interface InventoryAlert {
  sku: string;
  name: string;
  stock: number;
  threshold: number;
  status: string;
}

const initialOrders: Order[] = [
  {
    id: 'AMZ-8421',
    status: 'Processing',
    items: 3,
    total: '$127.99',
    time: '12 min ago',
    customer: 'John Smith',
    address: '123 Main St, Seattle, WA 98101',
    products: [
      { name: 'Wireless Earbuds Pro', qty: 1, price: '$49.99' },
      { name: 'USB-C Charging Cable', qty: 2, price: '$39.00' },
      { name: 'Phone Case Clear', qty: 1, price: '$39.00' },
    ],
  },
  {
    id: 'AMZ-8420',
    status: 'Shipped',
    items: 1,
    total: '$45.00',
    time: '28 min ago',
    customer: 'Sarah Johnson',
    address: '456 Oak Ave, Portland, OR 97201',
    products: [{ name: 'Bluetooth Speaker', qty: 1, price: '$45.00' }],
  },
  {
    id: 'AMZ-8419',
    status: 'Delivered',
    items: 2,
    total: '$89.50',
    time: '1 hour ago',
    customer: 'Mike Wilson',
    address: '789 Pine Rd, San Francisco, CA 94102',
    products: [
      { name: 'Laptop Stand', qty: 1, price: '$59.50' },
      { name: 'Mouse Pad XL', qty: 1, price: '$30.00' },
    ],
  },
  {
    id: 'AMZ-8418',
    status: 'Processing',
    items: 5,
    total: '$234.99',
    time: '2 hours ago',
    customer: 'Emily Davis',
    address: '321 Elm St, Los Angeles, CA 90001',
    products: [
      { name: 'Mechanical Keyboard', qty: 1, price: '$129.99' },
      { name: 'Keycap Set', qty: 1, price: '$45.00' },
      { name: 'Wrist Rest', qty: 1, price: '$30.00' },
      { name: 'USB Hub', qty: 2, price: '$30.00' },
    ],
  },
];

const initialAlerts: InventoryAlert[] = [
  { sku: 'AMZ-PRD-001', name: 'Wireless Earbuds Pro', stock: 12, threshold: 50, status: 'low' },
  { sku: 'AMZ-PRD-042', name: 'USB-C Hub 7-in-1', stock: 0, threshold: 25, status: 'out' },
  { sku: 'AMZ-PRD-089', name: 'Phone Stand Adjustable', stock: 8, threshold: 30, status: 'low' },
];

export default function AmazonPlatformPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [alerts, setAlerts] = useState<InventoryAlert[]>(initialAlerts);

  // Modal states
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [dismissAlertOpen, setDismissAlertOpen] = useState(false);
  const [shipOrderOpen, setShipOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<InventoryAlert | null>(null);

  // Form states
  const [restockQuantity, setRestockQuantity] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');

  const amazonMetrics = {
    totalOrders: orders.length + 843,
    revenue: '$78,432',
    fulfillmentRate: 94,
    returnRate: 2.3,
    avgOrderValue: '$92.54',
    activeListings: 1243,
  };

  const handleOpenOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
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
        ? { ...o, status: 'Shipped' }
        : o
    ));

    setShipOrderOpen(false);
    setOrderDetailOpen(false);
    setTrackingNumber('');
    setCarrier('');
    toast.success('Order shipped', {
      description: `${selectedOrder.id} has been marked as shipped with tracking ${trackingNumber}.`,
    });
  };

  const handleOpenRestock = (alert: InventoryAlert) => {
    setSelectedAlert(alert);
    setRestockQuantity('');
    setRestockOpen(true);
  };

  const handleSubmitRestock = () => {
    if (!selectedAlert || !restockQuantity || parseInt(restockQuantity) <= 0) {
      toast.error('Invalid quantity', {
        description: 'Please enter a valid restock quantity.',
      });
      return;
    }

    const newStock = selectedAlert.stock + parseInt(restockQuantity);

    if (newStock >= selectedAlert.threshold) {
      // Remove alert if stock is now above threshold
      setAlerts(prev => prev.filter(a => a.sku !== selectedAlert.sku));
    } else {
      // Update stock level
      setAlerts(prev => prev.map(a =>
        a.sku === selectedAlert.sku
          ? { ...a, stock: newStock, status: newStock > 0 ? 'low' : 'out' }
          : a
      ));
    }

    setRestockOpen(false);
    toast.success('Restock submitted', {
      description: `Added ${restockQuantity} units to ${selectedAlert.name}.`,
    });
  };

  const handleDismissAlert = () => {
    if (!selectedAlert) return;

    setAlerts(prev => prev.filter(a => a.sku !== selectedAlert.sku));
    setDismissAlertOpen(false);
    toast.success('Alert dismissed', {
      description: `Alert for ${selectedAlert.name} has been dismissed.`,
    });
  };

  return (
    <DashboardLayout
      title="Amazon Seller Central"
      subtitle="Manage your Amazon marketplace operations, inventory, and fulfillment."
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatTile
          label="Total Orders"
          value={amazonMetrics.totalOrders.toLocaleString()}
          icon={<ShoppingCartIcon className="w-4 h-4" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatTile
          label="Revenue"
          value={amazonMetrics.revenue}
          icon={<DollarSignIcon className="w-4 h-4" />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatTile
          label="Fulfillment Rate"
          value={`${amazonMetrics.fulfillmentRate}%`}
          icon={<PackageIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Return Rate"
          value={`${amazonMetrics.returnRate}%`}
          icon={<TrendingUpIcon className="w-4 h-4" />}
          trend={{ value: 0.5, direction: 'down' }}
        />
        <StatTile
          label="Avg Order Value"
          value={amazonMetrics.avgOrderValue}
          icon={<BarChart3Icon className="w-4 h-4" />}
        />
        <StatTile
          label="Active Listings"
          value={amazonMetrics.activeListings.toLocaleString()}
          icon={<CheckCircleIcon className="w-4 h-4" />}
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader title="Recent Orders" action={<Chip variant="info" size="sm">Live</Chip>} />
          <div className="p-4 space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOpenOrderDetail(order)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <PackageIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100">{order.id}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {order.items} items · {order.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-gray-100">{order.total}</p>
                  <StatusPill status={order.status as 'Processing' | 'Shipped' | 'Delivered'} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader
            title="Inventory Alerts"
            action={
              <Chip variant="warning" size="sm">
                {alerts.length} alerts
              </Chip>
            }
          />
          <div className="p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No inventory alerts</p>
              </div>
            ) : (
              alerts.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.status === 'out'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}
                    >
                      <AlertTriangleIcon
                        className={`w-5 h-5 ${
                          item.status === 'out'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-gray-100">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          item.status === 'out'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.stock} / {item.threshold}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenRestock(item)}
                        className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                        title="Restock"
                      >
                        <RefreshCwIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAlert(item);
                          setDismissAlertOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        title="Dismiss"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader title="Performance Overview" />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Buy Box Win Rate</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">87%</span>
              </div>
              <ProgressBar value={87} variant="success" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Account Health</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">96%</span>
              </div>
              <ProgressBar value={96} variant="success" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Seller Rating</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">4.8/5</span>
              </div>
              <ProgressBar value={96} variant="success" />
            </div>
          </div>
        </div>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order {selectedOrder?.id}
              <StatusPill status={selectedOrder?.status as 'Processing' | 'Shipped' | 'Delivered'} />
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customer</p>
                <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder?.customer}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder?.total}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Shipping Address</p>
              <p className="font-medium text-slate-900 dark:text-gray-100">{selectedOrder?.address}</p>
            </div>

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
            {selectedOrder?.status === 'Processing' && (
              <Button variant="primary" onClick={() => setShipOrderOpen(true)}>
                <TruckIcon className="w-4 h-4 mr-1" />
                Ship Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ship Order Modal */}
      <Dialog open={shipOrderOpen} onOpenChange={setShipOrderOpen}>
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
                  <SelectItem value="amazon">Amazon Logistics</SelectItem>
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
            <Button variant="secondary" onClick={() => setShipOrderOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleShipOrder}>
              Confirm Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Modal */}
      <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock {selectedAlert?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedAlert?.stock} / Threshold: {selectedAlert?.threshold}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Restock Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity to add"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                min="1"
              />
              {restockQuantity && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  New stock level: {(selectedAlert?.stock || 0) + parseInt(restockQuantity || '0')}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRestockOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitRestock}>
              Submit Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Alert Confirmation */}
      <AlertDialog open={dismissAlertOpen} onOpenChange={setDismissAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dismiss Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to dismiss the alert for {selectedAlert?.name}? This won&apos;t change the inventory levels.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDismissAlert}>Dismiss</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
