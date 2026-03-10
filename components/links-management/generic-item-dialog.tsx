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
import { Textarea } from "@/components/ui/textarea";

interface DialogField {
  name: string;
  label: string;
  type: "text" | "url" | "textarea";
  required: boolean;
  placeholder?: string;
}

interface GenericItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: DialogField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
}

export function GenericItemDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialData,
  onSubmit,
  isLoading: externalLoading,
}: GenericItemDialogProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const isLoading = externalLoading ?? internalLoading;

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData, open]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInternalLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      setFormData({});
      onOpenChange(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-3">
                <Label htmlFor={field.name}>
                  {field.label}
                  {!field.required && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      (optional)
                    </span>
                  )}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}
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
              {isLoading
                ? initialData
                  ? "Saving..."
                  : "Adding..."
                : initialData
                ? "Save Changes"
                : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
