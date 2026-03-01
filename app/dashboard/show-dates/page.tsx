"use client";

import { z } from "zod";
import { ShowDate } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconTrash } from "@tabler/icons-react";
import { deleteShowDate } from "@/supabase/manage-show-dates";
import { fetchShowDates } from "@/supabase/fetchShowDates";
import { AddShowDateDialog } from "@/components/ui/add-show-date-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShowDate } from "@/utils/format-date-helper";

export default function ShowDatesPage() {
  const [showDatesData, setShowDatesData] = useState<
    z.infer<typeof ShowDate>[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDateToDelete, setShowDateToDelete] = useState<z.infer<
    typeof ShowDate
  > | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchShowDatesData = async () => {
      const showDates = await fetchShowDates();
      setShowDatesData(showDates);
    };
    fetchShowDatesData();
  }, []);

  const handleDeleteClick = (showDate: z.infer<typeof ShowDate>) => {
    setShowDateToDelete(showDate);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!showDateToDelete) return;
    setIsDeleting(true);
    try {
      await deleteShowDate(showDateToDelete.id);
      setIsDeleteDialogOpen(false);
      setShowDateToDelete(null);
      await loadShowDates();
    } catch (error) {
      console.error("Error deleting show date:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const loadShowDates = async () => {
    try {
      const showDatesData = await fetchShowDates();
      setShowDatesData(showDatesData);
    } catch (error) {
      console.error("Error fetching show dates:", error);
    }
  };

  useEffect(() => {
    loadShowDates();
  }, []);

  return (
    <div className="px-6">
      <div className="flex justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Show Dates</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Show Date</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showDatesData.map((showDate) => (
          <Card key={showDate.id}>
            <CardHeader className="">
              <div className="flex justify-between items-center">
                <CardTitle>{formatShowDate(showDate.show_date)}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteClick(showDate)}
                >
                  <IconTrash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
      <AddShowDateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onShowDateAdded={loadShowDates}
      />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Show Date</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {showDateToDelete
                  ? formatShowDate(showDateToDelete.show_date)
                  : ""}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDateToDelete(null)}
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
