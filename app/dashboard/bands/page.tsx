"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { fetchBands } from "@/supabase/fetchBands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBandDialog } from "@/components/ui/add-band-dialog";
import { IconSearch } from "@tabler/icons-react";
import { useEffect } from "react";
import { Band } from "@/types";
import { z } from "zod";

export default function BandsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [bands, setBands] = React.useState<z.infer<typeof Band>[]>([]);

  const loadBands = async () => {
    try {
      const bandsData = await fetchBands();
      setBands(bandsData);
    } catch (error) {
      console.error("Error fetching bands:", error);
    }
  };

  useEffect(() => {
    loadBands();
  }, []);

  return (
    <div>
      <div className="px-6 pb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search bands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Add Band</Button>
      </div>
      <DataTable
        data={bands}
        searchQuery={searchQuery}
        onBandUpdated={loadBands}
      />
      <AddBandDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onBandAdded={loadBands}
      />
    </div>
  );
}
