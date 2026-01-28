'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar } from '@/components/dashboard';
import {
  TruckIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PackageIcon,
  PhoneIcon,
  MailIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XIcon,
  GlobeIcon,
  BuildingIcon,
  BarChart3Icon,
  FileTextIcon,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  onTimeRate: number;
  qualityScore: number;
  activeProducts: number;
  pendingOrders: number;
  status: string;
  leadTime: string;
  email?: string;
  phone?: string;
  website?: string;
  category?: string;
  notes?: string;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  total: string;
  status: string;
  eta: string;
  orderDate?: string;
  products?: { name: string; quantity: number; unitPrice: string }[];
}

const supplierStats = {
  totalSuppliers: 47,
  activeSuppliers: 42,
  pendingOrders: 18,
  avgLeadTime: '4.2 days',
};

const initialSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'TechSource Electronics',
    location: 'Shenzhen, China',
    rating: 4.8,
    onTimeRate: 96,
    qualityScore: 98,
    activeProducts: 156,
    pendingOrders: 5,
    status: 'Verified',
    leadTime: '3-5 days',
    email: 'contact@techsource.cn',
    phone: '+86 755 1234 5678',
    website: 'https://techsource.cn',
    category: 'Electronics',
    notes: 'Preferred supplier for smartphone accessories. Excellent quality control.',
  },
  {
    id: 'SUP-002',
    name: 'Premium Leather Co.',
    location: 'Milan, Italy',
    rating: 4.9,
    onTimeRate: 94,
    qualityScore: 99,
    activeProducts: 42,
    pendingOrders: 2,
    status: 'Verified',
    leadTime: '5-7 days',
    email: 'orders@premiumleather.it',
    phone: '+39 02 1234 5678',
    website: 'https://premiumleather.it',
    category: 'Fashion',
    notes: 'Premium leather goods. Higher cost but exceptional quality.',
  },
  {
    id: 'SUP-003',
    name: 'FastShip Accessories',
    location: 'Los Angeles, USA',
    rating: 4.5,
    onTimeRate: 89,
    qualityScore: 92,
    activeProducts: 89,
    pendingOrders: 8,
    status: 'Verified',
    leadTime: '2-3 days',
    email: 'sales@fastship.com',
    phone: '+1 310 555 1234',
    website: 'https://fastship.com',
    category: 'Accessories',
    notes: 'Fast domestic shipping. Good for urgent restocks.',
  },
  {
    id: 'SUP-004',
    name: 'EcoGoods Wholesale',
    location: 'Vancouver, Canada',
    rating: 4.2,
    onTimeRate: 78,
    qualityScore: 85,
    activeProducts: 34,
    pendingOrders: 3,
    status: 'Under Review',
    leadTime: '4-6 days',
    email: 'info@ecogoods.ca',
    phone: '+1 604 555 6789',
    website: 'https://ecogoods.ca',
    category: 'Home & Garden',
    notes: 'Eco-friendly products. Currently reviewing quality issues.',
  },
];

const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-4521',
    supplier: 'TechSource Electronics',
    items: 500,
    total: '$12,450',
    status: 'In Transit',
    eta: '2 days',
    orderDate: '2024-01-20',
    products: [
      { name: 'USB-C Cables', quantity: 200, unitPrice: '$8.50' },
      { name: 'Phone Cases', quantity: 300, unitPrice: '$12.50' },
    ],
  },
  {
    id: 'PO-4520',
    supplier: 'Premium Leather Co.',
    items: 200,
    total: '$8,900',
    status: 'Processing',
    eta: '5 days',
    orderDate: '2024-01-22',
    products: [
      { name: 'Leather Wallets', quantity: 100, unitPrice: '$45.00' },
      { name: 'Leather Belts', quantity: 100, unitPrice: '$44.00' },
    ],
  },
  {
    id: 'PO-4519',
    supplier: 'FastShip Accessories',
    items: 1000,
    total: '$5,200',
    status: 'Delivered',
    eta: '-',
    orderDate: '2024-01-18',
    products: [
      { name: 'Screen Protectors', quantity: 500, unitPrice: '$3.20' },
      { name: 'Earphone Cases', quantity: 500, unitPrice: '$7.20' },
    ],
  },
  {
    id: 'PO-4518',
    supplier: 'TechSource Electronics',
    items: 300,
    total: '$7,800',
    status: 'In Transit',
    eta: '1 day',
    orderDate: '2024-01-19',
    products: [
      { name: 'Wireless Chargers', quantity: 150, unitPrice: '$28.00' },
      { name: 'Power Banks', quantity: 150, unitPrice: '$24.00' },
    ],
  },
];

export default function SupplierManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);

  // Modal states
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [supplierDetailOpen, setSupplierDetailOpen] = useState(false);
  const [contactEmailOpen, setContactEmailOpen] = useState(false);
  const [purchaseOrderDetailOpen, setPurchaseOrderDetailOpen] = useState(false);

  // Selected items
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);

  // Form states
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    leadTime: '',
    notes: '',
  });

  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
  });

  const [filters, setFilters] = useState({
    status: [] as string[],
    category: [] as string[],
    minRating: '',
    location: '',
  });

  // Handlers
  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.email) {
      toast.error('Please fill in required fields');
      return;
    }

    const supplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      name: newSupplier.name,
      location: newSupplier.location,
      email: newSupplier.email,
      phone: newSupplier.phone,
      website: newSupplier.website,
      category: newSupplier.category,
      leadTime: newSupplier.leadTime || '5-7 days',
      notes: newSupplier.notes,
      rating: 0,
      onTimeRate: 0,
      qualityScore: 0,
      activeProducts: 0,
      pendingOrders: 0,
      status: 'Under Review',
    };

    setSuppliers([supplier, ...suppliers]);
    setNewSupplier({
      name: '',
      location: '',
      email: '',
      phone: '',
      website: '',
      category: '',
      leadTime: '',
      notes: '',
    });
    setAddSupplierOpen(false);
    toast.success('Supplier added successfully');
  };

  const handleCallSupplier = (supplier: Supplier) => {
    if (supplier.phone) {
      toast.success(`Initiating call to ${supplier.phone}`);
      // In production, this could use tel: protocol or integrate with a VoIP system
    } else {
      toast.error('No phone number available for this supplier');
    }
  };

  const handleEmailSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEmailForm({
      subject: '',
      message: '',
    });
    setContactEmailOpen(true);
  };

  const handleSendEmail = () => {
    if (!emailForm.subject || !emailForm.message) {
      toast.error('Please fill in subject and message');
      return;
    }
    toast.success(`Email sent to ${selectedSupplier?.email}`);
    setContactEmailOpen(false);
  };

  const handleViewWebsite = (supplier: Supplier) => {
    if (supplier.website) {
      toast.success(`Opening ${supplier.website}`);
      // In production: window.open(supplier.website, '_blank')
    } else {
      toast.error('No website available for this supplier');
    }
  };

  const handleViewSupplierDetail = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierDetailOpen(true);
  };

  const handleViewPurchaseOrder = (order: PurchaseOrder) => {
    setSelectedPurchaseOrder(order);
    setPurchaseOrderDetailOpen(true);
  };

  const handleApplyFilters = () => {
    toast.success('Filters applied');
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [] as string[],
      category: [] as string[],
      minRating: '',
      location: '',
    });
    toast.success('Filters cleared');
  };

  const toggleFilterStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleFilterCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  // Filter suppliers based on search and filters
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status.length === 0 || filters.status.includes(supplier.status);
    const matchesCategory =
      filters.category.length === 0 || (supplier.category && filters.category.includes(supplier.category));
    const matchesRating =
      !filters.minRating || supplier.rating >= parseFloat(filters.minRating);
    const matchesLocation =
      !filters.location ||
      supplier.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory && matchesRating && matchesLocation;
  });

  return (
    <DashboardLayout
      title="Supplier Management"
      subtitle="Manage supplier relationships, purchase orders, and performance tracking."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supplierStats.totalSuppliers}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Suppliers</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supplierStats.activeSuppliers}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Suppliers</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supplierStats.pendingOrders}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending Orders</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{supplierStats.avgLeadTime}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Lead Time</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Suppliers List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Suppliers"
              action={
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setFilterOpen(true)}>
                    <FilterIcon className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setAddSupplierOpen(true)}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Supplier
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
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              {/* Supplier Cards */}
              <div className="space-y-3">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                    onClick={() => handleViewSupplierDetail(supplier)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-gray-100">{supplier.name}</h3>
                          <Chip
                            variant={supplier.status === 'Verified' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {supplier.status}
                          </Chip>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                          <MapPinIcon className="w-3 h-3" />
                          {supplier.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-slate-900 dark:text-gray-100">{supplier.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">On-Time Rate</p>
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{supplier.onTimeRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Quality Score</p>
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{supplier.qualityScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Products</p>
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{supplier.activeProducts}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Lead Time</p>
                        <p className="font-semibold text-slate-900 dark:text-gray-100">{supplier.leadTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {supplier.pendingOrders > 0 && (
                          <Chip variant="info" size="sm">
                            {supplier.pendingOrders} pending orders
                          </Chip>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallSupplier(supplier);
                          }}
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmailSupplier(supplier);
                          }}
                        >
                          <MailIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewWebsite(supplier);
                          }}
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Purchase Orders */}
        <div>
          <Card>
            <CardHeader title="Recent Purchase Orders" />
            <div className="p-4 space-y-3">
              {purchaseOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => handleViewPurchaseOrder(order)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-gray-100">{order.id}</span>
                    <Chip
                      variant={
                        order.status === 'Delivered'
                          ? 'success'
                          : order.status === 'In Transit'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {order.status}
                    </Chip>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{order.supplier}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{order.items} items</span>
                    <span className="font-semibold text-slate-900 dark:text-gray-100">{order.total}</span>
                  </div>
                  {order.eta !== '-' && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <ClockIcon className="w-3 h-3" />
                      ETA: {order.eta}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <Dialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter the details of the new supplier to add to your network.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="supplier-name">Company Name *</Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="e.g., Global Supplies Inc."
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="supplier-location">Location</Label>
                <Input
                  id="supplier-location"
                  value={newSupplier.location}
                  onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                  placeholder="e.g., New York, USA"
                />
              </div>
              <div>
                <Label htmlFor="supplier-email">Email *</Label>
                <Input
                  id="supplier-email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="contact@supplier.com"
                />
              </div>
              <div>
                <Label htmlFor="supplier-phone">Phone</Label>
                <Input
                  id="supplier-phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="supplier-website">Website</Label>
                <Input
                  id="supplier-website"
                  value={newSupplier.website}
                  onChange={(e) => setNewSupplier({ ...newSupplier, website: e.target.value })}
                  placeholder="https://supplier.com"
                />
              </div>
              <div>
                <Label htmlFor="supplier-category">Category</Label>
                <Select
                  value={newSupplier.category}
                  onValueChange={(value) => setNewSupplier({ ...newSupplier, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="supplier-leadtime">Lead Time</Label>
                <Input
                  id="supplier-leadtime"
                  value={newSupplier.leadTime}
                  onChange={(e) => setNewSupplier({ ...newSupplier, leadTime: e.target.value })}
                  placeholder="e.g., 5-7 days"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="supplier-notes">Notes</Label>
                <Textarea
                  id="supplier-notes"
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                  placeholder="Any additional information about this supplier..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddSupplierOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSupplier}>
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Suppliers</DialogTitle>
            <DialogDescription>
              Narrow down your supplier list using the filters below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Status</Label>
              <div className="space-y-2">
                {['Verified', 'Under Review', 'Suspended'].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => toggleFilterStatus(status)}
                    />
                    <Label htmlFor={`status-${status}`} className="font-normal">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Category</Label>
              <div className="space-y-2">
                {['Electronics', 'Fashion', 'Accessories', 'Home & Garden'].map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.category.includes(category)}
                      onCheckedChange={() => toggleFilterCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="min-rating">Minimum Rating</Label>
              <Select
                value={filters.minRating}
                onValueChange={(value) => setFilters({ ...filters, minRating: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4.0">4.0+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                  <SelectItem value="3.0">3.0+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location-filter">Location</Label>
              <Input
                id="location-filter"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Filter by location..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Detail Modal */}
      <Dialog open={supplierDetailOpen} onOpenChange={setSupplierDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BuildingIcon className="w-5 h-5" />
              {selectedSupplier?.name}
            </DialogTitle>
            <DialogDescription>
              Supplier ID: {selectedSupplier?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-6 py-4">
              {/* Status and Rating */}
              <div className="flex items-center gap-4">
                <Chip
                  variant={selectedSupplier.status === 'Verified' ? 'success' : 'warning'}
                >
                  {selectedSupplier.status}
                </Chip>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-semibold">{selectedSupplier.rating}</span>
                  <span className="text-slate-500">/ 5.0</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-slate-400" />
                  <span>{selectedSupplier.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MailIcon className="w-4 h-4 text-slate-400" />
                  <span>{selectedSupplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="w-4 h-4 text-slate-400" />
                  <span>{selectedSupplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GlobeIcon className="w-4 h-4 text-slate-400" />
                  <span>{selectedSupplier.website}</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedSupplier.onTimeRate}%</p>
                  <p className="text-xs text-slate-500">On-Time Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedSupplier.qualityScore}%</p>
                  <p className="text-xs text-slate-500">Quality Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedSupplier.activeProducts}</p>
                  <p className="text-xs text-slate-500">Active Products</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedSupplier.pendingOrders}</p>
                  <p className="text-xs text-slate-500">Pending Orders</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Lead Time: {selectedSupplier.leadTime}</span>
                </div>
                {selectedSupplier.category && (
                  <div className="flex items-center gap-2">
                    <PackageIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">Category: {selectedSupplier.category}</span>
                  </div>
                )}
                {selectedSupplier.notes && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Notes</p>
                    <p className="text-sm">{selectedSupplier.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => handleCallSupplier(selectedSupplier!)}>
              <PhoneIcon className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button variant="secondary" onClick={() => {
              setSupplierDetailOpen(false);
              handleEmailSupplier(selectedSupplier!);
            }}>
              <MailIcon className="w-4 h-4 mr-1" />
              Email
            </Button>
            <Button variant="primary" onClick={() => setSupplierDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Supplier Modal */}
      <Dialog open={contactEmailOpen} onOpenChange={setContactEmailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Email Supplier</DialogTitle>
            <DialogDescription>
              Send an email to {selectedSupplier?.name} ({selectedSupplier?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="e.g., Order inquiry"
              />
            </div>
            <div>
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Type your message here..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setContactEmailOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendEmail}>
              <MailIcon className="w-4 h-4 mr-1" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase Order Detail Modal */}
      <Dialog open={purchaseOrderDetailOpen} onOpenChange={setPurchaseOrderDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5" />
              Purchase Order {selectedPurchaseOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Order details and tracking information
            </DialogDescription>
          </DialogHeader>
          {selectedPurchaseOrder && (
            <div className="space-y-4 py-4">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <Chip
                  variant={
                    selectedPurchaseOrder.status === 'Delivered'
                      ? 'success'
                      : selectedPurchaseOrder.status === 'In Transit'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {selectedPurchaseOrder.status}
                </Chip>
                {selectedPurchaseOrder.eta !== '-' && (
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <ClockIcon className="w-4 h-4" />
                    ETA: {selectedPurchaseOrder.eta}
                  </div>
                )}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500">Supplier</p>
                  <p className="font-semibold">{selectedPurchaseOrder.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Order Date</p>
                  <p className="font-semibold">{selectedPurchaseOrder.orderDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Items</p>
                  <p className="font-semibold">{selectedPurchaseOrder.items}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Value</p>
                  <p className="font-semibold text-primary-600">{selectedPurchaseOrder.total}</p>
                </div>
              </div>

              {/* Products */}
              {selectedPurchaseOrder.products && (
                <div>
                  <p className="text-sm font-semibold mb-2">Products</p>
                  <div className="space-y-2">
                    {selectedPurchaseOrder.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-slate-500">Qty: {product.quantity}</p>
                        </div>
                        <p className="font-semibold">{product.unitPrice}/unit</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setPurchaseOrderDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              toast.success('Order report downloaded');
              setPurchaseOrderDetailOpen(false);
            }}>
              <FileTextIcon className="w-4 h-4 mr-1" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
