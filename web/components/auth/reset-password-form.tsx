'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordApi } from '../../lib/queries/auth';
import {
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
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
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      )}
        <span className={satisfied ? 'text-emerald-700 font-semibold' : 'text-[#64748B]'}>
          {label}
        </span>
    </div>
  );

  if (!token) {
    return (
          <div className="w-full p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
              <h2 className="text-lg font-bold text-[#0F172A]">Invalid Reset Link</h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                No password reset token was provided in the URL. Please request a new
                password reset link.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#0F172A] text-white hover:bg-slate-800 transition-all mt-4"
              >
                Request New Link
              </Link>
          </div>
          );
  }

          return (
                <div className="w-full space-y-6">
                  <div className="text-left space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                      Create new password
                    </h1>
                      <p className="text-xs sm:text-sm text-[#64748B]">
                        Enter and confirm your new password below
                      </p>
                  </div>

                  {isSuccess ? (
                        <div className="space-y-5 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                              <h3 className="text-sm font-bold text-[#0F172A]">
                                Password reset successful
                              </h3>
                                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                                  Your password has been securely updated. You can now log in with your
                                  new credentials.
                                </p>
                              </div>
                              <button
                                onClick={() => router.push('/login')}
                                className="w-full h-11 rounded-xl font-bold text-xs text-[#0F172A] bg-[#C8E63C] hover:bg-[#B8DC30] transition-all cursor-pointer shadow-sm"
                              >
                                Go to Sign In
                              </button>
                          </div>
                          ) : (
        <>
                            {error && (
                                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 shrink-0" />
                                  <span>{error}</span>
                                </div>
          )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                  <div>
                                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                                        New Password
                                      </label>
                                      <div className="relative">
                                        <input
                                          type={showPassword ? 'text' : 'password'}
                                          required
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          placeholder="••••••••••••"
                                          className="w-full h-11 pl-3.5 pr-11 rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]/60 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8E63C] focus:border-[#C8E63C] transition-all"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setShowPassword(!showPassword)}
                                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
                                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                                        Confirm New Password
                                      </label>
                                      <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]/60 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8E63C] focus:border-[#C8E63C] transition-all"
                                      />
                                  </div>

                                  {/* Checklist */}
                                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                          Password Requirements
                                        </p>
                                        <div className="grid grid-cols-2 gap-1.5">
                                          <RuleItem satisfied={hasMinLength} label="9+ characters" />
                                          <RuleItem satisfied={hasUppercase} label="Uppercase letter" />
                                          <RuleItem satisfied={hasLowercase} label="Lowercase letter" />
                                          <RuleItem satisfied={hasSpecial} label="Special character" />
                                        </div>
                                        {confirmPassword && (
                <div className="pt-1.5 border-t border-slate-200">
                  <RuleItem satisfied={passwordsMatch} label="Passwords match" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full h-11 rounded-xl font-bold text-xs text-[#0F172A] bg-[#C8E63C] hover:bg-[#B8DC30] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
                                    </>
      )}
                                  </div>
                                  );
}
