import { useState, useRef } from "react";
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerBody,
  DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/ui/header";
import { Page, PageContent, ScrollView } from "@/components/ui/page";
import { Menu, SlidersHorizontal } from "lucide-react";

const menuItems = [
  { label: "Home", icon: "🏠" },
  { label: "Profile", icon: "👤" },
  { label: "Settings", icon: "⚙️" },
  { label: "Help & Support", icon: "❓" },
  { label: "About", icon: "ℹ️" },
];

type Mode = "slide" | "push";

export function DrawerPreview() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("slide");
  const [width, setWidth] = useState("260px");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Page ref={containerRef}>
      <Drawer open={open} onOpenChange={setOpen} side="left" mode={mode} width={width}>
        <DrawerContent onClose={() => setOpen(false)} container={containerRef.current}>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Navigation</DrawerDescription>
          </DrawerHeader>
          <Separator />
          <nav className="flex flex-col py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="flex min-h-touch items-center gap-3 px-4 text-left text-sm font-medium active:bg-accent"
                onClick={() => setOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>

        <DrawerBody className="flex flex-col bg-background">
          <Header
            title="Drawer"
            leftAction={
              <DrawerTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-md active:bg-accent">
                  <Menu className="h-5 w-5" />
                </button>
              </DrawerTrigger>
            }
          />

          <PageContent>
            <ScrollView className="p-4">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Tap the menu icon to open. Try different modes and widths below.
                </p>

                {/* Mode selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mode</span>
                  <div className="flex gap-2">
                    {(["slide", "push"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={
                          "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors " +
                          (mode === m
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground active:bg-accent")
                        }
                      >
                        {m === "slide" ? "Slide (overlay)" : "Push (shift content)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Width selector */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Width</span>
                  <div className="flex gap-2">
                    {["200px", "260px", "80%"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWidth(w)}
                        className={
                          "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors " +
                          (width === w
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground active:bg-accent")
                        }
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>
                      <strong className="text-foreground">{mode}</strong> mode at <strong className="text-foreground">{width}</strong> width
                    </span>
                  </div>
                </div>
              </div>
            </ScrollView>
          </PageContent>
        </DrawerBody>
      </Drawer>
    </Page>
  );
}
