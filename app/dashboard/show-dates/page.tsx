"use client";

import { z } from "zod";
import { Band, ShowDate } from "@/types";
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
import { IconTrash, IconCalendar } from "@tabler/icons-react";
import { deleteShowDate } from "@/supabase/manage-show-dates";
import { fetchShowDates } from "@/supabase/fetchShowDates";
import { AddShowDateDialog } from "@/components/ui/add-show-date-dialog";
import { formatShowDate } from "@/utils/format-date-helper";
import { fetchBands } from "@/supabase/fetchBands";
import MainContentWrapper from "@/components/new-ui-components/MainContentWrapper";

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
  const [bandsData, setBandsData] = useState<z.infer<typeof Band>[]>([]);

  useEffect(() => {
    const fetchShowDatesData = async () => {
      const showDates = await fetchShowDates();
      setShowDatesData(showDates);
    };
    const fetchBandsData = async () => {
      const bands = await fetchBands();
      setBandsData(bands);
    };
    fetchShowDatesData();
    fetchBandsData();
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
    <MainContentWrapper title="Show Dates">
      <div className="flex justify-end pb-4">
        <Button onClick={() => setIsDialogOpen(true)}>Add Show Date</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {showDatesData
          .sort((a, b) => a.show_date.localeCompare(b.show_date))
          .map((showDate) => (
            <div
              key={showDate.id}
              className="flex flex-col p-4 gap-2 rounded-xl border border-border bg-[#12121a] overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <IconCalendar className="size-4 text-[#3A97D4] flex-shrink-0" />
                  <span className="font-bebas-neue text-[22px] tracking-wide leading-none text-[#3A97D4]">
                    {formatShowDate(showDate.show_date)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(showDate)}
                  disabled={isDeleting}
                  className="hover:cursor-pointer"
                >
                  <IconTrash />
                </Button>
              </div>
              <p className="text-sm">
                {
                  bandsData.filter(
                    (band) => band.show_date === showDate.show_date,
                  ).length
                }{" "}
                bands
              </p>
              <p className="text-muted-foreground text-sm font-light">
                {new Date(showDate.show_date + "T00:00:00").toLocaleDateString(
                  "en-US",
                  { weekday: "long" },
                )}
              </p>
            </div>
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
                variant="secondary"
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDateToDelete(null)}
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
    </MainContentWrapper>
  );
}
