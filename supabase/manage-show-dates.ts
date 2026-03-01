"use server";

// supabase/bandOperations.ts
import { createServerClient } from "@/lib/auth-server";

export interface ShowDateInput {
  show_date: string;
}

// Add a new band (direct method)
export async function addShowDate(showDateData: ShowDateInput) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("show_dates")
    .insert(showDateData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Update a band (direct method)
export async function updateShowDate(
  id: number,
  updates: Partial<ShowDateInput>,
) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("show_dates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Delete a band (direct method)
export async function deleteShowDate(showDateId: number) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("show_dates")
    .delete()
    .eq("id", showDateId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
