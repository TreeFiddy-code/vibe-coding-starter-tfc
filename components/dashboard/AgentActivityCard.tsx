'use client';

import { Card, CardHeader, CardSubPanel } from './Card';
import { StatTile } from './StatTile';
import { agentActivity } from '@/app/dashboard/data';

export function AgentActivityCard() {
  return (
    <Card>
      <CardHeader title="Agent Activity" />

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Online"
          value={agentActivity.online}
          variant="success"
        />
        <StatTile
          label="Busy"
          value={agentActivity.busy}
          variant="default"
        />
        <StatTile
          label="Queued"
          value={agentActivity.queued}
          variant="warning"
        />
        <StatTile
          label="Escalations"
          value={agentActivity.escalations}
          variant="error"
        />
      </div>

      <CardSubPanel>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-600 dark:text-slate-300">Operator note:</span>{' '}
          {agentActivity.note}
        </p>
      </CardSubPanel>
    </Card>
  );
}
