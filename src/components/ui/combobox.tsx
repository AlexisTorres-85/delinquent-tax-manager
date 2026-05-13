'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  label?: string;
  labelVariant?: 'primary' | 'secondary';
  wrapperClassName?: string;
  className?: string;
  id?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  label,
  labelVariant,
  wrapperClassName,
  className,
  id,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const generatedId = React.useId();
  const triggerId = id ?? (label ? generatedId : undefined);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const trigger = (
    <PopoverTrigger asChild>
      <Button
        id={triggerId}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn('w-full justify-between font-normal', className)}
      >
        <span className={cn(!selectedLabel && 'text-muted-foreground')}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );

  const content = (
    <PopoverContent className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
      <Command filter={(value, search) => {
        const option = options.find((o) => o.value === value);
        if (!option) return 0;
        return option.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
      }}>
        <CommandInput placeholder={searchPlaceholder} />
        <CommandList>
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(current) => {
                  onValueChange(current === value ? '' : current);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );

  if (label) {
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        <Label htmlFor={triggerId} variant={labelVariant}>
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          {trigger}
          {content}
        </Popover>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {trigger}
      {content}
    </Popover>
  );
}
