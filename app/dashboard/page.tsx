'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { ClickStatistics } from '@/components/dashboard/click-statistics';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ClickStatistics />
        </div>
      </main>
    </>
  );
} 