// supabase/bandOperations.ts
import supabaseClient from "./supabase";
import { Band } from "@/types";
import { z } from "zod";

export interface BandInput {
  name: string;
  show_date: string;
  show_time: string;
  stage: string;
}

// Add a new band (direct method)
export async function addBand(bandData: BandInput) {
  const { data, error } = await supabaseClient
    .from("bands")
    .insert([bandData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as z.infer<typeof Band>;
}

// Update a band (direct method)
export async function updateBand(id: number, updates: Partial<BandInput>) {
  const { data, error } = await supabaseClient
    .from("bands")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as z.infer<typeof Band>;
}

// Delete a band (direct method)
export async function deleteBand(bandId: number) {
  const { error } = await supabaseClient
    .from("bands")
    .delete()
    .eq("id", bandId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
