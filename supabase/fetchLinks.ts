import supabaseClient from "./supabase";

export interface LinkItem {
  id: number;
  title: string;
  url: string;
  description: string | null;
}

export async function fetchLinks(): Promise<LinkItem[]> {
  const { data: links, error } = await supabaseClient
    .from("links")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return links ?? [];
}
