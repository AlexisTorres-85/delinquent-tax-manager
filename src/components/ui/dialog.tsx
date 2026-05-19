'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { LOADING_MODAL_CONTENT_TRANSITION } from '@/config/general.config';

const dialogContentVariants = cva(
  'flex flex-col fixed outline-0 z-50 border border-border bg-background shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-h-[90dvh] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'left-[50%] top-[50%] max-w-lg translate-x-[-50%] translate-y-[-50%] w-full',
        fullscreen: 'inset-5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

// ── Internal loading overlay ──────────────────────────────────────────────────
function DialogLoadingOverlay({ isLoading }: { isLoading: boolean }) {
  const [rendered, setRendered] = React.useState(isLoading);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) {
      setRendered(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), LOADING_MODAL_CONTENT_TRANSITION);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (!rendered) return null;

  return (
    <div
      className="absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
      style={{
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? 'blur(3px)' : 'blur(0px)',
        backgroundColor: visible ? 'hsl(var(--background) / 0.65)' : 'transparent',
        transition: `opacity ${LOADING_MODAL_CONTENT_TRANSITION}ms ease, backdrop-filter ${LOADING_MODAL_CONTENT_TRANSITION}ms ease, background-color ${LOADING_MODAL_CONTENT_TRANSITION}ms ease`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="h-8 w-8 shrink-0 animate-spin rounded-full border-[3px] border-muted-foreground/30 border-t-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50 [backdrop-filter:blur(4px)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  overlay = true,
  variant,
  isLoading = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean;
    overlay?: boolean;
    isLoading?: boolean;
  }) {
  return (
    <DialogPortal>
      {overlay && <DialogOverlay />}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ variant }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="cursor-pointer outline-0 absolute end-5 top-5 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="size-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
        <DialogLoadingOverlay isLoading={isLoading} />
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export default DialogContent;

const DialogHeader = ({
  className,
  icon,
  subtitle,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  subtitle?: string;
}) => {
  if (icon !== undefined || subtitle !== undefined) {
    return (
      <div
        data-slot="dialog-header"
        className={cn('flex items-center gap-3 border-b bg-muted text-app-primary border-divider px-6 py-4', className)}
        {...props}
      >
        <div className="flex items-center justify-center size-11 shrink-0 rounded-xl bg-app-primary/20 text-app-primary [&>svg]:size-6">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          {children}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col space-y-1 text-center sm:text-start mb-5', className)}
      {...props}
    />
  );
};

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn('flex flex-col-reverse sm:flex-row bg-muted sm:justify-end gap-2 px-6 py-4 border-t border-divider shrink-0', className)}
    {...props}
  />
);

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="dialog-body" className={cn('overflow-y-auto px-6 bg-white', className)} {...props} />
);

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('px-6 py-4 text-sm bg-muted border-b-1 border-divider mb-4', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
