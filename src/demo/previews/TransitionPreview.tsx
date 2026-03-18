import { useState } from "react";
import { Page, PageContent, ScrollView } from "@/components/ui/page";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Transition, type TransitionPreset } from "@/components/ui/transition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const presets: TransitionPreset[] = [
  "fade",
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "scale",
  "scale-up",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom",
  "flip-x",
  "flip-y",
  "blur",
  "pop",
];

const springs = ["snappy", "smooth", "bouncy", "gentle"] as const;

function SingleDemo() {
  const [active, setActive] = useState(true);
  const [preset, setPreset] = useState<TransitionPreset>("fade-up");
  const [spring, setSpring] = useState<"snappy" | "smooth" | "bouncy" | "gentle">("snappy");

  return (
    <div className="space-y-4">
      {/* Preview area */}
      <div className="flex min-h-[140px] items-center justify-center rounded-xl border bg-muted/30 p-4">
        <Transition type={preset} spring={spring} show={active}>
          <Card className="w-full">
            <CardContent className="p-4">
              <p className="text-sm font-medium">Animated content</p>
              <p className="text-xs text-muted-foreground mt-1">
                {preset} · {spring}
              </p>
            </CardContent>
          </Card>
        </Transition>
      </div>

      <Button
        onClick={() => setActive((v) => !v)}
        variant="outline"
        className="w-full"
      >
        {active ? "Hide" : "Show"}
      </Button>

      {/* Preset selector */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Preset
        </p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => { setPreset(p); setActive(true); }}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                preset === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Spring selector */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Spring
        </p>
        <div className="flex gap-2">
          {springs.map((s) => (
            <button
              key={s}
              onClick={() => { setSpring(s); setActive(false); setTimeout(() => setActive(true), 100); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                spring === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupDemo() {
  const [show, setShow] = useState(true);
  const [stagger, setStagger] = useState(0.05);

  const items = ["Inbox", "Drafts", "Sent", "Trash", "Archive", "Spam"];

  return (
    <div className="space-y-4">
      <div className="min-h-[260px] rounded-xl border bg-muted/30 p-3">
        <Transition.Group show={show} stagger={stagger} className="space-y-2">
          {items.map((item, i) => (
            <Transition.Child key={item} type="fade-up" spring="snappy">
              <div className="flex items-center justify-between rounded-lg bg-card border p-3">
                <span className="text-sm font-medium">{item}</span>
                <Badge animated variant={i === 0 ? "default" : "secondary"}>
                  {Math.floor(Math.random() * 20)}
                </Badge>
              </div>
            </Transition.Child>
          ))}
        </Transition.Group>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setShow((v) => !v)}
          variant="outline"
          className="flex-1"
        >
          {show ? "Hide all" : "Show all"}
        </Button>
        <Button
          onClick={() => {
            setShow(false);
            setTimeout(() => setShow(true), 200);
          }}
          variant="outline"
          className="flex-1"
        >
          Replay
        </Button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Stagger: {stagger}s
        </p>
        <div className="flex gap-2">
          {[0.03, 0.05, 0.08, 0.12].map((s) => (
            <button
              key={s}
              onClick={() => { setStagger(s); setShow(false); setTimeout(() => setShow(true), 200); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                stagger === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TransitionPreview() {
  return (
    <Page>
      <Header title="Transition" />
      <PageContent>
        <ScrollView className="p-4">
          <Tabs defaultValue="single">
            <TabsList>
              <TabsTrigger value="single">Single</TabsTrigger>
              <TabsTrigger value="group">Stagger Group</TabsTrigger>
            </TabsList>
            <TabsContent value="single">
              <SingleDemo />
            </TabsContent>
            <TabsContent value="group">
              <GroupDemo />
            </TabsContent>
          </Tabs>
        </ScrollView>
      </PageContent>
    </Page>
  );
}
