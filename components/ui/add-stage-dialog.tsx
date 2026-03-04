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
import { FormEvent, useState } from "react";

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
  const [stageName, setStageName] = useState("");
  const [stageDescription, setStageDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addStage({
        stage_name: stageName,
        stage_description: stageDescription,
      });

      // Reset form
      setStageName("");
      setStageDescription("");
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
            <div className="grid gap-3">
              <Label htmlFor="stageName">Description</Label>
              <Input
                id="stageDescription"
                name="stageDescription"
                placeholder="Enter stage description"
                value={stageDescription}
                onChange={(e) => setStageDescription(e.target.value)}
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
