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
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { toast } from 'sonner';
import {
  UsersIcon,
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  InstagramIcon,
  FacebookIcon,
  VideoIcon,
  MailIcon,
  ExternalLinkIcon,
  TargetIcon,
  EditIcon,
} from 'lucide-react';

interface ContentItem {
  id: number;
  type: string;
  platform: string;
  views: string;
  likes: number;
  comments: number;
  sales: number;
  engagement?: string;
  reach?: string;
  postedAt?: string;
}

interface Influencer {
  name: string;
  handle: string;
  orders: number;
  revenue: string;
  commission: string;
  email?: string;
  tier?: string;
  joinedDate?: string;
}

interface ChannelGoal {
  name: string;
  target: string;
  current: number;
  percentage: number;
}

const socialMetrics = {
  totalFollowers: '45.2K',
  engagement: 4.8,
  socialSales: '$12,340',
  conversionRate: 2.1,
  avgReach: '28.5K',
  contentPosts: 47,
};

const platformStats = [
  {
    platform: 'Instagram Shop',
    icon: InstagramIcon,
    followers: '32.1K',
    engagement: '5.2%',
    sales: '$8,420',
    color: 'bg-pink-500',
  },
  {
    platform: 'Facebook Shop',
    icon: FacebookIcon,
    followers: '12.4K',
    engagement: '3.8%',
    sales: '$3,120',
    color: 'bg-blue-600',
  },
  {
    platform: 'TikTok Shop',
    icon: VideoIcon,
    followers: '8.7K',
    engagement: '8.4%',
    sales: '$800',
    color: 'bg-slate-900',
  },
];

const initialContent: ContentItem[] = [
  { id: 1, type: 'Reel', platform: 'Instagram', views: '12.4K', likes: 842, comments: 56, sales: 12, engagement: '6.8%', reach: '18.2K', postedAt: '2 days ago' },
  { id: 2, type: 'Post', platform: 'Facebook', views: '3.2K', likes: 234, comments: 18, sales: 4, engagement: '4.2%', reach: '5.6K', postedAt: '3 days ago' },
  { id: 3, type: 'Video', platform: 'TikTok', views: '28.1K', likes: 2100, comments: 142, sales: 8, engagement: '8.0%', reach: '45K', postedAt: '4 days ago' },
  { id: 4, type: 'Story', platform: 'Instagram', views: '8.5K', likes: 0, comments: 0, sales: 6, engagement: '3.2%', reach: '12K', postedAt: '1 day ago' },
];

const initialInfluencers: Influencer[] = [
  { name: 'Sarah Johnson', handle: '@sarahstyle', orders: 24, revenue: '$2,140', commission: '$214', email: 'sarah@email.com', tier: 'Gold', joinedDate: '6 months ago' },
  { name: 'Mike Chen', handle: '@mikereviews', orders: 18, revenue: '$1,620', commission: '$162', email: 'mike@email.com', tier: 'Silver', joinedDate: '4 months ago' },
  { name: 'Emma Wilson', handle: '@emmadeals', orders: 12, revenue: '$980', commission: '$98', email: 'emma@email.com', tier: 'Bronze', joinedDate: '2 months ago' },
];

const initialGoals: ChannelGoal[] = [
  { name: 'Follower Goal', target: '50K', current: 45200, percentage: 90 },
  { name: 'Monthly Sales Goal', target: '$15K', current: 12340, percentage: 82 },
  { name: 'Content Calendar', target: '60 posts', current: 47, percentage: 78 },
];

export default function SocialPlatformPage() {
  const [content] = useState<ContentItem[]>(initialContent);
  const [influencers] = useState<Influencer[]>(initialInfluencers);
  const [goals, setGoals] = useState<ChannelGoal[]>(initialGoals);

  // Modal states
  const [contentDetailOpen, setContentDetailOpen] = useState(false);
  const [influencerDetailOpen, setInfluencerDetailOpen] = useState(false);
  const [goalDetailOpen, setGoalDetailOpen] = useState(false);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<ChannelGoal | null>(null);

  // Form states
  const [goalTarget, setGoalTarget] = useState('');

  const handleOpenContentDetail = (item: ContentItem) => {
    setSelectedContent(item);
    setContentDetailOpen(true);
  };

  const handleOpenInfluencerDetail = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setInfluencerDetailOpen(true);
  };

  const handleOpenGoalDetail = (goal: ChannelGoal) => {
    setSelectedGoal(goal);
    setGoalDetailOpen(true);
  };

  const handleOpenEditGoal = () => {
    if (!selectedGoal) return;
    setGoalTarget(selectedGoal.target);
    setGoalDetailOpen(false);
    setEditGoalOpen(true);
  };

  const handleSaveGoal = () => {
    if (!selectedGoal || !goalTarget) return;

    setGoals(prev => prev.map(g =>
      g.name === selectedGoal.name
        ? { ...g, target: goalTarget }
        : g
    ));

    setEditGoalOpen(false);
    toast.success('Goal updated', {
      description: `${selectedGoal.name} target has been updated to ${goalTarget}.`,
    });
  };

  const handleContactInfluencer = () => {
    if (!selectedInfluencer) return;
    toast.success('Email opened', {
      description: `Opening email to ${selectedInfluencer.email}...`,
    });
  };

  return (
    <DashboardLayout
      title="Social Commerce"
      subtitle="Manage your social media storefronts and influencer partnerships."
    >
      {/* New Channel Banner */}
      <Card>
        <div className="p-4 flex items-center gap-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <TrendingUpIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-pink-800 dark:text-pink-200">New Channel - Growing Fast!</p>
            <p className="text-sm text-pink-600 dark:text-pink-400">
              Social commerce channel launched 3 months ago. Seeing 45% month-over-month growth.
            </p>
          </div>
          <Chip variant="success" size="sm">+45% MoM</Chip>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatTile
          label="Total Followers"
          value={socialMetrics.totalFollowers}
          icon={<UsersIcon className="w-4 h-4" />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatTile
          label="Engagement Rate"
          value={`${socialMetrics.engagement}%`}
          icon={<HeartIcon className="w-4 h-4" />}
          trend={{ value: 0.8, direction: 'up' }}
        />
        <StatTile
          label="Social Sales"
          value={socialMetrics.socialSales}
          icon={<ShoppingBagIcon className="w-4 h-4" />}
          trend={{ value: 34, direction: 'up' }}
        />
        <StatTile
          label="Conversion"
          value={`${socialMetrics.conversionRate}%`}
          icon={<TrendingUpIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Avg Reach"
          value={socialMetrics.avgReach}
          icon={<ShareIcon className="w-4 h-4" />}
        />
        <StatTile
          label="Content Posts"
          value={socialMetrics.contentPosts.toString()}
          icon={<MessageCircleIcon className="w-4 h-4" />}
        />
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {platformStats.map((platform) => (
          <Card key={platform.platform}>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                  <platform.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-gray-100">{platform.platform}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{platform.followers} followers</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Engagement</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-gray-100">{platform.engagement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Sales</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{platform.sales}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Content Performance */}
        <Card>
          <CardHeader title="Content Performance" action={<Chip variant="info" size="sm">Last 7 days</Chip>} />
          <div className="p-4 space-y-3">
            {content.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenContentDetail(item)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <VideoIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100">
                      {item.type} · {item.platform}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.views} views</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <HeartIcon className="w-4 h-4" />
                    {item.likes}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <MessageCircleIcon className="w-4 h-4" />
                    {item.comments}
                  </div>
                  <Chip variant="success" size="sm">{item.sales} sales</Chip>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Influencer Partners */}
        <Card>
          <CardHeader title="Influencer Partners" action={<Chip variant="neutral" size="sm">Active</Chip>} />
          <div className="p-4 space-y-3">
            {influencers.map((influencer) => (
              <div
                key={influencer.handle}
                onClick={() => handleOpenInfluencerDetail(influencer)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {influencer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-gray-100">{influencer.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{influencer.handle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-gray-100">{influencer.revenue}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {influencer.orders} orders · {influencer.commission} commission
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Channel Growth */}
      <Card>
        <CardHeader title="Channel Growth Progress" />
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.name}
                onClick={() => handleOpenGoalDetail(goal)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{goal.name} ({goal.target})</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-gray-100">{goal.percentage}%</span>
                </div>
                <ProgressBar value={goal.percentage} variant={goal.percentage >= 85 ? 'success' : 'warning'} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Content Detail Modal */}
      <Dialog open={contentDetailOpen} onOpenChange={setContentDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedContent?.type} Performance</DialogTitle>
            <DialogDescription>
              {selectedContent?.platform} · Posted {selectedContent?.postedAt}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Views</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedContent?.views}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Reach</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedContent?.reach}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Likes</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedContent?.likes}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Comments</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedContent?.comments}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Sales</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{selectedContent?.sales}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Engagement Rate</p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedContent?.engagement}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setContentDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              toast.success('Opening platform', {
                description: `Redirecting to ${selectedContent?.platform}...`,
              });
            }}>
              <ExternalLinkIcon className="w-4 h-4 mr-1" />
              View on {selectedContent?.platform}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Influencer Detail Modal */}
      <Dialog open={influencerDetailOpen} onOpenChange={setInfluencerDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedInfluencer?.name}
              <Chip
                variant={selectedInfluencer?.tier === 'Gold' ? 'warning' : selectedInfluencer?.tier === 'Silver' ? 'neutral' : 'info'}
                size="sm"
              >
                {selectedInfluencer?.tier}
              </Chip>
            </DialogTitle>
            <DialogDescription>{selectedInfluencer?.handle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedInfluencer?.revenue}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Commission Earned</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{selectedInfluencer?.commission}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedInfluencer?.orders}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Partner Since</p>
                <p className="text-lg font-bold text-slate-900 dark:text-gray-100">{selectedInfluencer?.joinedDate}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-slate-900 dark:text-gray-100">{selectedInfluencer?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setInfluencerDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleContactInfluencer}>
              <MailIcon className="w-4 h-4 mr-1" />
              Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Detail Modal */}
      <Dialog open={goalDetailOpen} onOpenChange={setGoalDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TargetIcon className="w-5 h-5" />
              {selectedGoal?.name}
            </DialogTitle>
            <DialogDescription>Track your progress toward this goal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-gray-100">{selectedGoal?.percentage}%</span>
              </div>
              <ProgressBar
                value={selectedGoal?.percentage || 0}
                variant={(selectedGoal?.percentage || 0) >= 85 ? 'success' : 'warning'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Target</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{selectedGoal?.target}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">Current</p>
                <p className="text-xl font-bold text-slate-900 dark:text-gray-100">
                  {selectedGoal?.current.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">Remaining</p>
              <p className="text-slate-900 dark:text-gray-100">
                {100 - (selectedGoal?.percentage || 0)}% to reach your goal
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setGoalDetailOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleOpenEditGoal}>
              <EditIcon className="w-4 h-4 mr-1" />
              Edit Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Modal */}
      <Dialog open={editGoalOpen} onOpenChange={setEditGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedGoal?.name}</DialogTitle>
            <DialogDescription>Update the target for this goal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goalTarget">Target</Label>
              <Input
                id="goalTarget"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                placeholder="e.g., 50K, $15K, 60 posts"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditGoalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveGoal}>
              Save Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
