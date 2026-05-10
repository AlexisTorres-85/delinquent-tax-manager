'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Check, Minus } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

// Define the variants for the Checkbox using cva.
const checkboxVariants = cva(
  `
    group peer bg-background shrink-0 rounded-md border border-input ring-offset-background focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10
    [[data-invalid=true]_&]:border-destructive/60 [[data-invalid=true]_&]:ring-destructive/10
    `,
  {
    variants: {
      size: {
        sm: 'size-4.5 [&_svg]:size-3',
        md: 'size-5 [&_svg]:size-3.5',
        lg: 'size-5.5 [&_svg]:size-4',
      },
      variant: {
        default:
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground',
        primary:
          'data-[state=checked]:bg-[var(--btn-primary)] data-[state=checked]:border-[var(--btn-primary-border)] data-[state=checked]:text-[var(--btn-primary-fg)] data-[state=indeterminate]:bg-[var(--btn-primary)] data-[state=indeterminate]:border-[var(--btn-primary-border)] data-[state=indeterminate]:text-[var(--btn-primary-fg)]',
        secondary:
          'data-[state=checked]:bg-[var(--btn-secondary)] data-[state=checked]:border-[var(--btn-secondary-border)] data-[state=checked]:text-[var(--btn-secondary-fg)] data-[state=indeterminate]:bg-[var(--btn-secondary)] data-[state=indeterminate]:border-[var(--btn-secondary-border)] data-[state=indeterminate]:text-[var(--btn-secondary-fg)]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

function Checkbox({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root data-slot="checkbox" className={cn(checkboxVariants({ size, variant }), className)} {...props}>
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className="group-data-[state=indeterminate]:hidden" />
        <Minus className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
