'use client';

import { useState } from 'react';
import { Card, CardHeader, CardSubPanel } from './Card';
import { Chip } from './Chip';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { automationControl, type AutomationMode } from '@/app/dashboard/data';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/ui/dialog';

export function AutomationControlCard() {
  const [mode, setMode] = useState<AutomationMode>(automationControl.mode);
  const [confirmModeOpen, setConfirmModeOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<AutomationMode | null>(null);

  const handleModeToggle = () => {
    const newMode: AutomationMode = mode === 'Autonomous' ? 'Supervised' : 'Autonomous';
    setPendingMode(newMode);
    setConfirmModeOpen(true);
  };

  const handleConfirmModeChange = () => {
    if (pendingMode) {
      setMode(pendingMode);
      toast.success(`Automation mode changed to ${pendingMode}`);
    }
    setConfirmModeOpen(false);
    setPendingMode(null);
  };

  return (
    <Card>
      <CardHeader title="Automation Control Level" />

      {/* Mode Badge with Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <Chip
          variant={mode === 'Autonomous' ? 'success' : 'primary'}
          size="md"
        >
          {mode} Mode
        </Chip>
        <button
          onClick={handleModeToggle}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            mode === 'Autonomous'
              ? 'bg-green-500'
              : 'bg-primary-500'
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              mode === 'Autonomous' ? 'left-7' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Stats Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Chip variant="success">
          Success: {automationControl.successRate}%
        </Chip>
        <Chip variant="warning">
          Escalation: {automationControl.escalationRate}%
        </Chip>
        <Chip variant="error">
          Exceptions: {automationControl.exceptionRate}%
        </Chip>
      </div>

      {/* Automation Coverage Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Automation Coverage
          </span>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            {automationControl.coveragePercent}%
          </span>
        </div>
        <ProgressBar
          value={automationControl.coveragePercent}
          size="md"
          variant="primary"
        />
      </div>

      {/* Notes */}
      <CardSubPanel>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {mode === 'Autonomous'
            ? 'Full automation enabled. AI agents handle all routine operations independently. Escalations only for critical issues.'
            : automationControl.notes}
        </p>
      </CardSubPanel>

      {/* Confirm Mode Change Dialog */}
      <Dialog open={confirmModeOpen} onOpenChange={setConfirmModeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Automation Mode</DialogTitle>
            <DialogDescription>
              Are you sure you want to switch to {pendingMode} mode?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {pendingMode === 'Autonomous' ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Autonomous Mode</h4>
                <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                  <li>• AI handles all routine operations independently</li>
                  <li>• Minimal human intervention required</li>
                  <li>• Only critical issues trigger escalations</li>
                  <li>• Higher throughput, faster processing</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <h4 className="font-medium text-primary-700 dark:text-primary-300 mb-2">Supervised Mode</h4>
                <ul className="text-sm text-primary-600 dark:text-primary-400 space-y-1">
                  <li>• Human approval required for high-value orders</li>
                  <li>• New supplier orders need review</li>
                  <li>• Shipping exceptions require oversight</li>
                  <li>• More control, slower processing</li>
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmModeOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmModeChange}>
              Switch to {pendingMode}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
