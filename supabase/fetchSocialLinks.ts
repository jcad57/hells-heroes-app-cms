import supabaseClient from "./supabase";

export interface SocialLinkItem {
  id: number;
  platform: string;
  url: string;
  created_at: string;
}

export async function fetchSocialLinks(): Promise<SocialLinkItem[]> {
  const { data: socialLinks, error } = await supabaseClient
    .from("social_links")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return socialLinks ?? [];
}
