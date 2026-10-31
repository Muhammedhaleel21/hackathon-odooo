'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordApi } from '../../lib/queries/auth';
import {
  Eye,
  EyeOff,
  Lock,
  Check,
  X,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password rules validation
  const hasMinLength = newPassword.length >= 9;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasSpecial &&
    passwordsMatch &&
    !!token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Missing reset token. Please request a new reset link.');
      return;
    }

    if (!isFormValid) {
      setError('Please fulfill all password requirements.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await resetPasswordApi({ token, newPassword });
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password. The link may have expired.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const RuleItem = ({
    satisfied,
    label,
  }: {
    satisfied: boolean;
    label: string;
  }) => (
    <div className="flex items-center gap-1.5 text-xs">
      {satisfied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      )}
      <span className={satisfied ? 'text-emerald-400' : 'text-gray-400'}>
        {label}
      </span>
    </div>
  );

  if (!token) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
        <p className="text-sm text-gray-400">
          No password reset token was provided in the URL. Please request a new
          password reset link.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-white/10 hover:bg-white/15 transition-all mt-4"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-purple-950/40">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Create new password
        </h1>
        <p className="text-sm text-gray-400 mt-1.5">
          Enter and confirm your new password below
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Password reset successful
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Your password has been securely updated. You can now log in with your
              new credentials.
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Password requirements:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <RuleItem satisfied={hasMinLength} label="9+ characters" />
                <RuleItem satisfied={hasUppercase} label="Uppercase letter" />
                <RuleItem satisfied={hasLowercase} label="Lowercase letter" />
                <RuleItem satisfied={hasSpecial} label="Special character" />
              </div>
              {confirmPassword && (
                <div className="pt-1 border-t border-white/5">
                  <RuleItem satisfied={passwordsMatch} label="Passwords match" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full mt-6 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
