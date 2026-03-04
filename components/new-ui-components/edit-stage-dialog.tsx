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
import { updateStage } from "@/supabase/manage-stage-data";

interface StageData {
  id: number;
  stage_name: string;
  stage_description: string | null;
}

interface EditStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: StageData;
  onStageUpdated?: () => void; // Callback to refresh the stages list
}

export function EditStageDialog({
  open,
  onOpenChange,
  stage,
  onStageUpdated,
}: EditStageDialogProps) {
  const [stageName, setStageName] = React.useState(stage.stage_name);
  const [stageDescription, setStageDescription] = React.useState(
    stage.stage_description,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Update form values when stage prop changes
  React.useEffect(() => {
    setStageName(stage.stage_name);
    setStageDescription(stage.stage_description);
  }, [stage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateStage(stage.id, {
        stage_name: stageName,
        stage_description: stageDescription || null,
      });

      // Close dialog
      onOpenChange(false);

      // Refresh stages list
      if (onStageUpdated) {
        onStageUpdated();
      }
    } catch (error) {
      console.error("Error updating stage:", error);
      alert("Failed to update stage. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Stage</DialogTitle>
          <DialogDescription>
            Make changes to the stage information here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="stageName">Stage Name</Label>
              <Input
                id="stageName"
                name="stageName"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="stageDescription">Stage Description</Label>
              <Input
                id="stageDescription"
                name="stageDescription"
                type="text"
                value={stageDescription ?? ""}
                onChange={(e) => setStageDescription(e.target.value)}
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
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
