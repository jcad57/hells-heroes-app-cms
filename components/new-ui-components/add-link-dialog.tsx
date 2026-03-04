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
import { addLink } from "@/supabase/manage-links";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkAdded?: () => void;
}

export function AddLinkDialog({
  open,
  onOpenChange,
  onLinkAdded,
}: AddLinkDialogProps) {
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await addLink({ title, url, description: description || null });
      setTitle("");
      setUrl("");
      setDescription("");
      onOpenChange(false);
      onLinkAdded?.();
    } catch (err) {
      console.error("Error adding link:", err);
      setError("Failed to add link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add External Link</DialogTitle>
          <DialogDescription>
            Add a new link to display in the app. Click save when you&apos;re
            done.
          </DialogDescription>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="link-title">Title</Label>
              <Input
                id="link-title"
                placeholder="e.g. Buy Tickets, Venue Info"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="link-description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="link-description"
                placeholder="Brief description shown in the app"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              {isLoading ? "Adding..." : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
