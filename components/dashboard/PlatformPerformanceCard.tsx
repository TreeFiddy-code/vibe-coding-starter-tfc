'use client';

import { Card, CardHeader } from './Card';
import { ProgressBar } from './ProgressBar';
import { platformPerformance } from '@/app/dashboard/data';

interface PlatformRowProps {
  name: string;
  status: string;
  percentage: number;
}

function PlatformRow({ name, status, percentage }: PlatformRowProps) {
  const variant =
    percentage >= 90 ? 'primary' :
    percentage >= 70 ? 'secondary' :
    percentage >= 50 ? 'warning' : 'error';

  return (
    <div className="py-3 first:pt-0 last:pb-0 border-b border-slate-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-medium text-sm text-slate-900 dark:text-gray-100">
            {name}
          </span>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
            {status}
          </span>
        </div>
      </div>
      <ProgressBar value={percentage} showLabel variant={variant} />
    </div>
  );
}

export function PlatformPerformanceCard() {
  return (
    <Card>
      <CardHeader title="Platform Performance" />

      <div className="divide-y divide-slate-100 dark:divide-gray-800">
        {platformPerformance.map((platform) => (
          <PlatformRow
            key={platform.name}
            name={platform.name}
            status={platform.status}
            percentage={platform.percentage}
          />
        ))}
      </div>
    </Card>
  );
}
