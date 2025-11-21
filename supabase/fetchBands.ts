import supabaseClient from "./supabase";

export async function fetchBands() {
  const { data: bands, error } = await supabaseClient.from("bands").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return bands;
}
