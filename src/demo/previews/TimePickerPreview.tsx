import { useState, useRef } from "react";
import {
  TimePicker,
  TimePickerWheels,
  formatTimeValue,
  type TimeValue,
} from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { Page, PageContent, ScrollView } from "@/components/ui/page";

export function TimePickerPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [time12, setTime12] = useState<TimeValue>({
    hours: 9,
    minutes: 30,
    period: "AM",
  });
  const [open12, setOpen12] = useState(false);

  const [time24, setTime24] = useState<TimeValue>({
    hours: 14,
    minutes: 15,
  });
  const [open24, setOpen24] = useState(false);

  const [inlineTime, setInlineTime] = useState<TimeValue>({
    hours: 3,
    minutes: 0,
    period: "PM",
  });

  return (
    <Page ref={containerRef}>
      <PageContent>
        <ScrollView className="p-4">
          <div className="flex flex-col gap-6">
            {/* 12-hour modal */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                12-Hour
              </span>
              <TimePicker
                open={open12}
                onOpenChange={setOpen12}
                value={time12}
                onConfirm={setTime12}
                format="12h"
                title="Select Time"
                container={containerRef.current}
              >
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {formatTimeValue(time12, "12h")}
                </Button>
              </TimePicker>
            </div>

            {/* 24-hour modal */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                24-Hour
              </span>
              <TimePicker
                open={open24}
                onOpenChange={setOpen24}
                value={time24}
                onConfirm={setTime24}
                format="24h"
                title="Select Time"
                container={containerRef.current}
              >
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {formatTimeValue(time24, "24h")}
                </Button>
              </TimePicker>
            </div>

            {/* Inline wheels */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inline (5 min steps)
              </span>
              <div className="rounded-2xl border bg-card p-2">
                <TimePickerWheels
                  value={inlineTime}
                  onChange={setInlineTime}
                  format="12h"
                  minuteStep={5}
                />
              </div>
              <p className="px-1 text-xs text-muted-foreground">
                {formatTimeValue(inlineTime, "12h")}
              </p>
            </div>
          </div>
        </ScrollView>
      </PageContent>
    </Page>
  );
}
