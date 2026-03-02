"use server";

import { createServerClient } from "@/lib/auth-server";

export interface LinkInput {
  title: string;
  url: string;
  description?: string | null;
}

export async function addLink(data: LinkInput) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("links").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function updateLink(id: number, updates: Partial<LinkInput>) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function deleteLink(id: number) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("links").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Upsert a social link by platform name (insert if not exists, update if it does)
export async function upsertSocialLink(platform: string, url: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("social_links")
    .upsert({ platform, url }, { onConflict: "platform" });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function deleteSocialLink(platform: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("social_links")
    .delete()
    .eq("platform", platform);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
