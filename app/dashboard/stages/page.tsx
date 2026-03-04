"use client";

import { z } from "zod";
import { fetchStages } from "@/supabase/fetchStages";
import { Band, Stage } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddStageDialog } from "@/components/ui/add-stage-dialog";
import { deleteStage } from "@/supabase/manage-stage-data";
import MainContentWrapper from "@/components/new-ui-components/MainContentWrapper";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import {
  DialogClose,
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { fetchBands } from "@/supabase/fetchBands";
import { EditStageDialog } from "@/components/new-ui-components/edit-stage-dialog";

export default function StagesPage() {
  const [stagesData, setStagesData] = useState<z.infer<typeof Stage>[]>([]);
  const [bandsData, setBandsData] = useState<z.infer<typeof Band>[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<z.infer<
    typeof Stage
  > | null>(null);
  const [stageToEdit, setStageToEdit] = useState<z.infer<typeof Stage> | null>(
    null,
  );

  const STAGE_COLORS = ["#f0c040", "#e05a5a", "#5ab4e0", "#a78bfa", "#34d399"];

  useEffect(() => {
    const fetchStagesData = async () => {
      const stages = await fetchStages();
      setStagesData(stages);
    };
    const fetchBandsData = async () => {
      const bands = await fetchBands();
      setBandsData(bands);
    };

    fetchStagesData();
    fetchBandsData();
  }, []);

  const handleDeleteClick = (stage: z.infer<typeof Stage>) => {
    setStageToDelete(stage);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (stage: z.infer<typeof Stage>) => {
    setStageToEdit(stage);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!stageToDelete) return;
    setIsDeleting(true);
    try {
      await deleteStage(stageToDelete.id);
      setIsDeleteDialogOpen(false);
      setStageToDelete(null);
      await loadStages();
    } catch (error) {
      console.error("Error deleting stage:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const loadStages = async () => {
    try {
      const stagesData = await fetchStages();
      setStagesData(stagesData);
    } catch (error) {
      console.error("Error fetching stages:", error);
    }
  };

  useEffect(() => {
    loadStages();
  }, []);

  return (
    <MainContentWrapper title="Stages">
      <div className="flex justify-end pb-4">
        <Button onClick={() => setIsDialogOpen(true)}>Add Stage</Button>
      </div>
      <AddStageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStageAdded={loadStages}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Stage</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{stageToDelete?.stage_name}</span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                type="button"
                disabled={isDeleting}
                onClick={() => setStageToDelete(null)}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="hover:cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {stageToEdit && (
        <EditStageDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          stage={stageToEdit}
          onStageUpdated={loadStages}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stagesData.map((stage) => (
          <div
            key={stage.id}
            className="flex flex-col p-4 gap-2 rounded-xl border border-border bg-[#12121a] overflow-hidden"
          >
            <div className="flex items-center gap-2 align-center mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-1 h-7 rounded-[2px] flex-shrink-0"
                  style={{
                    backgroundColor:
                      STAGE_COLORS[stage.id % STAGE_COLORS.length],
                  }}
                />
                <span
                  className="font-bebas-neue text-[22px] tracking-wide leading-none"
                  style={{
                    color: STAGE_COLORS[stage.id % STAGE_COLORS.length],
                  }}
                >
                  {stage.stage_name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditClick(stage)}
                disabled={isEditing}
                className="hover:cursor-pointer"
              >
                <IconPencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(stage)}
                disabled={isDeleting}
                className="hover:cursor-pointer"
              >
                <IconTrash />
              </Button>
            </div>

            <p className="text-white text-sm font-light">
              {
                bandsData.filter(
                  (band) =>
                    band.stage.toLowerCase() === stage.stage_name.toLowerCase(),
                ).length
              }{" "}
              band
              {bandsData.filter((band) => band.stage === stage.stage_name)
                .length !== 1
                ? "s"
                : ""}{" "}
              scheduled
            </p>
            <p className="text-muted-foreground text-sm font-light">
              {stage.stage_description ?? "No description available"}
            </p>
          </div>
        ))}
      </div>
    </MainContentWrapper>
  );
}
