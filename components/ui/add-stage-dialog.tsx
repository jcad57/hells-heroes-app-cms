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
import { addStage } from "@/supabase/manage-stage-data";

interface AddStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStageAdded?: () => void;
}

export function AddStageDialog({
  open,
  onOpenChange,
  onStageAdded,
}: AddStageDialogProps) {
  const [stageName, setStageName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addStage({
        stage_name: stageName,
      });

      // Reset form
      setStageName("");

      // Close dialog
      onOpenChange(false);

      // Refresh stages list
      if (onStageAdded) {
        onStageAdded();
      }
    } catch (error) {
      console.error("Error adding stage:", error);
      setError(
        "Failed to add stage. Check formatting, otherwise please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Stage</DialogTitle>
          <DialogDescription>
            Enter the stage name below. Click save when you&apos;re done.
          </DialogDescription>
          <p className="text-red-500">{error}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="stageName">Stage Name</Label>
              <Input
                id="stageName"
                name="stageName"
                placeholder="Enter stage name"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Stage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
