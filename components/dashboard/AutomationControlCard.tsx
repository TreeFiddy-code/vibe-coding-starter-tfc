'use client';

import { Card, CardHeader, CardSubPanel } from './Card';
import { Chip } from './Chip';
import { ProgressBar } from './ProgressBar';
import { automationControl } from '@/app/dashboard/data';

export function AutomationControlCard() {
  return (
    <Card>
      <CardHeader title="Automation Control Level" />

      {/* Mode Badge */}
      <div className="mb-4">
        <Chip
          variant={automationControl.mode === 'Autonomous' ? 'success' : 'primary'}
          size="md"
        >
          {automationControl.mode} Mode
        </Chip>
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
          {automationControl.notes}
        </p>
      </CardSubPanel>
    </Card>
  );
}
