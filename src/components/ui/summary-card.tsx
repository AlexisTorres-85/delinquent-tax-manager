import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function SummaryCard({
  icon,
  label,
  value,
  tone = 'default',
  iconClassName = 'size-11',
  isLoading = false,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  tone?: 'default' | 'danger' | 'success';
  iconClassName?: string;
  isLoading?: boolean;
}) {
  const toneClass =
    tone === 'danger'
      ? 'text-destructive'
      : tone === 'success'
        ? 'text-emerald-700'
        : 'text-app-primary';

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/40 bg-white/50 p-4 shadow-xs backdrop-blur-lg">
      {isLoading && (
        <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-white/70 shadow-xs backdrop-blur-sm">
          <Loader2 className="size-3.5 animate-spin text-app-primary" />
        </div>
      )}

      <div className="flex items-center gap-3">
        {isLoading ? (
          <>
            <div
              className={`shrink-0 animate-pulse rounded-md bg-white/70 ${iconClassName}`}
            />

            <div className="min-w-0 flex-1 space-y-2 pr-7">
              <div className="h-4 w-24 animate-pulse rounded-md bg-white/70" />
              <div className="h-3 w-32 animate-pulse rounded-md bg-white/60" />
            </div>
          </>
        ) : (
          <>
            <div
              className={`flex shrink-0 items-center justify-center rounded-md bg-white/60 ${iconClassName}`}
            >
              {icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase text-black">
                {label}
              </p>

              <div className={`min-w-0 truncate text-xs font-semibold ${toneClass}`}>
                {value}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}