'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/use-auth';
import { Bell, LogOut, Shield, User, UserCheck } from 'lucide-react';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C8E63C]/30 text-[#0F172A] border border-[#C8E63C]">
            <Shield className="w-3 h-3 text-[#0F172A]" />
            Administrator
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <UserCheck className="w-3 h-3" />
            Staff Member
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <User className="w-3 h-3" />
            Customer
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] h-16 flex items-center justify-between px-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#C8E63C] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <span className="text-[#0F172A] font-black text-lg">C</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#0F172A] leading-tight tracking-tight">
              Cirkkl Hub
            </span>
            <span className="text-[10px] text-[#94A3B8] font-medium leading-none">
              Brightloop Subscriptions
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls: Notification & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#E2E8F0]">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-[#0F172A] leading-tight">
              {user?.name || 'Administrator'}
            </div>
            <div className="mt-0.5">{getRoleBadge(user?.role)}</div>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-[#0F172A]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

