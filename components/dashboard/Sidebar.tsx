'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
import { workspaceData } from '@/app/dashboard/data';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, href, active = false, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
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
    </Link>
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

// Navigation items with their routes
const navigationItems = {
  platformHub: [
    { label: 'Amazon', href: '/dashboard/platforms/amazon', icon: StoreIcon },
    { label: 'Shopify', href: '/dashboard/platforms/shopify', icon: ShoppingCartIcon },
    { label: 'eBay', href: '/dashboard/platforms/ebay', icon: BoxIcon },
    { label: 'Social', href: '/dashboard/platforms/social', icon: UsersIcon },
  ],
  management: [
    { label: 'Product Management', href: '/dashboard/management/products', icon: BoxIcon },
    { label: 'Supplier Management', href: '/dashboard/management/suppliers', icon: TruckIcon },
    { label: 'Order Management', href: '/dashboard/management/orders', icon: ShoppingCartIcon },
  ],
  commandCenter: [
    { label: 'Agents', href: '/dashboard/command/agents', icon: BotIcon },
    { label: 'Workflows', href: '/dashboard/command/workflows', icon: GitBranchIcon },
    { label: 'Rules', href: '/dashboard/command/rules', icon: ShieldCheckIcon },
  ],
  support: [
    { label: 'Customer Service', href: '/dashboard/support/customer-service', icon: HeadphonesIcon },
    { label: 'Escalations', href: '/dashboard/support/escalations', icon: AlertTriangleIcon },
  ],
  integrations: [
    { label: 'Integration Portal', href: '/dashboard/integrations', icon: PlugIcon },
    { label: 'Webhooks', href: '/dashboard/integrations/webhooks', icon: WebhookIcon },
    { label: 'API Keys', href: '/dashboard/integrations/api-keys', icon: KeyIcon },
    { label: 'Health', href: '/dashboard/integrations/health', icon: HeartPulseIcon },
  ],
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
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
              href="/dashboard"
              active={pathname === '/dashboard'}
              onClick={onClose}
            />
          </div>

          {/* Platform Hub */}
          <NavGroup label="Platform Hub">
            {navigationItems.platformHub.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                onClick={onClose}
              />
            ))}
          </NavGroup>

          {/* Management */}
          <NavGroup label="Management">
            {navigationItems.management.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                onClick={onClose}
              />
            ))}
          </NavGroup>

          {/* Command Center */}
          <NavGroup label="Command Center">
            {navigationItems.commandCenter.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                onClick={onClose}
              />
            ))}
          </NavGroup>

          {/* Support */}
          <NavGroup label="Support">
            {navigationItems.support.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                onClick={onClose}
              />
            ))}
          </NavGroup>

          {/* Integrations */}
          <NavGroup label="Integrations" defaultOpen={false}>
            {navigationItems.integrations.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                onClick={onClose}
              />
            ))}
          </NavGroup>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-gray-800">
          <NavItem
            icon={SettingsIcon}
            label="Settings"
            href="/dashboard/settings"
            active={pathname === '/dashboard/settings'}
            onClick={onClose}
          />
          <p className="mt-4 px-3 text-xs text-slate-400 dark:text-slate-600">
            OmniCart AI v2.1
          </p>
        </div>
      </aside>
    </>
  );
}
