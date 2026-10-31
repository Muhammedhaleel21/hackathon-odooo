'use client';

import React from 'react';
import { useAuth, getDashboardPath } from '../../../hooks/use-auth';
import {
  UserCheck,
  Package,
  Layers,
  FileText,
  CreditCard,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const { user } = useAuth();

  // Role Guard: Only Staff and Admin can view staff dashboard
  if (user && user.role === 'customer') {
    return (
          <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border border-red-200 text-center shadow-sm">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Access Denied (403)</h2>
            <p className="text-sm text-[#64748B] mb-6">
              The Staff Dashboard is reserved for internal operations.
            </p>
            <Link
              href={getDashboardPath(user.role)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30]"
            >
              Go to Customer Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          );
  }

          return (
          <div className="space-y-8">
            {/* Header Banner */}
                <div className="rounded-3xl bg-white border border-[#F1F5F9] p-8 shadow-sm">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                    <UserCheck className="w-3.5 h-3.5" />
                    Staff Operational Workspace
                  </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                      Operational Workspace
                    </h1>
                      <p className="text-[#64748B] text-sm mt-1 max-w-xl">
                        Browse products and subscription plans, view variant pricings, and prepare customer quotations.
                      </p>
                    </div>

                        {/* Staff Scope Notice */}
                        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-[#334155] leading-relaxed">
                            <strong className="text-[#0F172A]">Operational Role Permissions:</strong> As a staff member, you have read-only access to the products catalog and subscription plans to assist customers and prepare quotations. Pricing changes, product creations, and administrative settings require an Administrator.
                          </div>
                        </div>

                              {/* Catalog Shortcuts */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
                                  <div className="w-10 h-10 rounded-xl bg-[#C8E63C]/30 text-[#0F172A] flex items-center justify-center font-bold">
                                    <Package className="w-5 h-5" />
                                  </div>
                                    <div>
                                      <h3 className="font-bold text-base text-[#0F172A]">Products Catalog</h3>
                                      <p className="text-xs text-[#64748B] mt-1">
                                        Browse products, view sales prices, and check variant attribute options like Odoo brand additions.
                                      </p>
                                    </div>
                                    <Link
                                      href="/admin/products"
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline pt-2"
                                    >
                                      Browse Products Catalog →
                                    </Link>
                                  </div>

                                      <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                          <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-base text-[#0F172A]">Subscription Plans</h3>
                                          <p className="text-xs text-[#64748B] mt-1">
                                            Inspect published billing plans, recurrence intervals (monthly/yearly), and customer rules.
                                          </p>
                                        </div>
                                        <Link
                                          href="/admin/plans"
                                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline pt-2"
                                        >
                                          Browse Subscription Plans →
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  );
}
