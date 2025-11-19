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

interface AddBandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBandDialog({ open, onOpenChange }: AddBandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Band</DialogTitle>
          <DialogDescription>
            Enter the band information below. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="bandName">Band Name</Label>
              <Input
                id="bandName"
                name="bandName"
                placeholder="Enter band name"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="showDate">Show Date</Label>
              <Input
                id="showDate"
                name="showDate"
                type="date"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="showTime">Show Time</Label>
              <Input
                id="showTime"
                name="showTime"
                placeholder="e.g., 5:00 pm"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="stage">Stage</Label>
              <Select defaultValue="">
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lawn">Lawn</SelectItem>
                  <SelectItem value="Main Stage">Upstairs</SelectItem>
                  <SelectItem value="Side Stage">Downstairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Band</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

