import { useState, useRef } from "react";
import {
  SheetInput,
  SheetInputTrigger,
} from "@/components/ui/sheet-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Page, PageContent, ScrollView } from "@/components/ui/page";
import { cn } from "@/lib/utils";
import { MapPin, FileText, Users } from "lucide-react";

export function SheetInputPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Text area example
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");

  // Address example
  const [address, setAddress] = useState("");
  const [addressOpen, setAddressOpen] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  // Multi-select example
  const [team, setTeam] = useState<string[]>([]);
  const [teamOpen, setTeamOpen] = useState(false);

  const teamMembers = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"];

  return (
    <Page ref={containerRef}>
      <PageContent>
        <ScrollView className="p-4">
          <div className="flex flex-col gap-6">
            {/* Notes — textarea in sheet */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </span>
              <SheetInput
                open={notesOpen}
                onOpenChange={(open) => {
                  if (open) setNotesDraft(notes);
                  setNotesOpen(open);
                }}
                title="Add Notes"
                description="Write any additional notes for this item."
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={notes}
                  placeholder="Add notes…"
                  startIcon={<FileText className="h-4 w-4" />}
                />
                <div className="flex flex-col gap-3">
                  <textarea
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Type your notes…"
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    autoFocus
                  />
                  <Button
                    onClick={() => {
                      setNotes(notesDraft);
                      setNotesOpen(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </SheetInput>
            </div>

            {/* Address — multi-field form in sheet */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Address
              </span>
              <SheetInput
                open={addressOpen}
                onOpenChange={setAddressOpen}
                title="Enter Address"
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={address}
                  placeholder="Enter address…"
                  startIcon={<MapPin className="h-4 w-4" />}
                />
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Street address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      placeholder="ZIP code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      inputMode="numeric"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const parts = [street, city, zip].filter(Boolean);
                      setAddress(parts.join(", "));
                      setAddressOpen(false);
                    }}
                  >
                    Save Address
                  </Button>
                </div>
              </SheetInput>
            </div>

            {/* Team picker — checkbox list in sheet */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Team Members
              </span>
              <SheetInput
                open={teamOpen}
                onOpenChange={setTeamOpen}
                title="Select Team"
                description="Choose team members to assign."
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={
                    team.length > 0
                      ? `${team.length} member${team.length > 1 ? "s" : ""} selected`
                      : undefined
                  }
                  placeholder="Select team members…"
                  startIcon={<Users className="h-4 w-4" />}
                />
                <div className="flex flex-col gap-1">
                  {teamMembers.map((name) => {
                    const selected = team.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() =>
                          setTeam((prev) =>
                            selected
                              ? prev.filter((n) => n !== name)
                              : [...prev, name]
                          )
                        }
                        className={cn(
                          "flex min-h-touch items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                          selected
                            ? "bg-primary/10 text-primary"
                            : "active:bg-accent"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          )}
                        >
                          {selected && (
                            <svg
                              viewBox="0 0 12 12"
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M2 6l3 3 5-5" />
                            </svg>
                          )}
                        </div>
                        {name}
                      </button>
                    );
                  })}
                  <div className="pt-2">
                    <Button
                      className="w-full"
                      onClick={() => setTeamOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </SheetInput>
            </div>
          </div>
        </ScrollView>
      </PageContent>
    </Page>
  );
}

