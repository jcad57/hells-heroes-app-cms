"use client";

import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash, IconExternalLink } from "@tabler/icons-react";

interface LinkCardProps {
  title: string;
  subtitle?: string;
  description?: string | null;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function LinkCard({
  title,
  subtitle,
  description,
  color,
  onEdit,
  onDelete,
  isDeleting = false,
}: LinkCardProps) {
  return (
    <div className="flex flex-col p-4 gap-2 rounded-xl border border-border bg-[#12121a] overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-1 h-7 rounded-[2px] flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span
            className="font-bebas-neue text-[20px] tracking-wide leading-none truncate"
            style={{ color }}
          >
            {title}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="hover:cursor-pointer flex-shrink-0"
        >
          <IconPencil size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={isDeleting}
          className="hover:cursor-pointer flex-shrink-0"
        >
          <IconTrash size={16} />
        </Button>
      </div>

      {subtitle && (
        <a
          href={subtitle}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#3A97D4] hover:underline"
        >
          <IconExternalLink size={11} className="flex-shrink-0" />
          <span className="truncate">{subtitle}</span>
        </a>
      )}

      {description && (
        <p className="text-muted-foreground text-sm font-light leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}
