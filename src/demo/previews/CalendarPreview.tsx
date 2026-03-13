import { useState } from "react";
import {
  Calendar,
  CalendarHeader,
  CalendarGrid,
  type DateRange,
} from "@/components/ui/calendar";

export function CalendarPreview() {
  const [single, setSingle] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [multiple, setMultiple] = useState<Date[]>([]);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <div className="flex flex-col gap-6 p-3">
      {/* Single select */}
      <div className="flex flex-col gap-1">
        <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Single
        </span>
        <Calendar mode="single" selected={single} onSelect={setSingle}>
          <CalendarHeader />
          <CalendarGrid />
        </Calendar>
        <p className="px-1 text-xs text-muted-foreground">
          {single ? single.toLocaleDateString() : "No date selected"}
        </p>
      </div>

      {/* Range select */}
      <div className="flex flex-col gap-1">
        <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Range
        </span>
        <Calendar mode="range" selected={range} onSelect={setRange}>
          <CalendarHeader />
          <CalendarGrid />
        </Calendar>
        <p className="px-1 text-xs text-muted-foreground">
          {range?.from
            ? range.to
              ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
              : `From: ${range.from.toLocaleDateString()}`
            : "No range selected"}
        </p>
      </div>

      {/* Multiple select with min constraint */}
      <div className="flex flex-col gap-1">
        <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Multiple (past dates disabled)
        </span>
        <Calendar mode="multiple" selected={multiple} onSelect={setMultiple} min={yesterday}>
          <CalendarHeader />
          <CalendarGrid />
        </Calendar>
        <p className="px-1 text-xs text-muted-foreground">
          {multiple.length > 0
            ? `${multiple.length} date${multiple.length > 1 ? "s" : ""} selected`
            : "No dates selected"}
        </p>
      </div>
    </div>
  );
}
