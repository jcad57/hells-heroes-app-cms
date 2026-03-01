import supabaseClient from "./supabase";

export async function fetchNewsFeed() {
  const { data: posts, error } = await supabaseClient
    .from("newsfeed")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return posts;
}
