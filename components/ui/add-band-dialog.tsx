"use client";

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
import { Stage } from "@/types";
import { fetchStages } from "@/supabase/fetchStages";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";

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
  const [name, setName] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [stage, setStage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stagesData, setStagesData] = useState<z.infer<typeof Stage>[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStagesData = async () => {
      const stages = await fetchStages();
      setStagesData(stages);
    };
    fetchStagesData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
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
      setError(
        "Failed to add band. Check formatting, otherwise please try again.",
      );
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
          <p className="text-red-500">{error}</p>
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
                  {stagesData.map((stage) => (
                    <SelectItem key={stage.id} value={stage.stage_name}>
                      {stage.stage_name}
                    </SelectItem>
                  ))}
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
