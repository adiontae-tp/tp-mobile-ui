import { useState, useRef } from "react";
import {
  DatePicker,
  DatePickerTrigger,
} from "@/components/ui/date-picker";
import { type DateRange } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Page, PageContent, ScrollView } from "@/components/ui/page";

export function DatePickerPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
  const [singleOpen, setSingleOpen] = useState(false);

  const [rangeDate, setRangeDate] = useState<DateRange | undefined>(undefined);
  const [rangeOpen, setRangeOpen] = useState(false);

  const [multipleDates, setMultipleDates] = useState<Date[]>([]);
  const [multipleOpen, setMultipleOpen] = useState(false);

  return (
    <Page ref={containerRef}>
      <PageContent>
        <ScrollView className="p-4">
          <div className="flex flex-col gap-6">
            {/* Single date picker */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Single Date
              </span>
              <DatePicker
                mode="single"
                selected={singleDate}
                onSelect={setSingleDate}
                open={singleOpen}
                onOpenChange={setSingleOpen}
                title="Select Date"
                container={containerRef.current}
              >
                <DatePickerTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {singleDate ? singleDate.toLocaleDateString() : "Pick a date…"}
                  </Button>
                </DatePickerTrigger>
              </DatePicker>
            </div>

            {/* Range date picker */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date Range
              </span>
              <DatePicker
                mode="range"
                selected={rangeDate}
                onSelect={setRangeDate}
                open={rangeOpen}
                onOpenChange={setRangeOpen}
                title="Select Range"
                container={containerRef.current}
              >
                <DatePickerTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {rangeDate?.from
                      ? rangeDate.to
                        ? `${rangeDate.from.toLocaleDateString()} – ${rangeDate.to.toLocaleDateString()}`
                        : `From: ${rangeDate.from.toLocaleDateString()}`
                      : "Pick a range…"}
                  </Button>
                </DatePickerTrigger>
              </DatePicker>
            </div>

            {/* Multiple date picker */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Multiple Dates
              </span>
              <DatePicker
                mode="multiple"
                selected={multipleDates}
                onSelect={setMultipleDates}
                open={multipleOpen}
                onOpenChange={setMultipleOpen}
                title="Select Dates"
                container={containerRef.current}
              >
                <DatePickerTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {multipleDates.length > 0
                      ? `${multipleDates.length} date${multipleDates.length > 1 ? "s" : ""} selected`
                      : "Pick dates…"}
                  </Button>
                </DatePickerTrigger>
              </DatePicker>
            </div>
          </div>
        </ScrollView>
      </PageContent>
    </Page>
  );
}
