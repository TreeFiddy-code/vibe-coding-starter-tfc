'use client';

import {
  DashboardLayout,
  UserOverviewCard,
  QuickActionsCard,
  AgentActivityCard,
  PlatformPerformanceCard,
  BusinessOverviewCard,
  AutomationControlCard,
  UpdatesNewsCard,
  CurrentOperationsTable,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard — agentic e-commerce / drop shipping command center"
      subtitle="Unified operations across channels; agents run workflows; humans keep oversight."
    >
      {/* User Overview - Full width */}
      <UserOverviewCard />

      {/* Second row: 3-column grid on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <QuickActionsCard />
        <AgentActivityCard />
        <PlatformPerformanceCard />
      </div>

      {/* Third row: Business Overview (wider) + Automation Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <BusinessOverviewCard />
        <AutomationControlCard />
      </div>

      {/* Fourth row: Updates/News */}
      <UpdatesNewsCard />

      {/* Current Operations Table - Full width */}
      <CurrentOperationsTable />
    </DashboardLayout>
  );
}
