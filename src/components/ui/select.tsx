'use client';

import * as React from 'react';
import { isValidElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Label } from '@/components/ui/label';

// Create a Context for `indicatorPosition` and `indicator` control
const SelectContext = React.createContext<{
  indicatorPosition: 'left' | 'right';
  indicatorVisibility: boolean;
  indicator: ReactNode;
  variant: 'default' | 'glass';
}>({ indicatorPosition: 'left', indicator: null, indicatorVisibility: true, variant: 'default' });

// Root Component
const Select = ({
  indicatorPosition = 'left',
  indicatorVisibility = true,
  indicator,
  variant = 'default',
  ...props
}: {
  indicatorPosition?: 'left' | 'right';
  indicatorVisibility?: boolean;
  indicator?: ReactNode;
  variant?: 'default' | 'glass';
} & React.ComponentProps<typeof SelectPrimitive.Root>) => {
  return (
    <SelectContext.Provider value={{ indicatorPosition, indicatorVisibility, indicator, variant }}>
      <SelectPrimitive.Root {...props} />
    </SelectContext.Provider>
  );
};

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

// Define size variants for SelectTrigger
const selectTriggerVariants = cva(
  `
    flex w-full items-center justify-between outline-none border transition-shadow
    disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10
  `,
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs gap-1 rounded-md',
        md: 'h-8.5 px-3 text-[0.8125rem] leading-(--text-sm--line-height) gap-1 rounded-md',
        lg: 'h-10 px-4 text-sm gap-1.5 rounded-md',
      },
      variant: {
        default:
          'bg-background border-input shadow-xs shadow-black/5 text-foreground data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30',
        glass:
          'bg-white/10 border-white/20 backdrop-blur-sm text-white data-placeholder:text-white/60 focus-visible:border-white/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/20 shadow-none',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

function SelectTrigger({ className, children, size, variant: variantProp, ...props }: SelectTriggerProps) {
  const { variant: contextVariant } = React.useContext(SelectContext);
  const resolvedVariant = variantProp ?? contextVariant;
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ size, variant: resolvedVariant }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-60 -me-0.5" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { variant } = React.useContext(SelectContext);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md text-secondary-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          variant === 'glass'
            ? 'bg-white/15 backdrop-blur-md border-white/20 shadow-black/30'
            : 'bg-popover border-border shadow-black/5',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1.5 data-[side=left]:-translate-x-1.5 data-[side=right]:translate-x-1.5 data-[side=top]:-translate-y-1.5',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1.5',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('py-1.5 ps-8 pe-2 text-xs text-muted-foreground font-medium', className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const { indicatorPosition, indicatorVisibility, indicator, variant } = React.useContext(SelectContext);

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50',
        variant === 'glass'
          ? 'text-white hover:bg-white/20 focus:bg-white/20'
          : 'text-foreground hover:bg-accent focus:bg-accent',
        indicatorPosition === 'left' ? 'ps-8 pe-2' : 'pe-8 ps-2',
        className,
      )}
      {...props}
    >
      {indicatorVisibility &&
        (indicator && isValidElement(indicator) ? (
          indicator
        ) : (
          <span
            className={cn(
              'absolute flex h-3.5 w-3.5 items-center justify-center',
              indicatorPosition === 'left' ? 'start-2' : 'end-2',
            )}
          >
            <SelectPrimitive.ItemIndicator>
              <Check className={cn('h-4 w-4', variant === 'glass' ? 'text-white' : 'text-primary')} />
            </SelectPrimitive.ItemIndicator>
          </span>
        ))}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectIndicator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ItemIndicator>) {
  const { indicatorPosition } = React.useContext(SelectContext);

  return (
    <span
      data-slot="select-indicator"
      className={cn(
        'absolute flex top-1/2 -translate-y-1/2 items-center justify-center',
        indicatorPosition === 'left' ? 'start-2' : 'end-2',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator>{children}</SelectPrimitive.ItemIndicator>
    </span>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('-mx-1.5 my-1.5 h-px bg-border', className)}
      {...props}
    />
  );
}

function SelectField({
  label,
  labelVariant,
  wrapperClassName,
  id,
  size = 'sm',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  label?: string;
  labelVariant?: 'primary' | 'secondary';
  wrapperClassName?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const generatedId = React.useId();
  const triggerId = id ?? (label ? generatedId : undefined);

  type TriggerProps = { id?: string; size?: 'sm' | 'md' | 'lg' };

  const mapChildren = (child: React.ReactNode) => {
    if (React.isValidElement(child) && (child.type as { displayName?: string; name?: string })?.name === 'SelectTrigger') {
      const childSize = (child.props as TriggerProps).size;
      return React.cloneElement(child as React.ReactElement<TriggerProps>, {
        ...(triggerId !== undefined && { id: triggerId }),
        size: childSize ?? size,
      });
    }
    return child;
  };

  if (label) {
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        <Label htmlFor={triggerId} variant={labelVariant}>
          {label}
        </Label>
        <Select {...props}>
          {React.Children.map(children, mapChildren)}
        </Select>
      </div>
    );
  }

  return <Select {...props}>{React.Children.map(children, mapChildren)}</Select>;
}

export {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
