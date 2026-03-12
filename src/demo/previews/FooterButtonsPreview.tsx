import { FooterButtons } from "@/components/ui/footer-buttons";
import { FooterSheet, FooterSheetContent, FooterSheetFooter } from "@/components/ui/footer-sheet";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export function FooterButtonsPreview() {
  const [mode, setMode] = useState<"two" | "one" | "sheet">("sheet");
  const [sheetOpen, setSheetOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex h-full flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Footer Buttons
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={mode === "sheet" ? "default" : "outline"}
            onClick={() => setMode("sheet")}
          >
            With Sheet
          </Button>
          <Button
            size="sm"
            variant={mode === "two" ? "default" : "outline"}
            onClick={() => setMode("two")}
          >
            Two Buttons
          </Button>
          <Button
            size="sm"
            variant={mode === "one" ? "default" : "outline"}
            onClick={() => setMode("one")}
          >
            One Button
          </Button>
        </div>

        {mode === "sheet" && (
          <Button variant="outline" className="w-full" onClick={() => setSheetOpen(true)}>
            Open Sheet
          </Button>
        )}

        <p className="text-sm text-muted-foreground">
          {mode === "sheet"
            ? "Opens a sheet with buttons inside. Drag to expand and reveal more content."
            : "Footer buttons stick to the bottom of the screen."}
        </p>
      </div>

      {mode === "two" && (
        <FooterButtons>
          <Button variant="outline">Close</Button>
          <Button>Add Period</Button>
        </FooterButtons>
      )}

      {mode === "one" && (
        <FooterButtons>
          <Button>Save Changes</Button>
        </FooterButtons>
      )}

      <FooterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[80, 260, 420]}
        defaultSnapPoint={0}
        container={containerRef.current}
      >
        <FooterSheetContent>
          <div className="space-y-3 py-2">
            <p className="text-sm font-medium">Select a period</p>
            {["Morning", "Afternoon", "Evening", "Night"].map((period) => (
              <button
                key={period}
                className="flex w-full items-center rounded-lg border px-3 py-2.5 text-sm hover:bg-accent active:bg-accent"
              >
                {period}
              </button>
            ))}
          </div>
        </FooterSheetContent>
        <FooterSheetFooter>
          <Button variant="outline" onClick={() => setSheetOpen(false)}>Close</Button>
          <Button>Add Period</Button>
        </FooterSheetFooter>
      </FooterSheet>
    </div>
  );
}
