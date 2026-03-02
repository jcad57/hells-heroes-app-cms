"use client";

import { useState, useEffect } from "react";
import { fetchBands } from "@/supabase/fetchBands";
import { fetchStages } from "@/supabase/fetchStages";
import { fetchShowDates } from "@/supabase/fetchShowDates";
import { formatShowDate, formatShowTime } from "@/utils/format-date-helper";
import { z } from "zod";
import { Band, Stage, ShowDate } from "@/types";
import { AddShowDateDialog } from "@/components/ui/add-show-date-dialog";

// Cycles through for as many stages as exist
const STAGE_COLORS = ["#f0c040", "#e05a5a", "#5ab4e0", "#a78bfa", "#34d399"];

export default function OverviewPage() {
  const [bands, setBands] = useState<z.infer<typeof Band>[]>([]);
  const [stages, setStages] = useState<z.infer<typeof Stage>[]>([]);
  const [showDates, setShowDates] = useState<z.infer<typeof ShowDate>[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddShowDateDialogOpen, setIsAddShowDateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadShowDates = async () => {
    const showDates = await fetchShowDates();
    setShowDates(showDates);
  };

  useEffect(() => {
    async function load() {
      try {
        const [b, s, d] = await Promise.all([
          fetchBands(),
          fetchStages(),
          fetchShowDates(),
        ]);
        setBands(b);
        setStages(s);
        setShowDates(
          [...d].sort((a, b) => a.show_date.localeCompare(b.show_date)),
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentShowDate = showDates[activeDay];
  const dayBands = currentShowDate
    ? bands.filter((b) => b.show_date === currentShowDate.show_date)
    : [];

  return (
    <div className="flex flex-col ">
      {/* ── Header ── */}
      <header className="px-4 lg:px-10 py-6 lg:py-8 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-bebas-neue font-bold text-5xl lg:text-6xl tracking-[3px] leading-none bg-gradient-to-br from-[#006CB3] via-[#3A97D4] to-white bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-light">
            March 18–21, 2026 · Houston, TX
          </p>
          <p className="text-muted-foreground text-sm font-light">
            White Oak Music Hall
          </p>
        </div>
      </header>

      {/* ── Day tabs ── */}
      {!loading && showDates.length > 0 && (
        <div className="flex border-b border-border px-4 lg:px-10 overflow-x-auto overflow-y-hidden">
          {showDates
            .sort((a, b) => a.show_date.localeCompare(b.show_date))
            .map((sd, idx) => (
              <button
                key={sd.id}
                onClick={() => setActiveDay(idx)}
                className={[
                  "flex flex-col items-start px-6 py-4 border-b-2 text-xs font-medium tracking-[0.08em] uppercase whitespace-nowrap relative bottom-[-1px] transition-all duration-200 hover:cursor-pointer",
                  activeDay === idx
                    ? "text-[#3A97D4] border-[#3A97D4]"
                    : "text-muted-foreground border-transparent hover:text-foreground",
                ].join(" ")}
              >
                Day {idx + 1}
                <span className="block text-[11px] font-light text-white tracking-[0.04em] normal-case mt-0.5 opacity-70">
                  {formatShowDate(sd.show_date)}
                </span>
              </button>
            ))}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsAddShowDateDialogOpen(true)}
              className="aspect-square size-8 rounded-md outline-dashed outline-white/0 hover:outline-white/60 hover:outline-1 hover:cursor-pointer transition-all duration-200"
            >
              <span className="text-muted-foreground ">+</span>
            </button>
          </div>
        </div>
      )}

      <AddShowDateDialog
        open={isAddShowDateDialogOpen}
        onOpenChange={setIsAddShowDateDialogOpen}
        onShowDateAdded={loadShowDates}
      />

      {/* ── Main content ── */}
      <div className="px-4 lg:px-10 py-6 lg:py-8 flex flex-col gap-6">
        {loading ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            Loading schedule…
          </p>
        ) : showDates.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No show dates have been added yet.
          </p>
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex bg-[#12121a] border border-border rounded-xl overflow-hidden">
              {[
                { value: dayBands.length, label: "Bands Today" },
                { value: stages.length, label: "Stages" },
                { value: bands.length, label: "Total Bands" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={[
                    "flex-1 py-4 px-4 text-center",
                    i < arr.length - 1 ? "border-r border-border" : "",
                  ].join(" ")}
                >
                  <div className="font-bebas-neue text-[32px] leading-none tracking-wide text-[#3A97D4]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-[0.08em] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Schedule grid — one column per stage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stages.map((stage, stageIdx) => {
                // const color = STAGE_COLORS[stageIdx % STAGE_COLORS.length];
                const stageBands = dayBands
                  .filter(
                    (b) =>
                      b.stage.toLowerCase() === stage.stage_name.toLowerCase(),
                  )
                  .sort((a, b) => a.show_time.localeCompare(b.show_time));

                return (
                  <div
                    key={stage.id}
                    className="bg-[#12121a] rounded-xl border border-border overflow-hidden"
                  >
                    {/* Stage header */}
                    <div className="px-5 py-4 flex items-center gap-2.5 border-b border-border">
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
                      <span className="ml-auto text-[11px] text-muted-foreground font-light">
                        {stageBands.length} band
                        {stageBands.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Band slots */}
                    <div className="p-3 flex flex-col gap-2">
                      {stageBands.length === 0 ? (
                        <p className="text-muted-foreground text-xs py-4 px-2 font-light">
                          No bands scheduled
                        </p>
                      ) : (
                        stageBands
                          .sort((a, b) =>
                            b.show_time.localeCompare(a.show_time),
                          )
                          .map((band, bandIdx) => {
                            // Last band of the day (when >1 exists) is treated as headliner
                            const isHeadliner =
                              bandIdx === 0 && stageBands.length > 1;

                            return (
                              <div
                                key={band.id}
                                className="relative rounded-lg px-4 py-3.5 overflow-hidden border transition-all duration-200 hover:translate-x-0.5"
                                style={{
                                  background: isHeadliner
                                    ? "rgba(255,255,255,0.04)"
                                    : "rgba(255,255,255,0.02)",
                                  borderColor: isHeadliner
                                    ? `${STAGE_COLORS[stage.id % STAGE_COLORS.length]}33`
                                    : "transparent",
                                }}
                              >
                                {/* Left accent bar */}
                                <div
                                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                                  style={{
                                    backgroundColor:
                                      STAGE_COLORS[
                                        stage.id % STAGE_COLORS.length
                                      ],
                                  }}
                                />

                                {isHeadliner && (
                                  <span
                                    className="absolute top-2.5 right-3 text-[9px] font-medium tracking-[0.1em] uppercase opacity-60"
                                    style={{
                                      color:
                                        STAGE_COLORS[
                                          stage.id % STAGE_COLORS.length
                                        ],
                                    }}
                                  >
                                    Headliner
                                  </span>
                                )}

                                <div className="text-[11px] text-muted-foreground font-light mb-1 tracking-[0.04em]">
                                  {formatShowTime(band.show_time)}
                                </div>
                                <div
                                  className="font-medium leading-tight"
                                  style={{
                                    fontSize: isHeadliner ? "18px" : "15px",
                                  }}
                                >
                                  {band.name}
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
