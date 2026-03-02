"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainContentWrapper from "@/components/new-ui-components/MainContentWrapper";
import { AddLinkDialog } from "@/components/new-ui-components/add-link-dialog";
import { EditLinkDialog } from "@/components/new-ui-components/edit-link-dialog";
import { fetchLinks, type LinkItem } from "@/supabase/fetchLinks";
import {
  fetchSocialLinks,
  type SocialLinkItem,
} from "@/supabase/fetchSocialLinks";
import {
  deleteLink,
  upsertSocialLink,
  deleteSocialLink,
} from "@/supabase/manage-links";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconPencil,
  IconTrash,
  IconExternalLink,
  IconLink,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandSpotify,
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
  {
    key: "youtube",
    label: "YouTube",
    icon: IconBrandYoutube,
    color: "#FF0000",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: IconBrandTiktok,
    color: "#FFFFFF",
  },
  {
    key: "spotify",
    label: "Spotify",
    icon: IconBrandSpotify,
    color: "#1DB954",
  },
];

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);

  // External link dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<LinkItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Social link inline-edit state
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
    loadSocialLinks();
  }, []);

  // ── External links handlers ──────────────────────────────────────────────

  const handleEditClick = (link: LinkItem) => {
    setLinkToEdit(link);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (link: LinkItem) => {
    setLinkToDelete(link);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      await deleteLink(linkToDelete.id);
      setIsDeleteDialogOpen(false);
      setLinkToDelete(null);
      await loadLinks();
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Social links handlers ────────────────────────────────────────────────

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

  return (
    <MainContentWrapper title="Links">
      {/* ── External Links Section ─────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              External Links
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Ticket upgrades, venue information, local businesses and other
              resources displayed in the app.
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="hover:cursor-pointer"
          >
            Add Link
          </Button>
        </div>

        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-border text-muted-foreground gap-3">
            <IconLink size={34} className="opacity-30" />
            <p className="text-sm">
              No external links yet. Click &quot;Add Link&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {links.map((link, index) => {
              const color = LINK_COLORS[index % LINK_COLORS.length];
              return (
                <div
                  key={link.id}
                  className="flex flex-col p-4 gap-2 rounded-xl border border-border bg-[#12121a] overflow-hidden"
                >
                  {/* Card header: title + action buttons */}
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
                        {link.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(link)}
                      className="hover:cursor-pointer flex-shrink-0"
                    >
                      <IconPencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(link)}
                      disabled={isDeleting}
                      className="hover:cursor-pointer flex-shrink-0"
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>

                  {/* URL */}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#3A97D4] hover:underline"
                  >
                    <IconExternalLink size={11} className="flex-shrink-0" />
                    <span className="truncate">{link.url}</span>
                  </a>

                  {/* Description */}
                  {link.description && (
                    <p className="text-muted-foreground text-sm font-light leading-snug">
                      {link.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <div className="border-t border-border mb-10" />

      {/* ── Social Links Section ──────────────────────────────────────────────── */}
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
                {/* Platform header */}
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

                {/* Inline edit or URL display */}
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      type="url"
                      placeholder={`https://`}
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

      {/* ── Dialogs ──────────────────────────────────────────────────────────── */}

      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onLinkAdded={loadLinks}
      />

      {linkToEdit && (
        <EditLinkDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          link={linkToEdit}
          onLinkUpdated={loadLinks}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{linkToDelete?.title}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                type="button"
                disabled={isDeleting}
                onClick={() => setLinkToDelete(null)}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="hover:cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainContentWrapper>
  );
}
