'use client';

import { useState } from 'react';
import { DashboardLayout, Card, CardHeader, Chip, Button, ProgressBar, StatTile } from '@/components/dashboard';
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
import { toast } from 'sonner';
import {
  GavelIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  DollarSignIcon,
  ClockIcon,
  TagIcon,
  StarIcon,
  CheckCircleIcon,
  XIcon,
  SettingsIcon,
  EyeIcon,
} from 'lucide-react';

interface Auction {
  id: string;
  title: string;
  bids: number;
  current: string;
  ends: string;
  startPrice?: string;
  description?: string;
  watchers?: number;
}

interface PerformanceIssue {
  id: string;
  type: string;
  count: number;
  impact: string;
  action: string;
  details?: string;
}

const initialAuctions: Auction[] = [
  { id: 'EBY-4521', title: 'Vintage Camera Collection', bids: 12, current: '$245.00', ends: '2h 14m', startPrice: '$50.00', description: 'Rare vintage camera collection including Polaroid and Kodak models.', watchers: 45 },
  { id: 'EBY-4520', title: 'Rare Comic Book Set', bids: 8, current: '$189.00', ends: '4h 30m', startPrice: '$25.00', description: 'First edition comic books from the 1960s in excellent condition.', watchers: 32 },
  { id: 'EBY-4519', title: 'Antique Watch', bids: 15, current: '$520.00', ends: '6h 45m', startPrice: '$100.00', description: 'Swiss-made antique pocket watch from 1920s, fully functional.', watchers: 67 },
  { id: 'EBY-4518', title: 'Collectible Figurines', bids: 5, current: '$78.00', ends: '12h 20m', startPrice: '$30.00', description: 'Limited edition porcelain figurines, complete set of 5.', watchers: 18 },
];

const initialIssues: PerformanceIssue[] = [
  { id: 'ISS-001', type: 'Late Shipment', count: 3, impact: 'Medium', action: 'Ship within 24h', details: 'Orders #1234, #1235, #1236 were shipped after the expected handling time.' },
  { id: 'ISS-002', type: 'Item Not as Described', count: 1, impact: 'High', action: 'Review listing accuracy', details: 'Case opened for order #1230 - buyer claims item differs from photos.' },
  { id: 'ISS-003', type: 'Response Time', count: 2, impact: 'Low', action: 'Improve response rate', details: 'Average response time has increased to 18 hours. Target is under 12 hours.' },
];

export default function EbayPlatformPage() {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const [issues, setIssues] = useState<PerformanceIssue[]>(initialIssues);
  const [rateLimitUsage, setRateLimitUsage] = useState(72);

  // Modal states
  const [auctionDetailOpen, setAuctionDetailOpen] = useState(false);
  const [endAuctionOpen, setEndAuctionOpen] = useState(false);
  const [issueDetailOpen, setIssueDetailOpen] = useState(false);
  const [resolveIssueOpen, setResolveIssueOpen] = useState(false);
  const [rateLimitDetailOpen, setRateLimitDetailOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<PerformanceIssue | null>(null);

  // Form states
  const [resolutionNote, setResolutionNote] = useState('');

  const ebayMetrics = {
    totalListings: 342,
    activeBids: auctions.reduce((sum, a) => sum + a.bids, 0),
    revenue: '$18,724',
    sellThroughRate: 72,
    avgSalePrice: '$54.75',
    feedbackScore: 99.2,
  };

  const handleOpenAuctionDetail = (auction: Auction) => {
    setSelectedAuction(auction);
    setAuctionDetailOpen(true);
  };

  const handleEndAuctionEarly = () => {
    if (!selectedAuction) return;

    setAuctions(prev => prev.filter(a => a.id !== selectedAuction.id));
    setEndAuctionOpen(false);
    setAuctionDetailOpen(false);
    toast.success('Auction ended', {
      description: `${selectedAuction.title} has been ended early at ${selectedAuction.current}.`,
    });
  };

  const handleOpenIssueDetail = (issue: PerformanceIssue) => {
    setSelectedIssue(issue);
    setIssueDetailOpen(true);
  };

  const handleResolveIssue = () => {
    if (!selectedIssue) return;

    setIssues(prev => prev.filter(i => i.id !== selectedIssue.id));
    setResolveIssueOpen(false);
    setIssueDetailOpen(false);
    setResolutionNote('');
    toast.success('Issue resolved', {
      description: `${selectedIssue.type} has been marked as resolved.`,
    });
  };

  const handleDismissIssue = () => {
    if (!selectedIssue) return;

    setIssues(prev => prev.filter(i => i.id !== selectedIssue.id));
    setIssueDetailOpen(false);
    toast.success('Issue dismissed', {
      description: `${selectedIssue.type} has been dismissed.`,
    });
  };

  const handleOptimizeRateLimit = () => {
    setRateLimitUsage(45);
    setRateLimitDetailOpen(false);
    toast.success('Rate limits optimized', {
      description: 'Request batching has been enabled to reduce API usage.',
    });
  };

  return (
    <DashboardLayout
      title="eBay Seller Hub"
      subtitle="Monitor your eBay listings, auctions, and seller performance metrics."
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatTile
          label="Total Listings"
          value={ebayMetrics.totalListings.toLocaleString()}
          icon={<TagIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Active Bids"
          value={ebayMetrics.activeBids.toString()}
          icon={<GavelIcon className="w-4 h-4" />}
          trend={{ value: 5, direction: 'up' }}
        />
        <StatTile
          label="Revenue"
          value={ebayMetrics.revenue}
          icon={<DollarSignIcon className="w-4 h-4" />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatTile
          label="Sell-Through Rate"
          value={`${ebayMetrics.sellThroughRate}%`}
          icon={<TrendingUpIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Avg Sale Price"
          value={ebayMetrics.avgSalePrice}
          icon={<DollarSignIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Feedback Score"
          value={`${ebayMetrics.feedbackScore}%`}
          icon={<StarIcon className="w-4 h-4" />}
        />
      </div>

      {/* Rate Limit Warning */}
      <Card>
        <div
          onClick={() => setRateLimitDetailOpen(true)}
          className="p-4 flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-amber-800 dark:text-amber-200">API Rate Limits Active</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              eBay has implemented new rate limiting. Some operations may be delayed. Current usage: {rateLimitUsage}% of daily limit.
            </p>
          </div>
          <Chip variant={rateLimitUsage > 70 ? 'warning' : 'success'} size="sm">{rateLimitUsage}% Used</Chip>
        </div>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Active Auctions */}
        <Card>
          <CardHeader title="Active Auctions" action={<Chip variant="info" size="sm">{auctions.length} Live</Chip>} />
          <div className="p-4 space-y-3">
            {auctions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <GavelIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active auctions</p>
              </div>
            ) : (
              auctions.map((auction) => (
                <div
                  key={auction.id}
                  onClick={() => handleOpenAuctionDetail(auction)}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <GavelIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-gray-100">{auction.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {auction.bids} bids · ID: {auction.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-gray-100">{auction.current}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <ClockIcon className="w-3 h-3" />
                      {auction.ends}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Performance Issues */}
        <Card>
          <CardHeader
            title="Seller Performance"
            action={
              <Chip variant={issues.length > 0 ? 'warning' : 'success'} size="sm">
                {issues.length > 0 ? `${issues.length} Issues` : 'All Clear'}
              </Chip>
            }
          />
          <div className="p-4 space-y-3">
            {issues.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No performance issues</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => handleOpenIssueDetail(issue)}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        issue.impact === 'High'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : issue.impact === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}
                    >
                      <AlertTriangleIcon
                        className={`w-5 h-5 ${
                          issue.impact === 'High'
                            ? 'text-red-600 dark:text-red-400'
                            : issue.impact === 'Medium'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-gray-100">{issue.type}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{issue.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-gray-100">{issue.count}</p>
                    <Chip
                      variant={issue.impact === 'High' ? 'error' : issue.impact === 'Medium' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {issue.impact}
                    </Chip>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Seller Standards */}
      <Card>
        <CardHeader title="Seller Standards" />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Transaction Defect Rate</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">0.8%</span>
              </div>
              <ProgressBar value={92} variant="success" />
              <p className="text-xs text-slate-500 mt-1">Target: &lt;2%</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Late Shipment Rate</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">2.1%</span>
              </div>
              <ProgressBar value={79} variant="warning" />
              <p className="text-xs text-slate-500 mt-1">Target: &lt;3%</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Cases Closed w/o Resolution</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">0.3%</span>
              </div>
              <ProgressBar value={97} variant="success" />
              <p className="text-xs text-slate-500 mt-1">Target: &lt;0.5%</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Tracking Upload Rate</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">98%</span>
              </div>
              <ProgressBar value={98} variant="success" />
              <p className="text-xs text-slate-500 mt-1">Target: &gt;95%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Auction Detail Modal */}
      <Dialog open={auctionDetailOpen} onOpenChange={setAuctionDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAuction?.title}</DialogTitle>
            <DialogDescription>ID: {selectedAuction?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Bid</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedAuction?.current}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Time Remaining</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{selectedAuction?.ends}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Bids</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedAuction?.bids}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Start Price</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedAuction?.startPrice}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Watchers</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedAuction?.watchers}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Description</p>
              <p className="text-slate-900 dark:text-gray-100">{selectedAuction?.description}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAuctionDetailOpen(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={() => {
              toast.success('Opening eBay', {
                description: 'Redirecting to eBay listing page...',
              });
            }}>
              <EyeIcon className="w-4 h-4 mr-1" />
              View on eBay
            </Button>
            <Button variant="primary" onClick={() => setEndAuctionOpen(true)}>
              End Auction Early
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Auction Confirmation */}
      <AlertDialog open={endAuctionOpen} onOpenChange={setEndAuctionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Auction Early</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this auction early? The current high bidder ({selectedAuction?.current}) will win the item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndAuctionEarly}>End Auction</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Issue Detail Modal */}
      <Dialog open={issueDetailOpen} onOpenChange={setIssueDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedIssue?.type}
              <Chip
                variant={selectedIssue?.impact === 'High' ? 'error' : selectedIssue?.impact === 'Medium' ? 'warning' : 'neutral'}
                size="sm"
              >
                {selectedIssue?.impact} Impact
              </Chip>
            </DialogTitle>
            <DialogDescription>
              {selectedIssue?.count} occurrence(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Recommended Action</p>
              <p className="font-medium text-slate-900 dark:text-gray-100">{selectedIssue?.action}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Details</p>
              <p className="text-slate-900 dark:text-gray-100">{selectedIssue?.details}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIssueDetailOpen(false)}>
              Close
            </Button>
            <Button variant="secondary" onClick={handleDismissIssue}>
              <XIcon className="w-4 h-4 mr-1" />
              Dismiss
            </Button>
            <Button variant="primary" onClick={() => setResolveIssueOpen(true)}>
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Issue Modal */}
      <Dialog open={resolveIssueOpen} onOpenChange={setResolveIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Issue</DialogTitle>
            <DialogDescription>
              Add a resolution note for {selectedIssue?.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolutionNote">Resolution Note (optional)</Label>
              <Textarea
                id="resolutionNote"
                placeholder="Describe how this issue was resolved..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResolveIssueOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResolveIssue}>
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rate Limit Detail Modal */}
      <Dialog open={rateLimitDetailOpen} onOpenChange={setRateLimitDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Rate Limit Details</DialogTitle>
            <DialogDescription>
              Monitor and manage your eBay API usage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-slate-400">Current Usage</span>
                <span className="text-xl font-bold text-slate-900 dark:text-gray-100">{rateLimitUsage}%</span>
              </div>
              <ProgressBar value={rateLimitUsage} variant={rateLimitUsage > 70 ? 'warning' : 'success'} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Daily Limit</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">10,000 calls</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{10000 - Math.round(rateLimitUsage * 100)} calls</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Rate Limit Reset</p>
              <p className="text-slate-900 dark:text-gray-100">Resets daily at 12:00 AM PST</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-2">Optimization Tips</p>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  Enable request batching
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  Reduce sync frequency
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  Cache frequently accessed data
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRateLimitDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleOptimizeRateLimit}>
              <SettingsIcon className="w-4 h-4 mr-1" />
              Optimize Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
