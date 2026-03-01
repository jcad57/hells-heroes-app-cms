"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { fetchBands } from "@/supabase/fetchBands";
import { fetchStages } from "@/supabase/fetchStages";
import { Band, ShowDate, Stage } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddStageDialog } from "@/components/ui/add-stage-dialog";
import { IconTrash } from "@tabler/icons-react";
import { deleteStage } from "@/supabase/manage-stage-data";
import { formatShowDate, formatShowTime } from "@/utils/format-date-helper";
import { fetchShowDates } from "@/supabase/fetchShowDates";

export default function StagesPage() {
  const [bandsData, setBandsData] = useState<z.infer<typeof Band>[]>([]);
  const [stagesData, setStagesData] = useState<z.infer<typeof Stage>[]>([]);
  const [showDatesData, setShowDatesData] = useState<
    z.infer<typeof ShowDate>[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<z.infer<
    typeof Stage
  > | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBandsData = async () => {
      const bands = await fetchBands();
      setBandsData(bands);
    };
    const fetchStagesData = async () => {
      const stages = await fetchStages();
      setStagesData(stages);
    };
    const fetchShowDatesData = async () => {
      const showDates = await fetchShowDates();
      setShowDatesData(showDates);
    };
    fetchBandsData();
    fetchStagesData();
    fetchShowDatesData();
  }, []);

  const handleDeleteClick = (stage: z.infer<typeof Stage>) => {
    setStageToDelete(stage);
    setIsDeleteDialogOpen(true);
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
    <div className="px-6">
      <div className="flex justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Stages</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsDialogOpen(true)}>Add Stage</Button>
          <Button onClick={() => setIsDialogOpen(true)}>Add Show Date</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {showDatesData
          .sort((a, b) => a.show_date.localeCompare(b.show_date))
          .map((showDate) => (
            <div key={showDate.id}>
              <div>
                <h2 className="text-md pb-4">
                  {formatShowDate(showDate.show_date)}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stagesData.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="">
                      <div className="flex justify-between items-center">
                        <CardTitle>{item.stage_name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <IconTrash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Band Name</TableHead>
                            <TableHead>Show Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bandsData
                            .sort((a, b) =>
                              a.show_time.localeCompare(b.show_time),
                            )
                            .map((band) => {
                              if (
                                item.stage_name.toLowerCase() ===
                                  band.stage.toLowerCase() &&
                                band.show_date === showDate.show_date
                              ) {
                                return (
                                  <TableRow key={band.id}>
                                    <TableCell className="font-medium">
                                      {band.name}
                                    </TableCell>
                                    <TableCell>
                                      {formatShowTime(band.show_time)}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
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
                variant="outline"
                type="button"
                disabled={isDeleting}
                onClick={() => setStageToDelete(null)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
