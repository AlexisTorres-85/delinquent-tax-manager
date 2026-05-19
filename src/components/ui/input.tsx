import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Input({
  className,
  type,
  label,
  labelVariant,
  wrapperClassName,
  id,
  ...props
}: React.ComponentProps<"input"> & {
  label?: string
  labelVariant?: "primary" | "secondary"
  wrapperClassName?: string
}) {
  const generatedId = React.useId()
  const inputId = id ?? (label ? generatedId : undefined)

  const input = (
    <input
      type={type}
      id={inputId}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-input bg-white px-2.5 py-1 text-base shadow-xs shadow-black/5 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )

  if (label) {
    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        <Label htmlFor={inputId} variant={labelVariant}>
          {label}
          {props.required && <span className="text-destructive"> *</span>}
        </Label>
        {input}
      </div>
    )
  }

  return input
}

function InputWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        "flex items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:focus-visible:ring-0 [&_[data-slot=input]]:h-auto [&_[data-slot=input]]:px-0 [&_[data-slot=input]]:py-0",
        className
      )}
      {...props}
    />
  )
}

export { Input, InputWrapper }
