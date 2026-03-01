import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchBands } from "@/supabase/fetchBands";
import { fetchStages } from "@/supabase/fetchStages";
import { fetchShowDates } from "@/supabase/fetchShowDates";
import { formatShowDate, formatShowTime } from "@/utils/format-date-helper";
import {
  IconMusic,
  IconLayoutGrid,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

export default async function OverviewPage() {
  const [bands, stages, showDates] = await Promise.all([
    fetchBands(),
    fetchStages(),
    fetchShowDates(),
  ]);

  const sortedShowDates = [...showDates].sort((a, b) =>
    a.show_date.localeCompare(b.show_date),
  );

  const statCards = [
    {
      label: "Total Bands",
      value: bands.length,
      icon: IconMusic,
      description: "Bands in the lineup",
    },
    {
      label: "Total Stages",
      value: stages.length,
      icon: IconLayoutGrid,
      description: "Active stages",
    },
    {
      label: "Show Dates",
      value: showDates.length,
      icon: IconCalendar,
      description: "Days of the festival",
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(({ label, value, icon: Icon, description }) => (
          <Card
            key={label}
            className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{label}</CardDescription>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                {value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}

        {/* Analytics cards (placeholder data) */}
        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>App Downloads</CardDescription>
              {/* <Badge variant="outline" className="text-xs">
                <IconTrendingUp className="size-3" />
                +12.5%
              </Badge> */}
            </div>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              1,234
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="@container/card bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Active Users</CardDescription>
              {/* <Badge variant="outline" className="text-xs">
                <IconTrendingDown className="size-3" />
                -20%
              </Badge> */}
            </div>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              234
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Acquisition needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Chart ── */}
      <ChartAreaInteractive />

      <Separator />

      {/* ── Lineup table ── */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Festival Lineup</h2>
        <p className="text-sm text-muted-foreground">
          {bands.length} band{bands.length !== 1 ? "s" : ""} across{" "}
          {showDates.length} day{showDates.length !== 1 ? "s" : ""} and{" "}
          {stages.length} stage{stages.length !== 1 ? "s" : ""}
        </p>
      </div>

      {bands.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No bands added yet.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedShowDates.map((showDate) => {
            const dayBands = bands
              .filter((b) => b.show_date === showDate.show_date)
              .sort((a, b) => a.show_time.localeCompare(b.show_time));

            return (
              <Card key={showDate.id}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {formatShowDate(showDate.show_date)}
                    </CardTitle>
                    <CardDescription>
                      {dayBands.length} band{dayBands.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pt-3">
                  {dayBands.length === 0 ? (
                    <p className="px-6 pb-6 text-sm text-muted-foreground">
                      No bands scheduled for this date.
                    </p>
                  ) : (
                    <Table className="table-fixed w-full">
                      <colgroup>
                        <col className="w-1/2" />
                        <col className="w-1/4" />
                        <col className="w-1/4" />
                      </colgroup>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>Band Name</TableHead>
                          <TableHead>Show Time</TableHead>
                          <TableHead>Stage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dayBands.map((band) => (
                          <TableRow key={band.id}>
                            <TableCell className="font-medium">
                              {band.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatShowTime(band.show_time)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-muted-foreground px-1.5 ${
                                  band.stage === "lawn"
                                    ? "bg-neutral-950"
                                    : band.stage === "upstairs"
                                      ? "bg-stone-900"
                                      : "bg-slate-950"
                                }`}
                              >
                                {band.stage.charAt(0).toUpperCase() +
                                  band.stage.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
