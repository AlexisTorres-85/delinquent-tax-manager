'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Label } from '@/components/ui/label';

// Define input size variants
const textareaVariants = cva(
  `
    w-full bg-background border border-input bg-background text-foreground shadow-xs shadow-black/5 transition-[color,box-shadow] 
    text-foreground placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] 
    focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 [&[readonly]]:opacity-70 aria-invalid:border-destructive
    aria-invalid:border-destructive/60 aria-invalid:ring-destructive/10
  `,
  {
    variants: {
      variant: {
        sm: 'px-2.5 py-2.5 text-xs rounded-md',
        md: 'px-3 py-3 text-[0.8125rem] leading-(--text-sm--line-height) rounded-md',
        lg: 'px-4 py-4 text-sm rounded-md',
      },
    },
    defaultVariants: {
      variant: 'md',
    },
  },
);

function Textarea({
  className,
  variant,
  label,
  labelVariant,
  id,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants> & {
  label?: string;
  labelVariant?: 'primary' | 'secondary';
}) {
  const generatedId = React.useId();
  const textareaId = id ?? (label ? generatedId : undefined);

  if (label) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={textareaId} variant={labelVariant}>
          {label}
          {props.required && <span className="text-destructive"> *</span>}
        </Label>
        <textarea
          data-slot="textarea"
          id={textareaId}
          className={cn(textareaVariants({ variant }), className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <textarea
      data-slot="textarea"
      id={textareaId}
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
