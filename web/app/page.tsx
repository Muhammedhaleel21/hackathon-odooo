import Link from 'next/link';
import { ApiStatus } from '@/components/shared/api-status';
import { Navbar } from '@/components/shared/navbar';
import {
  Shield,
  UserCheck,
  User,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-purple-500 selection:text-white">
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-purple-600/15 blur-[140px]" />
          <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">
                Phase 2 · Authentication & RBAC Active
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Role-Based Access Control for{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Subscriptions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Production-ready multi-role authentication built with Argon2id, rotating
              refresh tokens, HttpOnly cookies, and strict NestJS authorization guards.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:opacity-95 shadow-lg shadow-purple-500/25 transition-all"
              >
                Sign In to Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Create Customer Account
              </Link>
            </div>
          </div>

          {/* Seed Credentials Quick-Access Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/60 border border-purple-500/20 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Initial Seeded Credentials for Testing
                  </h2>
                  <p className="text-xs text-gray-400">
                    Use these credentials to test the multi-role security flows
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                Seeded in Neon DB
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 uppercase tracking-wider">
                    Administrator
                  </span>
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-gray-400">
                  Email: <code className="text-white">admin@brightloop.local</code>
                </p>
                <p className="text-gray-400">
                  Password: <code className="text-white">Admin@Brightloop123</code>
                </p>
                <p className="text-[11px] text-gray-500 pt-1">
                  Full control: create staff, system policies
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 uppercase tracking-wider">
                    Staff Member
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-gray-400">Created via Admin Dashboard</p>
                <p className="text-gray-400">
                  Endpoint: <code className="text-white">POST /api/v1/staff</code>
                </p>
                <p className="text-[11px] text-gray-500 pt-1">
                  Operational: quotations, customer directory
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">
                    Customer
                  </span>
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-gray-400">Public Registration</p>
                <p className="text-gray-400">
                  Page: <code className="text-white">/register</code>
                </p>
                <p className="text-[11px] text-gray-500 pt-1">
                  Self-service: isolated profile & subscriptions
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Highlights & Live Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Security Architecture
              </h2>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Argon2id Hashing:</strong> Passwords,
                    refresh tokens, and password reset tokens are protected using
                    hardened cryptographic one-way hashing.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Rotating Refresh Tokens:</strong> Tokens
                    are issued via HttpOnly, SameSite cookies with automatic rotation
                    on every refresh to defeat token reuse.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Server-Enforced RBAC:</strong> NestJS
                    Guards (`JwtAuthGuard` + `RolesGuard`) verify user status and permissions
                    against active database records on every request.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Live System Status</h2>
              <ApiStatus />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        Brightloop Subscription Management Platform &copy; 2026 · Phase 2 Complete
      </footer>
    </div>
  );
}
