'use client';

import { CopyIcon, ClockIcon, GlobeIcon, UserIcon, RefreshCwIcon } from 'lucide-react';
import { Card } from './Card';
import { Chip } from './Chip';
import { userData } from '@/app/dashboard/data';

export function UserOverviewCard() {
  const handleCopyWorkspaceId = () => {
    navigator.clipboard.writeText(userData.workspaceId);
  };

  return (
    <Card className="col-span-full">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Avatar + Name + Description */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {userData.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
              {userData.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {userData.description}
            </p>
          </div>
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Chip
            variant="neutral"
            icon={<CopyIcon className="w-3 h-3 cursor-pointer" onClick={handleCopyWorkspaceId} />}
          >
            {userData.workspaceId}
          </Chip>
          <Chip variant="primary" icon={<UserIcon className="w-3 h-3" />}>
            {userData.role}
          </Chip>
          <Chip variant="neutral" icon={<GlobeIcon className="w-3 h-3" />}>
            {userData.timezone}
          </Chip>
          <Chip variant="neutral" icon={<ClockIcon className="w-3 h-3" />}>
            Login: {userData.lastLogin}
          </Chip>
          <Chip variant="success" icon={<RefreshCwIcon className="w-3 h-3" />}>
            Sync: {userData.lastSync}
          </Chip>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
        Use Workspace ID for integration setup and support.
      </p>
    </Card>
  );
}
