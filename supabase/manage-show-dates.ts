// supabase/bandOperations.ts
import supabaseClient from "./supabase";
import { ShowDate } from "@/types";
import { z } from "zod";

export interface ShowDateInput {
  show_date: string;
}

// Add a new band (direct method)
export async function addShowDate(showDateData: ShowDateInput) {
  const { data, error } = await supabaseClient
    .from("show_dates")
    .insert(showDateData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as z.infer<typeof ShowDate>;
}

// Update a band (direct method)
export async function updateShowDate(
  id: number,
  updates: Partial<ShowDateInput>,
) {
  const { data, error } = await supabaseClient
    .from("show_dates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as z.infer<typeof ShowDate>;
}

// Delete a band (direct method)
export async function deleteShowDate(showDateId: number) {
  const { error } = await supabaseClient
    .from("show_dates")
    .delete()
    .eq("id", showDateId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
