'use client';

import clsx from 'clsx';
import { Card, CardHeader } from './Card';
import { Button } from './Button';
import { StatusPill } from './StatusPill';
import { currentOperations, type Operation } from '@/app/dashboard/data';

interface TrendSparklineProps {
  data: number[];
}

function TrendSparkline({ data }: TrendSparklineProps) {
  const max = Math.max(...data);
  const height = 20;
  const width = 56;
  const barWidth = 6;
  const gap = 2;

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      {data.map((value, index) => {
        const barHeight = (value / max) * height;
        const x = index * (barWidth + gap);
        const y = height - barHeight;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={1}
            className="fill-slate-300 dark:fill-slate-600"
          />
        );
      })}
    </svg>
  );
}

interface OperationRowProps {
  operation: Operation;
}

function OperationRow({ operation }: OperationRowProps) {
  return (
    <tr className="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Channel */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', operation.channelColor)} />
          <span className="text-sm font-medium text-slate-900 dark:text-gray-100">
            {operation.channel}
          </span>
        </div>
      </td>

      {/* Order/Task */}
      <td className="px-4 py-3">
        <div>
          <span className="text-sm text-slate-900 dark:text-gray-100">
            {operation.id}
          </span>
          <span className="hidden sm:inline text-sm text-slate-500 dark:text-slate-400 ml-2">
            — {operation.title}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusPill status={operation.status} />
      </td>

      {/* SLA/Age */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-sm text-slate-600 dark:text-slate-400 tabular-nums">
          {operation.sla}
        </span>
      </td>

      {/* Trend */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <TrendSparkline data={operation.trend} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="sm">
            View
          </Button>
          {operation.status === 'Exception' && (
            <Button variant="secondary" size="sm">
              Resolve
            </Button>
          )}
          {(operation.status === 'Exception' || operation.status === 'Queued') && (
            <Button variant="primary" size="sm">
              Re-run
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function CurrentOperationsTable() {
  return (
    <Card className="col-span-full overflow-hidden">
      <CardHeader
        title="Current Operations (Orders)"
        action={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Live queue • cross-channel
          </span>
        }
      />

      <div className="overflow-x-auto -mx-5">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Order / Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                SLA / Age
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Trend
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOperations.map((operation) => (
              <OperationRow key={operation.id} operation={operation} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
