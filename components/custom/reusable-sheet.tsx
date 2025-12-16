"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useDirection } from "@radix-ui/react-direction"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CustomSheetProps {
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "top" | "right" | "bottom" | "left"
}

/**
 * A reusable sheet component with customizable content
 * 
 * @example
 * ```tsx
 * <CustomSheet
 *   trigger={<Button>Open Sheet</Button>}
 *   title="Edit Profile"
 *   description="Make changes to your profile"
 * >
 *   <div>Your content here</div>
 * </CustomSheet>
 * ```
 */
export function CustomSheet({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  side = "right",
}: CustomSheetProps) {
  const direction = useDirection()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent dir={direction} side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <SheetBody>{children}</SheetBody>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}

interface ScrollableSheetProps {
  trigger?: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "top" | "right" | "bottom" | "left"
  maxHeight?: string
}

/**
 * A reusable sheet component with scrollable content
 * 
 * @example
 * ```tsx
 * <ScrollableSheet
 *   trigger={<Button>View Details</Button>}
 *   title="Terms of Service"
 *   description="Please review our terms"
 *   maxHeight="calc(100dvh-200px)"
 * >
 *   <div>Long scrollable content here</div>
 * </ScrollableSheet>
 * ```
 */
export function ScrollableSheet({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  side = "right",
  maxHeight,
}: ScrollableSheetProps) {
  const direction = useDirection()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className="p-0" dir={direction} side={side}>
        <SheetHeader className="py-4 px-5 border-b border-border">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <SheetBody className="py-0 px-5 grow">
          <ScrollArea viewportClassName={maxHeight || "h-[calc(100dvh-180px)]"}  className={`text-sm  pe-3 -me-3`}>
            {children}
          </ScrollArea>
        </SheetBody>
        {footer && (
          <SheetFooter className="py-4 px-5 border-t border-border">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

// Default footer with Cancel and Submit buttons
export function DefaultSheetFooter({
  onCancel,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitDisabled = false,
}: {
  onCancel?: () => void
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  submitDisabled?: boolean
}) {
  return (
    <>
      <SheetClose asChild>
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </SheetClose>
      <SheetClose asChild>
        <Button onClick={onSubmit} disabled={submitDisabled}>
          {submitLabel}
        </Button>
      </SheetClose>
    </>
  )
}
