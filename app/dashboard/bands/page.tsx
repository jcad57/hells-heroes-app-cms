"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import data from "../data.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBandDialog } from "@/components/ui/add-band-dialog";
import { IconSearch } from "@tabler/icons-react";

export default function BandsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

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
      <DataTable data={data} searchQuery={searchQuery} />
      <AddBandDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
