import supabaseClient from "./supabase";
import { Stage } from "@/types";
import { z } from "zod";

export interface StageInput {
  stage_name: string;
}

// Add a new stage (direct method)
export async function addStage(stageData: StageInput) {
  const { data, error } = await supabaseClient
    .from("stages")
    .insert([stageData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as z.infer<typeof Stage>;
}

// Update a stage (direct method)
export async function updateStage(id: number, updates: Partial<StageInput>) {
  const { data, error } = await supabaseClient
    .from("stages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as z.infer<typeof Stage>;
}

// Delete a stage (direct method)
export async function deleteStage(stageId: number) {
  const { error } = await supabaseClient
    .from("stages")
    .delete()
    .eq("id", stageId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
