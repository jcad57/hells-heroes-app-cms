import supabaseClient from "./supabase";
import type { LocalFoodItem } from "@/types/link-types";

export async function fetchLocalFood(): Promise<LocalFoodItem[]> {
  const { data, error } = await supabaseClient
    .from("local_food_and_drinks")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
