'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordApi } from '../../lib/queries/auth';
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await forgotPasswordApi({ email });
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset link',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
          <div className="w-full space-y-6">
            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Reset password
              </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Enter your email to receive password reset instructions
                </p>
            </div>

            {isSubmitted ? (
                  <div className="space-y-5 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#0F172A]">Check your email</h3>
                        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                          If an account exists with{' '}
                          <strong className="text-[#0F172A]">{email}</strong>, we have
                          sent a link to reset your password. The link expires in 15 minutes.
                        </p>
                    </div>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#0F172A] text-white hover:bg-slate-800 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </Link>
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
                                Email Address
                              </label>
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]/60 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8E63C] focus:border-[#C8E63C] transition-all"
                              />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 rounded-xl font-bold text-xs text-[#0F172A] bg-[#C8E63C] hover:bg-[#B8DC30] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending link...
                              </>
                            ) : (
                              'Send Reset Link'
                            )}
                          </button>
                        </form>

                          <div className="text-center pt-2">
                            <Link
                              href="/login"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              Back to Sign In
                            </Link>
                          </div>
                        </>
      )}
                      </div>
                    );
}
