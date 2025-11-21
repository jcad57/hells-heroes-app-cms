import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { DataTable } from "@/components/data-table";
import { fetchBands } from "@/supabase/fetchBands";

export default async function OverviewPage() {
  const bands = await fetchBands();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2">
      <div className="flex flex-col gap-4 pb-4">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
      <DataTable data={bands} />
    </div>
  );
}
