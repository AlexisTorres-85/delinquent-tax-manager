import { type ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LOADING_MODAL_CONTENT_TRANSITION } from '@/config/general.config';

const spinnerSizes = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

interface DataLoaderProps {
  /** When true the overlay is shown. Defaults to true when no children are provided. */
  loading?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  /** When provided, renders as an overlay wrapper — content stays visible but blurred. */
  children?: ReactNode;
  className?: string;
}

// ── Animated overlay (used in wrapper mode) ───────────────────────────────────
function LoadingOverlay({ loading, message, spinner }: { loading: boolean; message: string; spinner: ReactNode }) {
  const [rendered, setRendered] = useState(loading);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setRendered(true);
      // next frame so the initial opacity:0 is painted before transitioning to 1
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), LOADING_MODAL_CONTENT_TRANSITION);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!rendered) return null;

  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden rounded-md"
      style={{
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? 'blur(2px)' : 'blur(0px)',
        backgroundColor: visible ? 'hsl(var(--background) / 0.5)' : 'transparent',
        transition: `opacity ${LOADING_MODAL_CONTENT_TRANSITION}ms ease, backdrop-filter ${LOADING_MODAL_CONTENT_TRANSITION}ms ease, background-color ${LOADING_MODAL_CONTENT_TRANSITION}ms ease`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center gap-3 px-6 py-5">
        {spinner}
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

export function DataLoader({
  loading = true,
  message = 'Loading...',
  size = 'md',
  children,
  className,
}: DataLoaderProps) {
  const spinner = (
    <div
      className={cn(
        'shrink-0 animate-spin rounded-full border-muted-foreground/30 border-t-muted-foreground',
        spinnerSizes[size],
      )}
    />
  );

  // ── Overlay mode (children provided) ───────────────────────────────────────
  if (children !== undefined) {
    return (
      <div className={cn('relative', className)}>
        {children}
        <LoadingOverlay loading={loading} message={message} spinner={spinner} />
      </div>
    );
  }

  // ── Standalone mode (no children — tab skeleton, etc.) ─────────────────────
  return (
    <div className={cn('relative min-h-40', className)}>
      <div className="absolute left-6 top-5 flex items-center gap-3">
        {spinner}
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}
