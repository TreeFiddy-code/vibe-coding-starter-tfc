'use client';

import clsx from 'clsx';
import {
  MenuIcon,
  ShoppingCartIcon,
  PlugIcon,
} from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { Button } from './Button';
import { userData } from '@/app/dashboard/data';

type TabId = 'dashboard' | 'orders' | 'command';

interface TopbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onMenuClick: () => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'command', label: 'Command' },
];

export function Topbar({ activeTab, onTabChange, onMenuClick }: TopbarProps) {
  return (
    <header
      className={clsx(
        'sticky top-0 z-40 h-16 flex items-center justify-between gap-4 px-4 lg:px-6',
        'bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm',
        'border-b border-slate-200 dark:border-gray-800'
      )}
    >
      {/* Left: Menu button + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MenuIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            O
          </div>
          <span className="hidden sm:inline text-lg font-semibold text-slate-900 dark:text-gray-100">
            OmniCart_AI
          </span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="hidden md:flex items-center">
        <div className="flex items-center h-9 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'px-4 h-7 rounded-full text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-gray-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Orders shortcut - hidden on small screens */}
        <button className="hidden lg:flex items-center gap-2 px-3 h-8 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ShoppingCartIcon className="w-4 h-4" />
          <span>Orders</span>
        </button>

        {/* Connect Platform CTA */}
        <Button
          variant="primary"
          size="sm"
          icon={<PlugIcon className="w-4 h-4" />}
          className="hidden sm:inline-flex"
        >
          Connect Platform
        </Button>

        {/* User Avatar */}
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {userData.initials}
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
        </div>

        {/* Theme Toggle */}
        <ThemeSwitch />
      </div>
    </header>
  );
}
