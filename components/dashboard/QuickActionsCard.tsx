'use client';

import { LinkIcon, BotIcon, ShieldIcon, ChevronRightIcon } from 'lucide-react';
import { Card, CardHeader, CardSubPanel } from './Card';
import { quickActions } from '@/app/dashboard/data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  link: LinkIcon,
  bot: BotIcon,
  shield: ShieldIcon,
};

interface ActionRowProps {
  icon: string;
  title: string;
  description: string;
}

function ActionRow({ icon, title, description }: ActionRowProps) {
  const Icon = iconMap[icon] || LinkIcon;

  return (
    <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left">
      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 dark:text-gray-100 text-sm">
          {title}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {description}
        </div>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors flex-shrink-0" />
    </button>
  );
}

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader title="Quick Actions" />

      <div className="space-y-1">
        {quickActions.map((action) => (
          <ActionRow
            key={action.id}
            icon={action.icon}
            title={action.title}
            description={action.description}
          />
        ))}
      </div>

      <CardSubPanel>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-600 dark:text-slate-300">Ops focus:</span>{' '}
          Maintain oversight while AI handles routine tasks. Escalations appear on your dashboard.
        </p>
      </CardSubPanel>
    </Card>
  );
}
