"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addShowDate } from "@/supabase/manage-show-dates";

interface AddShowDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowDateAdded?: () => void;
}

export function AddShowDateDialog({
  open,
  onOpenChange,
  onShowDateAdded,
}: AddShowDateDialogProps) {
  const [showDate, setShowDate] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addShowDate({
        show_date: showDate,
      });

      // Reset form
      setShowDate("");

      // Close dialog
      onOpenChange(false);

      // Refresh bands list
      if (onShowDateAdded) {
        onShowDateAdded();
      }
    } catch (error) {
      setError(
        "Failed to add show date. Check formatting, otherwise please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Show Date</DialogTitle>
          <DialogDescription>
            Enter the show date information below. Click save when you&apos;re
            done.
          </DialogDescription>
          <p className="text-red-500">{error}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="showDate">Show Date</Label>
              <Input
                id="showDate"
                name="showDate"
                type="date"
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="hover:cursor-pointer"
            >
              {isLoading ? "Adding..." : "Add Show Date"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
