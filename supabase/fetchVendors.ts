import supabaseClient from "./supabase";
import type { VendorItem } from "@/types/link-types";

export async function fetchVendors(): Promise<VendorItem[]> {
  const { data, error } = await supabaseClient
    .from("vendors")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
