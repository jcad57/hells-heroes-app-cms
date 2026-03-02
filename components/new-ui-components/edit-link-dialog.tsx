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
import { updateLink } from "@/supabase/manage-links";
import type { LinkItem } from "@/supabase/fetchLinks";

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: LinkItem;
  onLinkUpdated?: () => void;
}

export function EditLinkDialog({
  open,
  onOpenChange,
  link,
  onLinkUpdated,
}: EditLinkDialogProps) {
  const [title, setTitle] = React.useState(link.title);
  const [url, setUrl] = React.useState(link.url);
  const [description, setDescription] = React.useState(
    link.description ?? "",
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description ?? "");
  }, [link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateLink(link.id, {
        title,
        url,
        description: description || null,
      });
      onOpenChange(false);
      onLinkUpdated?.();
    } catch (error) {
      console.error("Error updating link:", error);
      alert("Failed to update link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the link information below. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="edit-link-title">Title</Label>
              <Input
                id="edit-link-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-link-url">URL</Label>
              <Input
                id="edit-link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-link-description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="edit-link-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
