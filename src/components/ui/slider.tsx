'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

interface SliderContextValue {
  value: number[];
  min: number;
  max: number;
  showValueLabel?: boolean;
  valueLabelFormatter: (value: number) => string;
  thumbColor?: string;
}

const SliderContext = React.createContext<SliderContextValue | null>(null);

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  trackClassName?: string;
  rangeClassName?: string;
  showValueLabel?: boolean;
  showMarks?: boolean;
  marks?: number[];
  valueLabelFormatter?: (value: number) => string;
  gradientColor?: string;
  thumbColor?: string;
}

const THUMB_SAFE_PADDING = 6;

function Slider({
  className,
  children,
  trackClassName,
  rangeClassName,
  showValueLabel = false,
  showMarks = false,
  marks = [],
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  valueLabelFormatter = (value) => String(value),
  gradientColor,
  thumbColor,
  onValueChange,
  ...props
}: SliderProps) {
  const initialValue = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(defaultValue)) return defaultValue;
    return [min];
  }, []);

  const [internalValue, setInternalValue] = React.useState<number[]>(initialValue);

  const currentValue = Array.isArray(value) ? value : internalValue;

  const getPercent = React.useCallback(
    (mark: number) => {
      if (max === min) return 0;
      return ((mark - min) / (max - min)) * 100;
    },
    [min, max]
  );

  function handleValueChange(nextValue: number[]) {
    if (!Array.isArray(value)) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <SliderContext.Provider
      value={{
        value: currentValue,
        min,
        max,
        showValueLabel,
        valueLabelFormatter,
        thumbColor,
      }}
    >
      <div className={cn('w-full border border-white/80 bg-gradient-to-b from-slate-200 to-slate-100', className)}>
        <SliderPrimitive.Root
          data-slot="slider"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onValueChange={handleValueChange}
          className="relative flex w-full touch-none select-none items-center"
          style={{
            paddingLeft: THUMB_SAFE_PADDING,
            paddingRight: THUMB_SAFE_PADDING,
          }}
          {...props}
        >
          {/* Marks above the slider */}
          {showMarks && marks.length > 0 && (
            <div
              className="pointer-events-none absolute top-1/2 h-8 -translate-y-[30px]"
              style={{
                left: THUMB_SAFE_PADDING,
                right: THUMB_SAFE_PADDING,
              }}
            >
              {marks.map((mark, index) => {
                const isFirst = index === 0;
                const isLast = index === marks.length - 1;

                const labelTransform = isFirst
                  ? 'translateX(0)'
                  : isLast
                    ? 'translateX(-100%)'
                    : 'translateX(-50%)';

                return (
                  <div
                    key={mark}
                    className="absolute top-0 h-full"
                    style={{
                      left: isFirst
                        ? '1px'
                        : isLast
                          ? 'calc(100% - 1px)'
                          : `${getPercent(mark)}%`,
                    }}
                  >
                    <span
                      className="absolute top-0 whitespace-nowrap text-xs font-medium leading-none text-slate-500"
                      style={{
                        transform: labelTransform,
                        left: isFirst
                          ? '4px'
                          : isLast
                            ? 'calc(100% - 4px)'
                            : `${getPercent(mark)}%`,
                      }}
                    >
                      {valueLabelFormatter(mark)}
                    </span>

                    <span
                      className={cn(
                        'absolute  w-px bg-slate-600/70',
                        isFirst || isLast ? 'top-[0px] h-[25px]' : 'top-[15px] h-[10px]'
                      )}
                      style={{ transform: 'translateX(-50%)' }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <SliderPrimitive.Track
            className={cn(
              'relative h-2 w-full overflow-hidden',
              trackClassName
            )}
          >
            <SliderPrimitive.Range
              className={cn(
                'absolute h-full',
                !gradientColor && 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-500',
                rangeClassName
              )}
              style={gradientColor ? { background: gradientColor } : undefined}
            />
          </SliderPrimitive.Track>

          {children}
        </SliderPrimitive.Root>
      </div>
    </SliderContext.Provider>
  );
}

interface SliderThumbProps extends React.ComponentProps<typeof SliderPrimitive.Thumb> {
  index?: number;
}

function SliderThumb({ className, index = 0, ...props }: SliderThumbProps) {
  const context = React.useContext(SliderContext);

  const value = context?.value[index] ?? 0;
  const label = context?.valueLabelFormatter(value) ?? String(value);
  const thumbColor = context?.thumbColor;

  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        'relative box-content block size-4 shrink-0 cursor-pointer rounded-full border-0',
        !thumbColor && 'bg-lime-500',
        'shadow-[0_1px_3px_rgba(0,0,0,0.25)] outline-none',
        !thumbColor && 'focus-visible:ring-1 focus-visible:ring-lime-500/35 focus-visible:ring-offset-1',
        className
      )}
      style={thumbColor ? { backgroundColor: thumbColor } : undefined}
      {...props}
    >
      {context?.showValueLabel && (
        <span className="pointer-events-none absolute left-1/2 top-[-56px] -translate-x-1/2">
          <span className="relative flex h-10 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm">
            {label}

            <span className="absolute -bottom-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white" />
          </span>
        </span>
      )}
    </SliderPrimitive.Thumb>
  );
}

export { Slider, SliderThumb };