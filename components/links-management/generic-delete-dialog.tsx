"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GenericDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  itemName: string;
  isDeleting: boolean;
  onConfirm: () => Promise<void>;
}

export function GenericDeleteDialog({
  open,
  onOpenChange,
  title,
  itemName,
  isDeleting,
  onConfirm,
}: GenericDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{itemName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              type="button"
              disabled={isDeleting}
              onClick={() => onOpenChange(false)}
              className="hover:cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="hover:cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
