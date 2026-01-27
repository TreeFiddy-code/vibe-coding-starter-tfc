'use client';

import { useState } from 'react';
import clsx from 'clsx';
import {
  LayoutDashboardIcon,
  ShoppingCartIcon,
  TerminalIcon,
  StoreIcon,
  BoxIcon,
  TruckIcon,
  UsersIcon,
  BotIcon,
  GitBranchIcon,
  ShieldCheckIcon,
  HeadphonesIcon,
  AlertTriangleIcon,
  PlugIcon,
  WebhookIcon,
  KeyIcon,
  HeartPulseIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XIcon,
} from 'lucide-react';
import { Chip } from './Chip';
import { workspaceData, sidebarNavigation } from '@/app/dashboard/data';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: 'dashboard' | 'orders' | 'command';
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 h-9 px-3 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function NavGroup({ label, children, defaultOpen = true }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        {isOpen ? (
          <ChevronDownIcon className="w-3 h-3" />
        ) : (
          <ChevronRightIcon className="w-3 h-3" />
        )}
        {label}
      </button>
      {isOpen && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Amazon: StoreIcon,
  Shopify: ShoppingCartIcon,
  eBay: BoxIcon,
  Social: UsersIcon,
};

const managementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Product Management': BoxIcon,
  'Supplier Management': TruckIcon,
  'Order Management': ShoppingCartIcon,
};

const commandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Agents: BotIcon,
  Workflows: GitBranchIcon,
  Rules: ShieldCheckIcon,
};

const supportIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Customer Service': HeadphonesIcon,
  Escalations: AlertTriangleIcon,
};

const integrationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Integration Portal': PlugIcon,
  Webhooks: WebhookIcon,
  'API Keys': KeyIcon,
  Health: HeartPulseIcon,
};

export function Sidebar({ isOpen, onClose, activePage = 'dashboard' }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-68 flex flex-col',
          'bg-slate-50 dark:bg-slate-950',
          'border-r border-slate-200 dark:border-gray-800',
          'transform transition-transform duration-300 lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: '272px' }}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Workspace Card */}
        <div className="p-4 border-b border-slate-200 dark:border-gray-800">
          <div className="rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800">
            <h2 className="font-semibold text-slate-900 dark:text-gray-100 mb-2">
              {workspaceData.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Chip variant="neutral" size="sm">
                {workspaceData.platformCount} platforms
              </Chip>
              <Chip variant="success" size="sm">
                agents {workspaceData.agentsStatus}
              </Chip>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Main Navigation */}
          <div className="mb-4 space-y-0.5">
            <NavItem
              icon={LayoutDashboardIcon}
              label="Dashboard"
              active={activePage === 'dashboard'}
            />
          </div>

          {/* Platform Hub */}
          <NavGroup label="Platform Hub">
            {sidebarNavigation.platformHub.map((item) => (
              <NavItem
                key={item}
                icon={platformIcons[item] || StoreIcon}
                label={item}
              />
            ))}
          </NavGroup>

          {/* Management */}
          <NavGroup label="Management">
            {sidebarNavigation.management.map((item) => (
              <NavItem
                key={item}
                icon={managementIcons[item] || BoxIcon}
                label={item}
              />
            ))}
          </NavGroup>

          {/* Command Center */}
          <NavGroup label="Command Center">
            {sidebarNavigation.commandCenter.map((item) => (
              <NavItem
                key={item}
                icon={commandIcons[item] || TerminalIcon}
                label={item}
              />
            ))}
          </NavGroup>

          {/* Support */}
          <NavGroup label="Support">
            {sidebarNavigation.support.map((item) => (
              <NavItem
                key={item}
                icon={supportIcons[item] || HeadphonesIcon}
                label={item}
              />
            ))}
          </NavGroup>

          {/* Integrations */}
          <NavGroup label="Integrations" defaultOpen={false}>
            {sidebarNavigation.integrations.map((item) => (
              <NavItem
                key={item}
                icon={integrationIcons[item] || PlugIcon}
                label={item}
              />
            ))}
          </NavGroup>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-gray-800">
          <NavItem icon={SettingsIcon} label="Settings" />
          <p className="mt-4 px-3 text-xs text-slate-400 dark:text-slate-600">
            OmniCart_AI v2.1
          </p>
        </div>
      </aside>
    </>
  );
}
