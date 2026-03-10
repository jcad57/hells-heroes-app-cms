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
  const { error } = await supabase.from("links").update(updates).eq("id", id);

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

export interface LocalFoodInput {
  name: string;
  address: string;
  description?: string | null;
}

export async function addLocalFood(data: LocalFoodInput) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("local_food_and_drinks").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function updateLocalFood(
  id: number,
  updates: Partial<LocalFoodInput>,
) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("local_food_and_drinks")
    .update(updates)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function deleteLocalFood(id: number) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("local_food_and_drinks")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export interface VendorInput {
  name: string;
  url: string;
  description?: string | null;
}

export async function addVendor(data: VendorInput) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("vendors").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function updateVendor(id: number, updates: Partial<VendorInput>) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("vendors").update(updates).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function deleteVendor(id: number) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("vendors").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
