'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar, StatTile, StatusPill } from '@/components/dashboard';
import type { OperationStatus } from '@/app/dashboard/data';
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
import { toast } from 'sonner';
import {
  ShoppingBagIcon,
  TrendingUpIcon,
  UsersIcon,
  CreditCardIcon,
  BarChart3Icon,
  RefreshCwIcon,
  PackageIcon,
  TruckIcon,
  EditIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email?: string;
  status: string;
  items: number;
  total: string;
  time: string;
  address?: string;
  products?: { name: string; qty: number; price: string }[];
}

interface Product {
  name: string;
  sales: number;
  revenue: string;
  growth: number;
  sku?: string;
  price?: string;
  inventory?: number;
  description?: string;
}

const initialOrders: Order[] = [
  {
    id: 'SHP-1247',
    customer: 'Sarah M.',
    email: 'sarah.m@email.com',
    status: 'Paid',
    items: 2,
    total: '$189.00',
    time: '5 min ago',
    address: '789 Oak Lane, Chicago, IL 60601',
    products: [
      { name: 'Premium Leather Wallet', qty: 1, price: '$60.00' },
      { name: 'Minimalist Watch', qty: 1, price: '$129.00' },
    ],
  },
  {
    id: 'SHP-1246',
    customer: 'John D.',
    email: 'john.d@email.com',
    status: 'Fulfilled',
    items: 1,
    total: '$75.00',
    time: '18 min ago',
    address: '456 Pine St, Boston, MA 02101',
    products: [{ name: 'Canvas Backpack', qty: 1, price: '$75.00' }],
  },
  {
    id: 'SHP-1245',
    customer: 'Emily R.',
    email: 'emily.r@email.com',
    status: 'Shipped',
    items: 4,
    total: '$342.50',
    time: '45 min ago',
    address: '123 Elm Ave, Austin, TX 78701',
    products: [
      { name: 'Premium Leather Wallet', qty: 2, price: '$120.00' },
      { name: 'Wireless Charger Stand', qty: 2, price: '$80.00' },
      { name: 'Phone Case', qty: 2, price: '$142.50' },
    ],
  },
  {
    id: 'SHP-1244',
    customer: 'Mike T.',
    email: 'mike.t@email.com',
    status: 'Delivered',
    items: 1,
    total: '$99.99',
    time: '2 hours ago',
    address: '321 Maple Dr, Denver, CO 80201',
    products: [{ name: 'Smart Home Hub', qty: 1, price: '$99.99' }],
  },
];

const initialProducts: Product[] = [
  { name: 'Premium Leather Wallet', sales: 142, revenue: '$8,520', growth: 24, sku: 'SHP-PLW-001', price: '$60.00', inventory: 234, description: 'Handcrafted genuine leather wallet with RFID protection.' },
  { name: 'Minimalist Watch', sales: 98, revenue: '$14,700', growth: 18, sku: 'SHP-MW-001', price: '$150.00', inventory: 89, description: 'Elegant minimalist watch with Japanese movement.' },
  { name: 'Canvas Backpack', sales: 87, revenue: '$6,960', growth: -5, sku: 'SHP-CB-001', price: '$80.00', inventory: 156, description: 'Durable canvas backpack with laptop compartment.' },
  { name: 'Wireless Charger Stand', sales: 76, revenue: '$3,040', growth: 32, sku: 'SHP-WCS-001', price: '$40.00', inventory: 312, description: 'Fast wireless charging stand compatible with all Qi devices.' },
];

export default function ShopifyPlatformPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Modal states
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [healthDetailOpen, setHealthDetailOpen] = useState(false);
  const [fulfillOrderOpen, setFulfillOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedHealthMetric, setSelectedHealthMetric] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    inventory: '',
    description: '',
  });

  const shopifyMetrics = {
    totalOrders: orders.length + 419,
    revenue: '$52,891',
    conversionRate: 3.2,
    avgOrderValue: '$125.04',
    totalCustomers: 2847,
    repeatCustomerRate: 28,
  };

  const handleOpenOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleFulfillOrder = () => {
    if (!selectedOrder) return;

    setOrders(prev => prev.map(o =>
      o.id === selectedOrder.id
        ? { ...o, status: 'Fulfilled' }
        : o
    ));

    setFulfillOrderOpen(false);
    setOrderDetailOpen(false);
    toast.success('Order fulfilled', {
      description: `${selectedOrder.id} has been marked as fulfilled.`,
    });
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      price: product.price || '',
      inventory: String(product.inventory || 0),
      description: product.description || '',
    });
    setEditProductOpen(true);
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) return;

    setProducts(prev => prev.map(p =>
      p.name === selectedProduct.name
        ? {
            ...p,
            name: editForm.name,
            price: editForm.price,
            inventory: parseInt(editForm.inventory) || 0,
            description: editForm.description,
          }
        : p
    ));

    setEditProductOpen(false);
    toast.success('Product updated', {
      description: `${editForm.name} has been updated.`,
    });
  };

  const handleOpenHealthDetail = (metric: string) => {
    setSelectedHealthMetric(metric);
    setHealthDetailOpen(true);
  };

  const healthMetrics = {
    'Site Speed': { score: 92, tips: ['Compress images', 'Enable browser caching', 'Minify CSS/JS'] },
    'Mobile Score': { score: 88, tips: ['Optimize touch targets', 'Use responsive images', 'Reduce redirects'] },
    'SEO Score': { score: 76, tips: ['Add meta descriptions', 'Optimize title tags', 'Fix broken links', 'Add alt text to images'] },
    'Uptime': { score: 99.9, tips: ['Monitor server health', 'Use CDN', 'Set up failover'] },
  };

  return (
    <DashboardLayout
      title="Shopify Store"
      subtitle="Monitor your Shopify store performance, orders, and customer analytics."
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatTile
          label="Total Orders"
          value={shopifyMetrics.totalOrders.toLocaleString()}
          icon={<ShoppingBagIcon className="w-4 h-4" />}
          trend={{ value: 15, direction: 'up' }}
        />
        <StatTile
          label="Revenue"
          value={shopifyMetrics.revenue}
          icon={<CreditCardIcon className="w-4 h-4" />}
          trend={{ value: 22, direction: 'up' }}
        />
        <StatTile
          label="Conversion Rate"
          value={`${shopifyMetrics.conversionRate}%`}
          icon={<TrendingUpIcon className="w-4 h-4" />}
          trend={{ value: 0.4, direction: 'up' }}
        />
        <StatTile
          label="Avg Order Value"
          value={shopifyMetrics.avgOrderValue}
          icon={<BarChart3Icon className="w-4 h-4" />}
        />
        <StatTile
          label="Total Customers"
          value={shopifyMetrics.totalCustomers.toLocaleString()}
          icon={<UsersIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Repeat Rate"
          value={`${shopifyMetrics.repeatCustomerRate}%`}
          icon={<RefreshCwIcon className="w-4 h-4" />}
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader title="Recent Orders" action={<Chip variant="success" size="sm">Live</Chip>} />
          <div className="p-4 space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOpenOrderDetail(order)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <ShoppingBagIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100">{order.id}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {order.customer} · {order.items} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-gray-100">{order.total}</p>
                  <StatusPill status={order.status as OperationStatus} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader title="Top Products" action={<Chip variant="neutral" size="sm">This Month</Chip>} />
          <div className="p-4 space-y-3">
            {products.map((product, index) => (
              <div
                key={product.sku}
                onClick={() => handleOpenProductDetail(product)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100">{product.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-gray-100">{product.revenue}</p>
                  <p
                    className={`text-xs ${
                      product.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {product.growth >= 0 ? '+' : ''}
                    {product.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Store Health */}
      <Card>
        <CardHeader title="Store Health" />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(healthMetrics).map(([name, data]) => (
              <div
                key={name}
                onClick={() => handleOpenHealthDetail(name)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{name}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                    {name === 'Uptime' ? `${data.score}%` : `${data.score}/100`}
                  </span>
                </div>
                <ProgressBar value={data.score} variant={data.score >= 80 ? 'success' : 'warning'} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order {selectedOrder?.id}
              <StatusPill status={selectedOrder?.status as OperationStatus} />
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
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedOrder?.email}</p>
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
            {selectedOrder?.status === 'Paid' && (
              <Button variant="primary" onClick={() => setFulfillOrderOpen(true)}>
                <PackageIcon className="w-4 h-4 mr-1" />
                Fulfill Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fulfill Order Confirmation */}
      <Dialog open={fulfillOrderOpen} onOpenChange={setFulfillOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fulfill Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              This will mark the order as fulfilled and notify the customer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 dark:text-slate-400">
              Are you sure you want to fulfill this order for {selectedOrder?.customer}?
            </p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFulfillOrderOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFulfillOrder}>
              Confirm Fulfillment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog open={productDetailOpen} onOpenChange={setProductDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>SKU: {selectedProduct?.sku}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Price</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.price}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Inventory</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.inventory} units</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Sales</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.sales}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Revenue</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.revenue}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Description</p>
              <p className="text-slate-900 dark:text-gray-100">{selectedProduct?.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Growth:</span>
              <span className={`text-sm font-medium ${
                (selectedProduct?.growth || 0) >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {(selectedProduct?.growth || 0) >= 0 ? '+' : ''}{selectedProduct?.growth}%
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setProductDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              setProductDetailOpen(false);
              if (selectedProduct) handleOpenEditProduct(selectedProduct);
            }}>
              <EditIcon className="w-4 h-4 mr-1" />
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information for {selectedProduct?.sku}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productPrice">Price</Label>
                <Input
                  id="productPrice"
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productInventory">Inventory</Label>
                <Input
                  id="productInventory"
                  type="number"
                  value={editForm.inventory}
                  onChange={(e) => setEditForm(prev => ({ ...prev, inventory: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditProductOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProduct}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Health Detail Modal */}
      <Dialog open={healthDetailOpen} onOpenChange={setHealthDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedHealthMetric} Details</DialogTitle>
            <DialogDescription>
              Performance analysis and improvement recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedHealthMetric && (
              <>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Current Score</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                      {selectedHealthMetric === 'Uptime'
                        ? `${healthMetrics[selectedHealthMetric as keyof typeof healthMetrics].score}%`
                        : `${healthMetrics[selectedHealthMetric as keyof typeof healthMetrics].score}/100`
                      }
                    </span>
                  </div>
                  <ProgressBar
                    value={healthMetrics[selectedHealthMetric as keyof typeof healthMetrics].score}
                    variant={healthMetrics[selectedHealthMetric as keyof typeof healthMetrics].score >= 80 ? 'success' : 'warning'}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-2">Improvement Tips</p>
                  <ul className="space-y-2">
                    {healthMetrics[selectedHealthMetric as keyof typeof healthMetrics].tips.map((tip, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setHealthDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              toast.success('Running optimization', {
                description: `Analyzing ${selectedHealthMetric} improvements...`,
              });
              setHealthDetailOpen(false);
            }}>
              <SettingsIcon className="w-4 h-4 mr-1" />
              Run Optimization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
