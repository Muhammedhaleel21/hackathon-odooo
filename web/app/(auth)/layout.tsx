import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background radial ambient glow effects */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Top bar with back link */}
      <header className="p-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Brightloop
        </Link>
      </header>

      {/* Center content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        {children}
      </main>

      {/* Footer info */}
      <footer className="p-6 text-center text-xs text-gray-600 relative z-10">
        Brightloop Subscription Management Platform &copy; 2026
      </footer>
    </div>
  );
}
