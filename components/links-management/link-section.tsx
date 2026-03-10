"use client";

import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import { LinkCard } from "./link-card";

interface LinkSectionProps<T> {
  title: string;
  description: string;
  items: T[];
  colors: string[];
  emptyMessage: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  isDeleting?: boolean;
  getItemTitle: (item: T) => string;
  getItemSubtitle?: (item: T) => string;
  getItemDescription?: (item: T) => string | null | undefined;
}

export function LinkSection<T extends { id: number }>({
  title,
  description,
  items,
  colors,
  emptyMessage,
  onAdd,
  onEdit,
  onDelete,
  isDeleting = false,
  getItemTitle,
  getItemSubtitle,
  getItemDescription,
}: LinkSectionProps<T>) {
  return (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <Button onClick={onAdd} className="hover:cursor-pointer">
          Add {title.includes("Link") ? "Link" : "Item"}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-border text-muted-foreground gap-3">
          <IconLink size={34} className="opacity-30" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, index) => {
            const color = colors[index % colors.length];
            return (
              <LinkCard
                key={item.id}
                title={getItemTitle(item)}
                subtitle={getItemSubtitle?.(item)}
                description={getItemDescription?.(item)}
                color={color}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
