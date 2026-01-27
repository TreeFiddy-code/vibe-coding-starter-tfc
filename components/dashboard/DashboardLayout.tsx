'use client';

import { useState, ReactNode } from 'react';
import clsx from 'clsx';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'command'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-gray-100 transition-colors">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activePage={activeTab}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Topbar */}
          <Topbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className={clsx(
              'max-w-screen-2xl mx-auto p-4 lg:p-6 xl:p-8',
              'space-y-4 lg:space-y-6'
            )}>
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-gray-100">
                    {title}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {subtitle}
                  </p>
                </div>

                {/* Hide sensitive toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Hide sensitive
                  </span>
                  <button
                    className="relative w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
