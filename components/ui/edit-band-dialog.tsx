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
import { updateBand } from "@/supabase/manage-band-data";

interface BandData {
  id: number;
  name: string;
  show_date: string;
  show_time: string;
  stage: string;
}

interface EditBandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  band: BandData;
  onBandUpdated?: () => void; // Callback to refresh the bands list
}

export function EditBandDialog({
  open,
  onOpenChange,
  band,
  onBandUpdated,
}: EditBandDialogProps) {
  const [name, setName] = React.useState(band.name);
  const [showDate, setShowDate] = React.useState(band.show_date);
  const [showTime, setShowTime] = React.useState(band.show_time);
  const [stage, setStage] = React.useState(band.stage);
  const [isLoading, setIsLoading] = React.useState(false);

  // Update form values when band prop changes
  React.useEffect(() => {
    setName(band.name);
    setShowDate(band.show_date);
    setShowTime(band.show_time);
    setStage(band.stage);
  }, [band]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateBand(band.id, {
        name,
        show_date: showDate,
        show_time: showTime,
        stage,
      });

      // Close dialog
      onOpenChange(false);

      // Refresh bands list
      if (onBandUpdated) {
        onBandUpdated();
      }
    } catch (error) {
      console.error("Error updating band:", error);
      alert("Failed to update band. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Band</DialogTitle>
          <DialogDescription>
            Make changes to the band information here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="bandName">Band Name</Label>
              <Input
                id="bandName"
                name="bandName"
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
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
