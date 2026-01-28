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
  PackageIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  ImageIcon,
  BarChart3Icon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
  channels: string[];
  sales: number;
  description?: string;
  category?: string;
}

const initialProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'Wireless Earbuds Pro',
    sku: 'WEP-2024',
    price: '$89.99',
    stock: 234,
    status: 'Active',
    channels: ['Amazon', 'Shopify'],
    sales: 1247,
    description: 'Premium wireless earbuds with active noise cancellation.',
    category: 'Electronics',
  },
  {
    id: 'PRD-002',
    name: 'USB-C Hub 7-in-1',
    sku: 'UCH-7IN1',
    price: '$45.99',
    stock: 0,
    status: 'Out of Stock',
    channels: ['Amazon', 'eBay'],
    sales: 892,
    description: '7-port USB-C hub with HDMI and SD card reader.',
    category: 'Electronics',
  },
  {
    id: 'PRD-003',
    name: 'Minimalist Leather Wallet',
    sku: 'MLW-BLK',
    price: '$59.99',
    stock: 156,
    status: 'Active',
    channels: ['Shopify', 'Social'],
    sales: 634,
    description: 'Handcrafted genuine leather wallet with RFID protection.',
    category: 'Accessories',
  },
  {
    id: 'PRD-004',
    name: 'Phone Stand Adjustable',
    sku: 'PSA-ALU',
    price: '$24.99',
    stock: 8,
    status: 'Low Stock',
    channels: ['Amazon', 'Shopify', 'eBay'],
    sales: 1821,
    description: 'Aluminum phone stand with adjustable viewing angles.',
    category: 'Accessories',
  },
  {
    id: 'PRD-005',
    name: 'Portable Power Bank 20K',
    sku: 'PPB-20K',
    price: '$49.99',
    stock: 342,
    status: 'Active',
    channels: ['Amazon'],
    sales: 567,
    description: '20000mAh power bank with fast charging support.',
    category: 'Electronics',
  },
];

const channelColors: Record<string, string> = {
  Amazon: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Shopify: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  eBay: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    channels: [] as string[],
  });

  const productStats = {
    totalProducts: products.length + 1238,
    activeListings: products.filter(p => p.status === 'Active').length + 1175,
    outOfStock: products.filter(p => p.status === 'Out of Stock').length + 22,
    lowStock: products.filter(p => p.status === 'Low Stock').length + 44,
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.sku || !productForm.price) {
      toast.error('Missing information', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const newProduct: Product = {
      id: `PRD-${String(products.length + 6).padStart(3, '0')}`,
      name: productForm.name,
      sku: productForm.sku,
      price: productForm.price.startsWith('$') ? productForm.price : `$${productForm.price}`,
      stock: parseInt(productForm.stock) || 0,
      status: parseInt(productForm.stock) === 0 ? 'Out of Stock' : parseInt(productForm.stock) < 10 ? 'Low Stock' : 'Active',
      channels: productForm.channels,
      sales: 0,
      description: productForm.description,
      category: productForm.category,
    };

    setProducts(prev => [newProduct, ...prev]);
    setAddProductOpen(false);
    setProductForm({ name: '', sku: '', price: '', stock: '', description: '', category: '', channels: [] });
    toast.success('Product added', {
      description: `${newProduct.name} has been added to your catalog.`,
    });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    setProducts(prev => prev.map(p =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: productForm.name,
            price: productForm.price.startsWith('$') ? productForm.price : `$${productForm.price}`,
            stock: parseInt(productForm.stock) || 0,
            status: parseInt(productForm.stock) === 0 ? 'Out of Stock' : parseInt(productForm.stock) < 10 ? 'Low Stock' : 'Active',
            description: productForm.description,
            category: productForm.category,
            channels: productForm.channels,
          }
        : p
    ));

    setEditProductOpen(false);
    toast.success('Product updated', {
      description: `${productForm.name} has been updated.`,
    });
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    setDeleteOpen(false);
    toast.success('Product deleted', {
      description: `${selectedProduct.name} has been removed from your catalog.`,
    });
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      sku: product.sku,
      price: product.price.replace('$', ''),
      stock: String(product.stock),
      description: product.description || '',
      category: product.category || '',
      channels: product.channels,
    });
    setEditProductOpen(true);
  };

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout
      title="Product Management"
      subtitle="Manage your product catalog, inventory, and multi-channel listings."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{productStats.totalProducts}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Products</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{productStats.activeListings}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Listings</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{productStats.outOfStock}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Out of Stock</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{productStats.lowStock}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Product List */}
      <Card>
        <CardHeader
          title="Products"
          action={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)}>
                <FilterIcon className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <Button variant="primary" size="sm" onClick={() => {
                setProductForm({ name: '', sku: '', price: '', stock: '', description: '', category: '', channels: [] });
                setAddProductOpen(true);
              }}>
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </div>
          }
        />
        <div className="p-4">
          {/* Search */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Channels</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Sales</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-gray-100">{product.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{product.sku}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-gray-100">{product.price}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{product.stock}</td>
                    <td className="py-3 px-4">
                      <Chip
                        variant={
                          product.status === 'Active'
                            ? 'success'
                            : product.status === 'Low Stock'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      >
                        {product.status}
                      </Chip>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.channels.map((channel) => (
                          <span
                            key={channel}
                            className={`text-xs px-2 py-0.5 rounded-full ${channelColors[channel]}`}
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{product.sales}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setAnalyticsOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        >
                          <BarChart3Icon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Add a new product to your catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={productForm.sku}
                  onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  placeholder="$0.00"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-3">
              <Label>Channels</Label>
              {['Amazon', 'Shopify', 'eBay', 'Social'].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={`channel-${channel}`}
                    checked={productForm.channels.includes(channel)}
                    onCheckedChange={(checked) => {
                      setProductForm(prev => ({
                        ...prev,
                        channels: checked
                          ? [...prev.channels, channel]
                          : prev.channels.filter(c => c !== channel),
                      }));
                    }}
                  />
                  <Label htmlFor={`channel-${channel}`} className="font-normal">{channel}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddProductOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information for {selectedProduct?.sku}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Product Name</Label>
                <Input
                  id="editName"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPrice">Price</Label>
                <Input
                  id="editPrice"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStock">Stock</Label>
                <Input
                  id="editStock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategory">Category</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-3">
              <Label>Channels</Label>
              {['Amazon', 'Shopify', 'eBay', 'Social'].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-channel-${channel}`}
                    checked={productForm.channels.includes(channel)}
                    onCheckedChange={(checked) => {
                      setProductForm(prev => ({
                        ...prev,
                        channels: checked
                          ? [...prev.channels, channel]
                          : prev.channels.filter(c => c !== channel),
                      }));
                    }}
                  />
                  <Label htmlFor={`edit-channel-${channel}`} className="font-normal">{channel}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditProductOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditProduct}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Analytics</DialogTitle>
            <DialogDescription>{selectedProduct?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Sales</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.sales}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Revenue</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${((selectedProduct?.sales || 0) * parseFloat((selectedProduct?.price || '$0').replace('$', ''))).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Stock</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.stock}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Channels</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedProduct?.channels.length}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Sales Trend (Last 7 Days)</p>
              <div className="flex items-end gap-1 h-20">
                {[65, 80, 45, 90, 75, 85, 95].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-primary-500 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAnalyticsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>Apply filters to narrow down your product list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Channels</Label>
              {['Amazon', 'Shopify', 'eBay', 'Social'].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox id={`filter-${channel}`} />
                  <Label htmlFor={`filter-${channel}`} className="font-normal">{channel}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFilterOpen(false)}>
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

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
