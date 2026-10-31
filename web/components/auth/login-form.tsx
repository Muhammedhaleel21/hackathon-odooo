'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardPath } from '../../hooks/use-auth';
import { Eye, EyeOff, Loader2, AlertCircle, KeyRound, ChevronDown, ChevronUp } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      const destination = getDashboardPath(user.role);
      router.push(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  const handleFillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
          <div className="w-full space-y-6">
            {/* Title & Subtitle */}
            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Welcome back
              </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Login to your account
                </p>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
      )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ibtisamkp2006@gmail.com"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]/60 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8E63C] focus:border-[#C8E63C] transition-all"
                      />
                  </div>

                  {/* Password Field */}
                  <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-[#475569]">
                            Password
                          </label>
                          <Link
                            href="/forgot-password"
                            className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl font-bold text-xs text-[#0F172A] bg-[#C8E63C] hover:bg-[#B8DC30] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
            'Login'
          )}
                    </button>
                </form>

                  {/* Switch to Register */}
                  <div className="text-center text-xs text-[#64748B] pt-2">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/register"
                      className="font-bold text-[#0F172A] hover:underline"
                    >
                      Sign up
                    </Link>
                  </div>

                  {/* Demo Quick-Fill Credentials Helper */}
                  <div className="pt-4 border-t border-[#F1F5F9]">
                    <button
                      type="button"
                      onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#0F172A]" />
                        Demo Accounts for Hackathon Review
                      </span>
                      {showDemoCredentials ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {showDemoCredentials && (
                      <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                        <button
                          type="button"
                          onClick={() =>
                            handleFillCredentials('admin@brightloop.local', 'Admin@Brightloop123')
                          }
                          className="w-full text-left p-1.5 rounded hover:bg-white transition-colors flex items-center justify-between"
                        >
                          <span>
                            <strong className="text-[#0F172A]">Administrator:</strong> admin@brightloop.local
                          </span>
                          <span className="text-[#C8E63C] bg-[#0F172A] px-1.5 py-0.5 rounded font-mono text-[9px]">
                            Fill
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleFillCredentials('customer@brightloop.local', 'Customer@Brightloop123')
                          }
                          className="w-full text-left p-1.5 rounded hover:bg-white transition-colors flex items-center justify-between"
                        >
                          <span>
                            <strong className="text-[#0F172A]">Customer:</strong> customer@brightloop.local
                          </span>
                          <span className="text-[#C8E63C] bg-[#0F172A] px-1.5 py-0.5 rounded font-mono text-[9px]">
                            Fill
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                );
}
