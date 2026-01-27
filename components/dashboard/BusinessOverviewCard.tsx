'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ExternalLinkIcon, DollarSignIcon, ShoppingBagIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { businessOverview } from '@/app/dashboard/data';

type TabId = 'reports' | 'sync' | 'financials';

const tabs: { id: TabId; label: string }[] = [
  { id: 'reports', label: 'Reports' },
  { id: 'sync', label: 'Sync Platforms' },
  { id: 'financials', label: 'Financials' },
];

interface MetricTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'error';
}

function MetricTile({ icon: Icon, label, value, variant = 'default' }: MetricTileProps) {
  const valueColor =
    variant === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
    variant === 'error' ? 'text-red-600 dark:text-red-400' :
    'text-slate-900 dark:text-gray-100';

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-gray-700/50">
      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <div className={clsx('text-lg font-bold', valueColor)}>
          {value}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
}

export function BusinessOverviewCard() {
  const [activeTab, setActiveTab] = useState<TabId>('reports');

  return (
    <Card className="lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
          Business Overview
        </h3>

        {/* Tab Control */}
        <div className="flex items-center h-9 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-3 h-7 rounded-full text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <MetricTile
          icon={DollarSignIcon}
          label="Revenue (USD)"
          value={businessOverview.revenue}
        />
        <MetricTile
          icon={ShoppingBagIcon}
          label="Orders"
          value={businessOverview.orders.toLocaleString()}
        />
        <MetricTile
          icon={ClockIcon}
          label="On-time Rate"
          value={businessOverview.onTimeRate}
          variant="success"
        />
        <MetricTile
          icon={AlertTriangleIcon}
          label="Exceptions"
          value={businessOverview.exceptions}
          variant={businessOverview.exceptions > 10 ? 'error' : 'default'}
        />
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          iconRight={<ExternalLinkIcon className="w-3.5 h-3.5" />}
        >
          Open
        </Button>
      </div>
    </Card>
  );
}
