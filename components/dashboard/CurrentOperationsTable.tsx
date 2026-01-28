'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Card, CardHeader } from './Card';
import { Button } from './Button';
import { StatusPill } from './StatusPill';
import { currentOperations, type Operation, type OperationStatus } from '@/app/dashboard/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';
import { Textarea } from '@/components/shared/ui/textarea';
import { Label } from '@/components/shared/ui/label';
import { toast } from 'sonner';

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
  onView: (operation: Operation) => void;
  onResolve: (operation: Operation) => void;
  onRerun: (operation: Operation) => void;
}

function OperationRow({ operation, onView, onResolve, onRerun }: OperationRowProps) {
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
          <Button variant="ghost" size="sm" onClick={() => onView(operation)}>
            View
          </Button>
          {operation.status === 'Exception' && (
            <Button variant="secondary" size="sm" onClick={() => onResolve(operation)}>
              Resolve
            </Button>
          )}
          {(operation.status === 'Exception' || operation.status === 'Queued') && (
            <Button variant="primary" size="sm" onClick={() => onRerun(operation)}>
              Re-run
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function CurrentOperationsTable() {
  const [operations, setOperations] = useState<Operation[]>(currentOperations);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const handleView = (operation: Operation) => {
    setSelectedOperation(operation);
    setViewDetailOpen(true);
  };

  const handleResolve = (operation: Operation) => {
    setSelectedOperation(operation);
    setResolutionNote('');
    setResolveOpen(true);
  };

  const handleRerun = (operation: Operation) => {
    setOperations(operations.map((op) =>
      op.id === operation.id ? { ...op, status: 'Processing' as OperationStatus } : op
    ));
    toast.success(`Re-running operation ${operation.id}`);
  };

  const handleConfirmResolve = () => {
    if (!selectedOperation) return;
    setOperations(operations.map((op) =>
      op.id === selectedOperation.id ? { ...op, status: 'Fulfilled' as OperationStatus, sla: '—' } : op
    ));
    setResolveOpen(false);
    toast.success(`Exception resolved for ${selectedOperation.id}`);
  };

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
            {operations.map((operation) => (
              <OperationRow
                key={operation.id}
                operation={operation}
                onView={handleView}
                onResolve={handleResolve}
                onRerun={handleRerun}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* View Detail Modal */}
      <Dialog open={viewDetailOpen} onOpenChange={setViewDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Operation Details</DialogTitle>
            <DialogDescription>
              {selectedOperation?.id} - {selectedOperation?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedOperation && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500">Channel</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx('w-2 h-2 rounded-full', selectedOperation.channelColor)} />
                    <span className="font-medium">{selectedOperation.channel}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusPill status={selectedOperation.status} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500">SLA / Age</p>
                  <p className="font-medium mt-1">{selectedOperation.sla}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500">Order ID</p>
                  <p className="font-medium mt-1">{selectedOperation.id}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">Activity Trend</p>
                <TrendSparkline data={selectedOperation.trend} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="primary" onClick={() => setViewDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Exception Modal */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Exception</DialogTitle>
            <DialogDescription>
              Resolve the exception for {selectedOperation?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Exception:</strong> {selectedOperation?.title}
              </p>
            </div>
            <div>
              <Label htmlFor="resolution-note">Resolution Note (optional)</Label>
              <Textarea
                id="resolution-note"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe how this exception was resolved..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResolveOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmResolve}>
              Mark Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
