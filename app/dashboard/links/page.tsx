"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainContentWrapper from "@/components/new-ui-components/MainContentWrapper";
import { LinkSection } from "@/components/links-management/link-section";
import { GenericItemDialog } from "@/components/links-management/generic-item-dialog";
import { GenericDeleteDialog } from "@/components/links-management/generic-delete-dialog";
import { fetchLinks, type LinkItem } from "@/supabase/fetchLinks";
import {
  fetchSocialLinks,
  type SocialLinkItem,
} from "@/supabase/fetchSocialLinks";
import { fetchLocalFood } from "@/supabase/fetchLocalFood";
import { fetchVendors } from "@/supabase/fetchVendors";
import type { LocalFoodItem, VendorItem } from "@/types/link-types";
import {
  addLink,
  updateLink,
  deleteLink,
  addLocalFood,
  updateLocalFood,
  deleteLocalFood,
  addVendor,
  updateVendor,
  deleteVendor,
  upsertSocialLink,
  deleteSocialLink,
} from "@/supabase/manage-links";
import {
  IconPencil,
  IconTrash,
  IconExternalLink,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandX,
} from "@tabler/icons-react";

const LINK_COLORS = [
  "#f0c040",
  "#e05a5a",
  "#5ab4e0",
  "#a78bfa",
  "#34d399",
  "#fb923c",
];

const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    icon: IconBrandInstagram,
    color: "#E1306C",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: IconBrandFacebook,
    color: "#1877F2",
  },
  {
    key: "x",
    label: "X (Twitter)",
    icon: IconBrandX,
    color: "#FFFFFF",
  },
];

type DialogMode = "add" | "edit" | "delete" | null;
type EntityType = "external-link" | "local-food" | "vendor";

interface DialogConfig {
  type: EntityType;
  mode: DialogMode;
  item?: any;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [localFood, setLocalFood] = useState<LocalFoodItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);

  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  const loadLinks = async () => {
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const loadLocalFood = async () => {
    try {
      const data = await fetchLocalFood();
      setLocalFood(data);
    } catch (error) {
      console.error("Error fetching local food:", error);
    }
  };

  const loadVendors = async () => {
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const loadSocialLinks = async () => {
    try {
      const data = await fetchSocialLinks();
      setSocialLinks(data);
    } catch (error) {
      console.error("Error fetching social links:", error);
    }
  };

  useEffect(() => {
    loadLinks();
    loadLocalFood();
    loadVendors();
    loadSocialLinks();
  }, []);

  const openDialog = (type: EntityType, mode: DialogMode, item?: any) => {
    setDialogConfig({ type, mode, item });
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const getDialogFields = (type: EntityType) => {
    switch (type) {
      case "external-link":
        return [
          {
            name: "title",
            label: "Title",
            type: "text" as const,
            required: true,
            placeholder: "e.g. Buy Tickets, Venue Info",
          },
          {
            name: "url",
            label: "URL",
            type: "url" as const,
            required: true,
            placeholder: "https://...",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea" as const,
            required: false,
            placeholder: "Brief description shown in the app",
          },
        ];
      case "local-food":
        return [
          {
            name: "name",
            label: "Name",
            type: "text" as const,
            required: true,
            placeholder: "e.g. Local Brewery, Restaurant",
          },
          {
            name: "address",
            label: "Address",
            type: "text" as const,
            required: true,
            placeholder: "123 Main St, City, State",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea" as const,
            required: false,
            placeholder: "Brief description of the establishment",
          },
        ];
      case "vendor":
        return [
          {
            name: "name",
            label: "Name",
            type: "text" as const,
            required: true,
            placeholder: "e.g. Vendor Name",
          },
          {
            name: "url",
            label: "URL",
            type: "url" as const,
            required: true,
            placeholder: "https://...",
          },
          {
            name: "description",
            label: "Description",
            type: "textarea" as const,
            required: false,
            placeholder: "Brief description of the vendor",
          },
        ];
    }
  };

  const handleDialogSubmit = async (data: Record<string, any>) => {
    if (!dialogConfig) return;

    const { type, mode, item } = dialogConfig;

    try {
      if (type === "external-link") {
        if (mode === "add") {
          await addLink(
            data as { title: string; url: string; description?: string | null },
          );
        } else if (mode === "edit" && item) {
          await updateLink(
            item.id,
            data as { title: string; url: string; description?: string | null },
          );
        }
        await loadLinks();
      } else if (type === "local-food") {
        if (mode === "add") {
          await addLocalFood(
            data as {
              name: string;
              address: string;
              description?: string | null;
            },
          );
        } else if (mode === "edit" && item) {
          await updateLocalFood(
            item.id,
            data as {
              name: string;
              address: string;
              description?: string | null;
            },
          );
        }
        await loadLocalFood();
      } else if (type === "vendor") {
        if (mode === "add") {
          await addVendor(
            data as { name: string; url: string; description?: string | null },
          );
        } else if (mode === "edit" && item) {
          await updateVendor(
            item.id,
            data as { name: string; url: string; description?: string | null },
          );
        }
        await loadVendors();
      }
    } catch (error) {
      console.error("Error submitting dialog:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!dialogConfig?.item) return;

    const { type, item } = dialogConfig;
    setIsDeleting(true);

    try {
      if (type === "external-link") {
        await deleteLink(item.id);
        await loadLinks();
      } else if (type === "local-food") {
        await deleteLocalFood(item.id);
        await loadLocalFood();
      } else if (type === "vendor") {
        await deleteVendor(item.id);
        await loadVendors();
      }
      closeDialog();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSocial = (platformKey: string) => {
    const existing = socialLinks.find((s) => s.platform === platformKey);
    setEditingPlatform(platformKey);
    setEditingUrl(existing?.url ?? "");
  };

  const handleSaveSocial = async (platformKey: string) => {
    if (!editingUrl.trim()) return;
    setIsSavingSocial(true);
    try {
      await upsertSocialLink(platformKey, editingUrl.trim());
      setEditingPlatform(null);
      setEditingUrl("");
      await loadSocialLinks();
    } catch (error) {
      console.error("Error saving social link:", error);
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleRemoveSocial = async (platformKey: string) => {
    try {
      await deleteSocialLink(platformKey);
      await loadSocialLinks();
    } catch (error) {
      console.error("Error removing social link:", error);
    }
  };

  const getDialogTitle = () => {
    if (!dialogConfig) return "";
    const { type, mode } = dialogConfig;
    const action = mode === "add" ? "Add" : mode === "edit" ? "Edit" : "Delete";
    const entity =
      type === "external-link"
        ? "External Link"
        : type === "local-food"
          ? "Local Food & Drinks"
          : "Vendor";
    return `${action} ${entity}`;
  };

  const getItemName = () => {
    if (!dialogConfig?.item) return "";
    const { type, item } = dialogConfig;
    if (type === "external-link") return item.title;
    return item.name;
  };

  return (
    <MainContentWrapper title="Links">
      <LinkSection
        title="External Links"
        description="Ticket upgrades, venue information, local businesses and other resources displayed in the app."
        items={links}
        colors={LINK_COLORS}
        emptyMessage='No external links yet. Click "Add Link" to get started.'
        onAdd={() => openDialog("external-link", "add")}
        onEdit={(item) => openDialog("external-link", "edit", item)}
        onDelete={(item) => openDialog("external-link", "delete", item)}
        isDeleting={isDeleting}
        getItemTitle={(item) => item.title}
        getItemSubtitle={(item) => item.url}
        getItemDescription={(item) => item.description}
      />

      <div className="border-t border-border mb-10" />

      <LinkSection
        title="Local Food & Drinks"
        description="Local restaurants, bars, and food vendors near the festival venue."
        items={localFood}
        colors={LINK_COLORS}
        emptyMessage='No local food & drinks yet. Click "Add Item" to get started.'
        onAdd={() => openDialog("local-food", "add")}
        onEdit={(item) => openDialog("local-food", "edit", item)}
        onDelete={(item) => openDialog("local-food", "delete", item)}
        isDeleting={isDeleting}
        getItemTitle={(item) => item.name}
        getItemSubtitle={(item) => item.address}
        getItemDescription={(item) => item.description}
      />

      <div className="border-t border-border mb-10" />

      <LinkSection
        title="Vendor List"
        description="Festival vendors, merchandise shops, and service providers."
        items={vendors}
        colors={LINK_COLORS}
        emptyMessage='No vendors yet. Click "Add Item" to get started.'
        onAdd={() => openDialog("vendor", "add")}
        onEdit={(item) => openDialog("vendor", "edit", item)}
        onDelete={(item) => openDialog("vendor", "delete", item)}
        isDeleting={isDeleting}
        getItemTitle={(item) => item.name}
        getItemSubtitle={(item) => item.url}
        getItemDescription={(item) => item.description}
      />

      <div className="border-t border-border mb-10" />

      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-wide">Social Links</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Social media profiles linked in the app. Click the pencil icon to
            add or update a URL.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon, color }) => {
            const existing = socialLinks.find((s) => s.platform === key);
            const isEditing = editingPlatform === key;

            return (
              <div
                key={key}
                className="flex flex-col p-4 gap-3 rounded-xl border border-border bg-[#12121a]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-6 rounded-[2px] flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <Icon size={18} style={{ color }} />
                    <span className="font-semibold text-sm">{label}</span>
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSocial(key)}
                        className="hover:cursor-pointer h-8 w-8"
                        title={existing ? "Edit URL" : "Add URL"}
                      >
                        <IconPencil size={15} />
                      </Button>
                      {existing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSocial(key)}
                          className="hover:cursor-pointer h-8 w-8"
                          title="Remove link"
                        >
                          <IconTrash size={15} />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      type="url"
                      placeholder="https://"
                      value={editingUrl}
                      onChange={(e) => setEditingUrl(e.target.value)}
                      autoFocus
                      className="text-sm h-8"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveSocial(key)}
                        disabled={isSavingSocial || !editingUrl.trim()}
                        className="hover:cursor-pointer flex-1"
                      >
                        {isSavingSocial ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditingPlatform(null);
                          setEditingUrl("");
                        }}
                        disabled={isSavingSocial}
                        className="hover:cursor-pointer flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {existing?.url ? (
                      <a
                        href={existing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#3A97D4] hover:underline"
                      >
                        <IconExternalLink size={11} className="flex-shrink-0" />
                        <span className="truncate">{existing.url}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Not set — click edit to add
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {dialogConfig?.mode !== "delete" && (
        <GenericItemDialog
          open={dialogConfig?.mode === "add" || dialogConfig?.mode === "edit"}
          onOpenChange={(open) => !open && closeDialog()}
          title={getDialogTitle()}
          description={
            dialogConfig?.mode === "add"
              ? "Fill in the details below to add a new item."
              : "Update the information below."
          }
          fields={getDialogFields(dialogConfig?.type || "external-link")}
          initialData={dialogConfig?.item}
          onSubmit={handleDialogSubmit}
        />
      )}

      {dialogConfig?.mode === "delete" && (
        <GenericDeleteDialog
          open={true}
          onOpenChange={(open) => !open && closeDialog()}
          title={getDialogTitle()}
          itemName={getItemName()}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
        />
      )}
    </MainContentWrapper>
  );
}
