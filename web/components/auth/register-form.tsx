'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardPath } from '../../hooks/use-auth';
import { registerApi } from '../../lib/queries/auth';
import {
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // Password rules validation
  const hasMinLength = password.length >= 9;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasSpecial &&
    passwordsMatch &&
    name.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please fulfill all password and account requirements.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await registerApi({ name, email, password });
      // Automatically log the user in after registration
      const user = await login(email, password);
      router.push(getDashboardPath(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsSubmitting(false);
    }
  };

  const RuleItem = ({ satisfied, label }: { satisfied: boolean; label: string }) => (
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

  return (
          <div className="w-full space-y-6">
            {/* Title & Subtitle */}
            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Create an account
              </h1>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Join Brightloop Subscription Management
                </p>
            </div>

            {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
      )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]/60 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8E63C] focus:border-[#C8E63C] transition-all"
                      />
                  </div>

                  <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]/60 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#C8E63C] focus:border-[#C8E63C] transition-all"
                      />
                  </div>

                  <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Password
                      </label>
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

                  <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Confirm Password
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

                  {/* Password Requirements Checklist */}
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

                        {/* Switch to Login */}
                        <div className="text-center text-xs text-[#64748B] pt-2">
                          Already have an account?{' '}
                          <Link
                            href="/login"
                            className="font-bold text-[#0F172A] hover:underline"
                          >
                            Sign in
                          </Link>
                        </div>
                      </div>
                      );
}
