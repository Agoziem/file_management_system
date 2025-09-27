import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  sizeClassName?: string;
  showFooter?: boolean;
}

export function CustomDialog({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  footer,
  sizeClassName = "sm:max-w-lg",
  showFooter = true,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`flex flex-col gap-0 p-0 ${sizeClassName} ${showFooter && "[&>button:last-child]:hidden"}`}
      >
        <ScrollArea className="flex max-h-[90vh] flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="px-8 pt-6">{title}</DialogTitle>
            <DialogDescription asChild>
              <div className="p-6">{children}</div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="px-6 pb-6 sm:justify-start">
            {footer ? (
              footer
            ) : showFooter ? (
              <>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="button">Okay</Button>
                </DialogClose>
              </>
            ) : null}
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
