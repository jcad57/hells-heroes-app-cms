"use server";

import { createServerClient } from "@/lib/auth-server";

export interface StageInput {
  stage_name: string;
  stage_description?: string | null;
}

// Add a new stage (direct method)
export async function addStage(stageData: StageInput) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("stages")
    .insert([stageData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Update a stage (direct method)
export async function updateStage(id: number, updates: Partial<StageInput>) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("stages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

// Delete a stage (direct method)
export async function deleteStage(stageId: number) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("stages").delete().eq("id", stageId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
