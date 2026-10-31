'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/use-auth';
import { changePasswordApi } from '../../../lib/queries/auth';
import {
  User,
  ShieldCheck,
  CreditCard,
  KeyRound,
  CheckCircle,
  Loader2,
  Lock,
} from 'lucide-react';

export default function CustomerPortalPage() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 9) {
      setPasswordError('New password must be at least 9 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await changePasswordApi({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Failed to change password',
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-black border border-emerald-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-3">
          <User className="w-3.5 h-3.5" />
          Customer Self-Service
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Manage your personal account, view your active subscriptions, access invoices,
          and configure security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{user?.name}</h3>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Account Role</span>
              <span className="font-semibold text-emerald-400 uppercase">
                {user?.role}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Account ID</span>
              <span className="font-mono text-gray-400 text-[11px] truncate max-w-[150px]">
                {user?.id}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              Your customer data is strictly isolated. You only have access to your own
              records, subscriptions, and invoices.
            </p>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-6">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Security & Password</h3>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 9 chars (upper, lower, special)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="py-2.5 px-5 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Subscriptions & Invoices Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gray-900/40 border border-white/5 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white">My Subscriptions</h3>
          <p className="text-xs text-gray-400">
            You do not currently have any active subscriptions. In Phase 3, you can view and
            renew your plans here.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900/40 border border-white/5 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white">My Invoices</h3>
          <p className="text-xs text-gray-400">
            No invoices have been issued yet. Billing statements will appear here upon subscription
            activation.
          </p>
        </div>
      </div>
    </div>
  );
}
