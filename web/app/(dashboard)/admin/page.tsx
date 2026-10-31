'use client';

import React, { useState } from 'react';
import { useAuth, getDashboardPath } from '../../../hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllStaffApi,
  createStaffApi,
  updateStaffStatusApi,
} from '../../../lib/queries/auth';
import {
  Shield,
  UserPlus,
  Users,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreatingStaff, setIsCreatingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch staff list
  const {
    data: staffList,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useQuery({
    queryKey: ['staff'],
    queryFn: getAllStaffApi,
    enabled: user?.role === 'admin',
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

  // Role Guard
  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied (403)</h2>
        <p className="text-sm text-gray-400 mb-6">
          The Admin Dashboard is strictly restricted to system administrators. Your
          current role is <span className="font-semibold text-white uppercase">{user.role}</span>.
        </p>
        <Link
          href={getDashboardPath(user.role)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white transition-all"
        >
          Go to My Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/20 to-black border border-purple-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
              <Shield className="w-3.5 h-3.5" />
              Full System Privileges
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Admin Command Center
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Complete control over the Brightloop platform. Manage staff accounts,
              role permissions, and prepare system-wide configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingStaff(!isCreatingStaff)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {isCreatingStaff ? 'Close Form' : 'New Staff Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Create Staff Form Card (Collapsible) */}
      {isCreatingStaff && (
        <div className="p-6 rounded-2xl bg-gray-900/80 border border-purple-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Create Internal Staff Member</h3>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Only administrators can provision staff accounts. The backend strictly assigns
            the operational <code className="text-purple-300">staff</code> role.
          </p>

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="Alex Thomas"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                Work Email
              </label>
              <input
                type="email"
                required
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                placeholder="alex@brightloop.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                Initial Password
              </label>
              <input
                type="password"
                required
                value={newStaffPassword}
                onChange={(e) => setNewStaffPassword(e.target.value)}
                placeholder="Min 9 chars (e.g. Staff@1234)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsCreatingStaff(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Staff...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Management Table */}
      <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Staff Accounts</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300">
              {staffList?.length || 0}
            </span>
          </div>
        </div>

        {isLoadingStaff ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2 text-purple-400" />
            Loading staff accounts...
          </div>
        ) : staffError ? (
          <div className="p-4 rounded-xl bg-red-500/10 text-red-400 text-sm">
            Failed to load staff list: {(staffError as Error).message}
          </div>
        ) : staffList && staffList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-black/40 text-gray-400 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffList.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{member.name}</td>
                    <td className="px-4 py-3 text-gray-400">{member.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {member.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: member.id,
                            isActive: !member.isActive,
                          })
                        }
                        disabled={toggleStatusMutation.isPending}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                          member.isActive
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-emerald-400 hover:bg-emerald-500/10'
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
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-400">No staff members created yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Click &quot;New Staff Account&quot; above to create your first operational staff user.
            </p>
          </div>
        )}
      </div>

      {/* RBAC Permission Matrix Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Administrator</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Full platform governance: Staff account provisioning, system settings, financial
            auditing, and security configuration.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">Staff Member</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Operational workflows: Quotations, subscription tracking, invoice management, and
            customer customer service.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-gray-900/40 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Customer</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Self-service portal: View own subscriptions, invoices, and update profile securely.
          </p>
        </div>
      </div>
    </div>
  );
}
