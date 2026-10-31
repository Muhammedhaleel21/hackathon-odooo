'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '@/lib/queries/health';

export function ApiStatus() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30_000, // re-check every 30s
  });

  const status = isLoading ? 'checking' : isError ? 'disconnected' : 'connected';

  const statusConfig = {
    checking: {
      dot: 'bg-amber-400 animate-pulse',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      label: 'Checking…',
      text: 'Verifying backend and database connectivity',
    },
    connected: {
      dot: 'bg-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      label: 'All Systems Operational',
      text: 'Backend connected · Database reachable',
    },
    disconnected: {
      dot: 'bg-red-400 animate-pulse',
      badge: 'bg-red-500/10 text-red-400 border-red-500/20',
      label: 'Backend Unavailable',
      text: 'Could not reach the API — ensure NestJS is running on port 4000',
    },
  } as const;

  const cfg = statusConfig[status];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        {/* Animated status dot */}
        <div className="relative mt-0.5 flex-shrink-0">
          <span className={`block h-3 w-3 rounded-full ${cfg.dot}`} />
          {status === 'connected' && (
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm font-semibold text-white">System Status</p>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/50">{cfg.text}</p>

          {/* Extra details when connected */}
          {status === 'connected' && data && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { label: 'Service', value: data.service },
                { label: 'Database', value: data.database },
                {
                  label: 'Checked at',
                  value: new Date(data.timestamp).toLocaleTimeString(),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg bg-white/5 px-3 py-2 border border-white/5"
                >
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white/80">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
