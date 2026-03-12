import { useState } from "react";
import {
  ToolbarSheet,
  ToolbarSheetBar,
  ToolbarSheetAction,
  ToolbarSheetInfo,
  ToolbarSheetSeparator,
  ToolbarSheetContent,
  type SnapPoint,
} from "@/components/ui/toolbar-sheet";
import { X, Volume2, Map, ChevronRight, Navigation } from "lucide-react";

const steps = [
  { instruction: "Head south on Market St", distance: "0.3 mi", time: "2 min" },
  { instruction: "Turn right onto 3rd St", distance: "0.8 mi", time: "3 min" },
  { instruction: "Merge onto US-101 S", distance: "2.4 mi", time: "4 min" },
  { instruction: "Take exit 429B for César Chávez St", distance: "0.2 mi", time: "1 min" },
  { instruction: "Turn left onto César Chávez St", distance: "1.1 mi", time: "2 min" },
  { instruction: "Turn right onto Evans Ave", distance: "0.6 mi", time: "1 min" },
  { instruction: "Arrive at destination", distance: "", time: "1 min" },
];

export function ToolbarSheetPreview() {
  const [snap, setSnap] = useState<SnapPoint>("peek");

  return (
    <div className="absolute inset-0 overflow-hidden bg-muted/30">
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-muted/80">
        <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
          <Navigation className="h-8 w-8 text-primary/40" />
          <p className="text-sm text-muted-foreground">
            Map content stays interactive behind the sheet
          </p>
          <p className="text-xs text-muted-foreground/60">
            Current snap: <span className="font-semibold text-foreground">{snap}</span>
          </p>
        </div>
      </div>

      {/* Toolbar Sheet — parent is relative so absolute positioning works */}
      <ToolbarSheet
        defaultSnap="peek"
        onSnapChange={setSnap}
      >
          <ToolbarSheetBar>
            <ToolbarSheetAction
              variant="destructive"
              icon={<X />}
              label="End"
            />
            <div className="flex-1" />
            <ToolbarSheetAction variant="muted" icon={<Volume2 />} />
            <ToolbarSheetAction
              variant="muted"
              icon={<Map />}
              label="Overview"
            />
          </ToolbarSheetBar>

          <ToolbarSheetInfo>
            <span className="font-semibold text-foreground text-sm">14 min</span>
            <span>·</span>
            <span>6.2 mi</span>
            <span>·</span>
            <span>Fastest Route</span>
          </ToolbarSheetInfo>

          <ToolbarSheetSeparator />

          <ToolbarSheetContent>
            <div className="flex flex-col">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{step.instruction}</p>
                    {step.distance && (
                      <p className="text-xs text-muted-foreground">
                        {step.distance} · {step.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ToolbarSheetContent>
      </ToolbarSheet>
    </div>
  );
}
