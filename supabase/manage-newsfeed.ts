"use server";

import { createServerClient } from "@/lib/auth-server";

export interface NewsFeedItemInput {
  title: string;
  body: string;
}

export async function addNewsFeedItem(data: NewsFeedItemInput) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("newsfeed").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function updateNewsFeedItem(
  id: string,
  updates: Partial<NewsFeedItemInput>,
) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("newsfeed")
    .update(updates)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function deleteNewsFeedItem(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("newsfeed").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
