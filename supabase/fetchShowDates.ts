import supabaseClient from "./supabase";

export async function fetchShowDates() {
  const { data: showDates, error } = await supabaseClient
    .from("show_dates")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return showDates;
}
