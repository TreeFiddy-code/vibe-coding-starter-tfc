'use client';

import { ExternalLinkIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardHeader } from './Card';
import { Chip } from './Chip';
import { Button } from './Button';
import { integrationHealth, announcements } from '@/app/dashboard/data';

type HealthStatus = 'healthy' | 'degraded' | 'down';

interface HealthChipProps {
  platform: string;
  status: HealthStatus;
}

function HealthChip({ platform, status }: HealthChipProps) {
  const variant =
    status === 'healthy' ? 'success' :
    status === 'degraded' ? 'warning' : 'error';

  const statusLabel =
    status === 'healthy' ? 'Healthy' :
    status === 'degraded' ? 'Degraded' : 'Down';

  return (
    <Chip variant={variant}>
      {platform}: {statusLabel}
    </Chip>
  );
}

interface AnnouncementItemProps {
  title: string;
  time: string;
}

function AnnouncementItem({ title, time }: AnnouncementItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 border-b border-slate-100 dark:border-gray-800 last:border-0">
      <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
          {time}
        </p>
      </div>
    </div>
  );
}

export function UpdatesNewsCard() {
  return (
    <Card>
      <CardHeader
        title="Updates / News"
        action={
          <Button variant="ghost" size="sm" iconRight={<ChevronRightIcon className="w-4 h-4" />}>
            View more
          </Button>
        }
      />

      {/* Integration Health */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Integration Health
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-500">
              last sync 2 min ago
            </span>
            <Button variant="ghost" size="sm" iconRight={<ExternalLinkIcon className="w-3.5 h-3.5" />}>
              Open
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {integrationHealth.map((item) => (
            <HealthChip
              key={item.platform}
              platform={item.platform}
              status={item.status}
            />
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Announcements
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-gray-800">
          {announcements.map((item) => (
            <AnnouncementItem
              key={item.id}
              title={item.title}
              time={item.time}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
