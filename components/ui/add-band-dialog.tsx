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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addBand } from "@/supabase/manage-band-data";

interface AddBandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBandAdded?: () => void;
}

export function AddBandDialog({
  open,
  onOpenChange,
  onBandAdded,
}: AddBandDialogProps) {
  const [name, setName] = React.useState("");
  const [showDate, setShowDate] = React.useState("");
  const [showTime, setShowTime] = React.useState("");
  const [stage, setStage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addBand({
        name,
        show_date: showDate,
        show_time: showTime,
        stage,
      });

      // Reset form
      setName("");
      setShowDate("");
      setShowTime("");
      setStage("");

      // Close dialog
      onOpenChange(false);

      // Refresh bands list
      if (onBandAdded) {
        onBandAdded();
      }
    } catch (error) {
      console.error("Error adding band:", error);
      alert("Failed to add band. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Band</DialogTitle>
          <DialogDescription>
            Enter the band information below. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="bandName">Band Name</Label>
              <Input
                id="bandName"
                name="bandName"
                placeholder="Enter band name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="grid gap-3">
              <Label htmlFor="showTime">Show Time</Label>
              <Input
                id="showTime"
                name="showTime"
                placeholder="e.g., 5:00 pm"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="stage">Stage</Label>
              <Select value={stage} onValueChange={setStage} required>
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lawn">Lawn</SelectItem>
                  <SelectItem value="upstairs">Upstairs</SelectItem>
                  <SelectItem value="downstairs">Downstairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Band"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
