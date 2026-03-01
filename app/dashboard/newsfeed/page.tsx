"use client";

import { useEffect, useState } from "react";
import MainContentWrapper from "@/components/new-ui-components/MainContentWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  IconPlus,
  IconTrash,
  IconDeviceFloppy,
  IconEye,
  IconPencil,
  IconClock,
  IconAlignLeft,
} from "@tabler/icons-react";
import { fetchNewsFeed } from "@/supabase/fetchNewsFeed";
import {
  addNewsFeedItem,
  updateNewsFeedItem,
  deleteNewsFeedItem,
} from "@/supabase/manage-newsfeed";
import { z } from "zod";
import { NewsFeedItem } from "@/types";

type Post = z.infer<typeof NewsFeedItem>;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await fetchNewsFeed();
      setPosts(data as Post[]);
    } catch (e) {
      console.error("Error fetching newsfeed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setBody(post.body);
    setIsNewPost(false);
    setShowPreview(false);
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setTitle("");
    setBody("");
    setIsNewPost(true);
    setShowPreview(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) return;
    setIsSaving(true);
    try {
      if (isNewPost) {
        await addNewsFeedItem({ title, body });
        setIsNewPost(false);
      } else if (selectedPost) {
        await updateNewsFeedItem(selectedPost.id, { title, body });
        setSelectedPost({ ...selectedPost, title, body });
      }
      await loadPosts();
    } catch (e) {
      console.error("Error saving post:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    try {
      await deleteNewsFeedItem(selectedPost.id);
      await loadPosts();
      setSelectedPost(null);
      setTitle("");
      setBody("");
      setIsNewPost(false);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error("Error deleting post:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const isEditorOpen = isNewPost || selectedPost !== null;
  const hasChanges = selectedPost
    ? title !== selectedPost.title || body !== selectedPost.body
    : title.length > 0 || body.length > 0;

  const canSave =
    title.trim().length > 0 && body.trim().length > 0 && hasChanges;

  return (
    <MainContentWrapper title="Newsfeed">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-260px)]">
        {/* ── Left panel: post list ── */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-3">
          <Button
            onClick={handleNewPost}
            className="w-full hover:cursor-pointer"
          >
            <IconPlus className="size-4 mr-2" />
            New Post
          </Button>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {loading ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Loading…
              </p>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-6 text-center">
                <IconAlignLeft className="size-6 text-[#6b6b80] mx-auto mb-2" />
                <p className="text-[#6b6b80] text-sm">No posts yet.</p>
                <p className="text-[#6b6b80] text-xs mt-1">
                  Create your first newsfeed post.
                </p>
              </div>
            ) : (
              posts.map((post) => {
                const isActive = selectedPost?.id === post.id && !isNewPost;
                return (
                  <button
                    key={post.id}
                    onClick={() => handleSelectPost(post)}
                    className={[
                      "text-left w-full p-4 rounded-xl border transition-all duration-200 group",
                      isActive
                        ? "border-[#3A97D4]/50 bg-[#3A97D4]/5"
                        : "border-[#1e1e2e] bg-[#12121a] hover:border-[#2e2e3e] hover:bg-[#1a1a24]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={[
                          "font-medium text-sm truncate",
                          isActive ? "text-[#3A97D4]" : "text-[#e8e8f0]",
                        ].join(" ")}
                      >
                        {post.title}
                      </p>
                      {isActive && (
                        <IconPencil className="size-3 text-[#3A97D4] flex-shrink-0 mt-0.5 hover:cursor-pointer" />
                      )}
                    </div>
                    <p className="text-xs text-[#6b6b80] mt-1.5 line-clamp-2 leading-relaxed">
                      {post.body}
                    </p>
                    <p className="text-[11px] text-[#6b6b80] mt-2.5 flex items-center gap-1">
                      <IconClock className="size-3" />
                      {formatDate(post.created_at)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right panel: editor ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {!isEditorOpen ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-[#1e1e2e] bg-[#12121a] p-10 text-center">
              <IconAlignLeft className="size-10 text-[#2e2e3e] mb-4" />
              <p className="text-[#6b6b80] text-sm">
                Select a post to edit or create a new one
              </p>
              <Button
                onClick={handleNewPost}
                variant="outline"
                size="sm"
                className="mt-4 hover:cursor-pointer"
              >
                <IconPlus className="size-4 mr-1" />
                New Post
              </Button>
            </div>
          ) : (
            <>
              {/* Editor toolbar */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-base font-semibold text-[#e8e8f0]">
                    {isNewPost ? "New Post" : "Edit Post"}
                  </h2>
                  {hasChanges && (
                    <p className="text-[11px] text-[#f0c040] mt-0.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f0c040]" />
                      Unsaved changes
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview((p) => !p)}
                    className="hover:cursor-pointer"
                  >
                    <IconEye className="size-4 mr-1" />
                    {showPreview ? "Edit" : "Preview"}
                  </Button>
                  {!isNewPost && selectedPost && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-[#e05a5a] border-[#e05a5a]/30 hover:bg-[#e05a5a]/10 hover:border-[#e05a5a]/50 hover:text-[#e05a5a] hover:cursor-pointer"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !canSave}
                    className="hover:cursor-pointer"
                  >
                    <IconDeviceFloppy className="size-4 mr-1" />
                    {isSaving ? "Saving…" : "Save"}
                  </Button>
                </div>
              </div>

              {showPreview ? (
                /* ── Preview pane ── */
                <div className="flex-1 rounded-xl border border-[#1e1e2e] bg-[#12121a] overflow-y-auto">
                  <div className="border-b border-[#1e1e2e] px-5 py-3">
                    <p className="text-[11px] text-[#6b6b80] uppercase tracking-widest font-medium">
                      Preview — as seen in the app
                    </p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#e8e8f0] mb-4">
                      {title || (
                        <span className="text-[#6b6b80] italic">Untitled</span>
                      )}
                    </h3>
                    {/* whitespace-pre-wrap preserves all spaces, newlines, and emojis exactly */}
                    <p className="text-[#c8c8d8] text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {body || (
                        <span className="text-[#6b6b80] italic">
                          No content yet…
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Editor fields ── */
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="post-title"
                      className="text-[11px] uppercase tracking-widest text-[#6b6b80] font-medium"
                    >
                      Title
                    </Label>
                    <Input
                      id="post-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Post title…"
                      className="bg-[#12121a] border-[#1e1e2e] text-[#e8e8f0] placeholder:text-[#6b6b80] focus-visible:ring-0 focus-visible:border-[#3A97D4]/50"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="post-body"
                        className="text-[11px] uppercase tracking-widest text-[#6b6b80] font-medium"
                      >
                        Body
                      </Label>
                      <span className="text-[11px] text-[#6b6b80] tabular-nums">
                        {body.length} chars
                      </span>
                    </div>
                    {/*
                      Plain <textarea> — NOT processed before saving.
                      The browser's textarea preserves every keystroke: spaces, newlines,
                      tabs, emojis, and punctuation exactly as the user types them.
                      The saved string is sent to Supabase verbatim.
                    */}
                    <textarea
                      id="post-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={
                        "Write your post here…\n\nAll formatting is preserved exactly as you type it — including line breaks, spacing, and emojis 🎸🤘"
                      }
                      rows={14}
                      className="w-full rounded-lg border border-[#1e1e2e] bg-[#12121a] text-[#e8e8f0] placeholder:text-[#6b6b80] text-sm font-light leading-relaxed p-3 resize-y outline-none focus:border-[#3A97D4]/50 transition-colors"
                      style={{ fontFamily: "inherit" }}
                    />
                    <p className="text-[11px] text-[#6b6b80]">
                      Tip: line breaks, spaces, and emojis are saved exactly as
                      typed and displayed the same way in the app.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                &ldquo;{selectedPost?.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                type="button"
                disabled={isDeleting}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="hover:cursor-pointer"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainContentWrapper>
  );
}
