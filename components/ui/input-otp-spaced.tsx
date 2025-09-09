"use client"

import { useId } from "react"
import { OTPInput, SlotProps } from "input-otp"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface OTPInputComponentProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  maxLength?: number
  className?: string
}

export default function OTPInputComponent({
  label,
  value = "",
  onChange,
  disabled = false,
  maxLength = 6,
  className
}: OTPInputComponentProps) {
  const id = useId()
  
  return (
    <div className={cn("*:not-first:mt-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <OTPInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        containerClassName="flex items-center gap-3 has-disabled:opacity-50"
        maxLength={maxLength}
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
    </div>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  )
}
