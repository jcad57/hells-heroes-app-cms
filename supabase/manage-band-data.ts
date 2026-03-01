"use server";

// supabase/bandOperations.ts
import { createServerClient } from "@/lib/auth-server";

export interface BandInput {
  name: string;
  show_date: string;
  show_time: string;
  stage: string;
}

// Add a new band (direct method)
export async function addBand(bandData: BandInput) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("bands")
    .insert([bandData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Update a band (direct method)
export async function updateBand(id: number, updates: Partial<BandInput>) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("bands")
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
export async function deleteBand(bandId: number) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("bands").delete().eq("id", bandId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
