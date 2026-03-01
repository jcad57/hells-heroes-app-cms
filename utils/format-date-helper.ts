/** Converts "YYYY-MM-DD" (e.g. "2026-03-19") to "Month D, YYYY" (e.g. "March 19, 2026"). */
export function formatShowDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  // Parse as local date by appending T00:00:00 to avoid UTC offset shifting the day
  const date = new Date(`${dateStr}T00:00:00`);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Converts "HH:mm:ss" (e.g. "20:00:00") to "h:mm am/pm" (e.g. "8:00 pm"). */
export function formatShowTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "—";
  const parts = timeStr.trim().split(":");
  const hours = parseInt(parts[0] ?? "0", 10);
  const minutes = parts[1] ?? "00";
  if (Number.isNaN(hours)) return timeStr;
  const period = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}
