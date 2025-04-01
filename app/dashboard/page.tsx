'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { ClickStatistics } from '@/components/dashboard/click-statistics';

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <ClickStatistics />
      </main>
    </>
  );
} 