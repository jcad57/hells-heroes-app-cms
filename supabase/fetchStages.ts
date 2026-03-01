import supabaseClient from "./supabase";

export async function fetchStages() {
  const { data: stages, error } = await supabaseClient
    .from("stages")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return stages;
}
