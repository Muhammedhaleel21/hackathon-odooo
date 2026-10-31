'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';
import { DashboardHeader } from '../../components/dashboard/dashboard-header';
import { DashboardSidebar } from '../../components/dashboard/dashboard-sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-[#0F172A]">
          <Loader2 className="w-8 h-8 text-[#C8E63C] animate-spin mb-3 stroke-[2.5]" />
          <p className="text-sm text-[#64748B] font-medium">Verifying session...</p>
        </div>
        );
  }

        if (!isAuthenticated) {
    return null;
  }

        return (
          <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
            <DashboardHeader />
            <div className="flex flex-1">
              <DashboardSidebar />
              <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-8 overflow-x-hidden">
                <div className="max-w-6xl mx-auto space-y-6">{children}</div>
              </main>
            </div>
          </div>
          );
}
