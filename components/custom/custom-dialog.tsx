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
  heightClassName?: string;
}

export function CustomDialog({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  footer,
  sizeClassName = "sm:max-w-lg",
  heightClassName = "sm:max-h-[min(640px,80vh)]",
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`flex flex-col gap-0 p-0 ${heightClassName} ${sizeClassName} [&>button:last-child]:hidden`}
      >
        <ScrollArea className="flex max-h-[75vh] flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="px-6 pt-6">{title}</DialogTitle>
            <DialogDescription asChild>
              <div className="p-6">{children}</div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="px-6 pb-6 sm:justify-start">
            {footer ? (
              footer
            ) : (
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
            )}
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
