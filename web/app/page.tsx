import { ApiStatus } from '@/components/shared/api-status';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] p-6">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-violet-300">
              Phase 1 · Foundation
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Brightloop{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Subscriptions
            </span>
          </h1>

          <p className="text-lg text-white/50">
            Subscription management system · Project foundation ready
          </p>
        </div>

        {/* System status card */}
        <ApiStatus />

        {/* Phase info cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { icon: '⚡', label: 'Next.js 16', desc: 'App Router' },
            { icon: '🦅', label: 'NestJS 12', desc: 'REST API' },
            { icon: '🐉', label: 'Drizzle ORM', desc: 'Neon PostgreSQL' },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm"
            >
              <div className="text-2xl">{icon}</div>
              <p className="mt-2 text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-white/40">{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/20">
          Brightloop Software · Phase 1 / 10
        </p>
      </div>
    </main>
  );
}

