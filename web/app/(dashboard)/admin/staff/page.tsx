'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllStaffApi,
  createStaffApi,
  updateStaffStatusApi,
} from '../../../../lib/queries/auth';
import { StaffUser } from '../../../../types/auth';
import {
  Users,
  UserPlus,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

export default function StaffManagementPage() {
  const queryClient = useQueryClient();

  const [isCreatingStaff, setIsCreatingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch staff list
  const { data: staffList, isLoading: isLoadingStaff } = useQuery<StaffUser[]>({
    queryKey: ['staff'],
    queryFn: getAllStaffApi,
  });

  // Create staff mutation
  const createMutation = useMutation({
    mutationFn: createStaffApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setIsCreatingStaff(false);
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffPassword('');
      setFormError(null);
    },
    onError: (err: Error) => {
      setFormError(err.message || 'Failed to create staff account');
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateStaffStatusApi(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (newStaffPassword.length < 9) {
      setFormError('Staff password must be at least 9 characters.');
      return;
    }

    createMutation.mutate({
      name: newStaffName,
      email: newStaffEmail,
      password: newStaffPassword,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Staff Accounts
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage operational team members who handle customer quotations, orders, and support.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingStaff(!isCreatingStaff)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          {isCreatingStaff ? 'Close Form' : 'New Staff Account'}
        </button>
      </div>

      {/* Create Staff Form Card */}
      {isCreatingStaff && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <div className="text-sm font-bold text-[#0F172A]">
            Provision Internal Staff Account
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="Alex Thomas"
                className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:border-[#94A3B8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                required
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                placeholder="alex@brightloop.com"
                className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:border-[#94A3B8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Initial Password
              </label>
              <input
                type="password"
                required
                value={newStaffPassword}
                onChange={(e) => setNewStaffPassword(e.target.value)}
                placeholder="Min 9 chars (e.g. Staff@1234)"
                className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:border-[#94A3B8]"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingStaff(false)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? 'Provisioning...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table Card */}
      <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
        {isLoadingStaff ? (
          <div className="py-16 text-center text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C8E63C]" />
            Loading staff accounts...
          </div>
        ) : staffList && staffList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {staffList.map((member: StaffUser) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#0F172A]">
                      {member.name}
                    </td>
                    <td className="py-4 px-6 text-[#475569]">{member.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {member.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: member.id,
                            isActive: !member.isActive,
                          })
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer ${member.isActive
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-sm text-[#94A3B8]">
            No staff accounts found. Click &quot;New Staff Account&quot; to add one.
          </div>
        )}
      </div>
    </div>
  );
}