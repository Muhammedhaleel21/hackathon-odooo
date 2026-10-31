'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardPath } from '../../hooks/use-auth';
import { registerApi } from '../../lib/queries/auth';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Check,
  X,
  Loader2,
  ArrowRight,
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
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      )}
      <span className={satisfied ? 'text-emerald-400' : 'text-gray-400'}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-purple-950/40">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Create an account
        </h1>
        <p className="text-sm text-gray-400 mt-1.5">
          Join Brightloop Subscription Management
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Confirm Password
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

        {/* Password Requirements Checklist */}
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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
