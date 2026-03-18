import { useState, useRef } from "react";
import {
  SheetInput,
  SheetInputTrigger,
} from "@/components/ui/sheet-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Page, PageContent, ScrollView } from "@/components/ui/page";
import { cn } from "@/lib/utils";
import {
  MapPin,
  FileText,
  Users,
  Tag,
  Hash,
  Search,
  Check,
  User,
} from "lucide-react";

const categories = [
  "General",
  "Bug Report",
  "Feature Request",
  "Support",
  "Billing",
  "Security",
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "India",
  "South Korea",
  "Mexico",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
];

export function SheetInputPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Name — simple text input
  const [name, setName] = useState("");
  const [nameOpen, setNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  // Notes — textarea
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");

  // Address — multi-field form
  const [address, setAddress] = useState("");
  const [addressOpen, setAddressOpen] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  // Team — multi-select checkboxes
  const [team, setTeam] = useState<string[]>([]);
  const [teamOpen, setTeamOpen] = useState(false);

  const teamMembers = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank"];

  // Category — single select
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Quantity — number stepper
  const [quantity, setQuantity] = useState(1);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [quantityDraft, setQuantityDraft] = useState(1);

  // Country — search select
  const [country, setCountry] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <Page ref={containerRef}>
      <PageContent>
        <ScrollView className="p-4">
          <div className="flex flex-col gap-6">
            {/* Name — simple text input */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </span>
              <SheetInput
                open={nameOpen}
                onOpenChange={(open) => {
                  if (open) setNameDraft(name);
                  setNameOpen(open);
                }}
                title="Enter Name"
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={name}
                  placeholder="Enter your name…"
                  startIcon={<User className="h-4 w-4" />}
                />
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Full name"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    autoFocus
                  />
                  <Button
                    onClick={() => {
                      setName(nameDraft);
                      setNameOpen(false);
                    }}
                  >
                    Done
                  </Button>
                </div>
              </SheetInput>
            </div>

            {/* Category — single select */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <SheetInput
                open={categoryOpen}
                onOpenChange={setCategoryOpen}
                title="Select Category"
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={category}
                  placeholder="Choose a category…"
                  startIcon={<Tag className="h-4 w-4" />}
                />
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setCategoryOpen(false);
                      }}
                      className={cn(
                        "flex min-h-touch items-center justify-between rounded-lg px-3 text-sm transition-colors",
                        category === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "active:bg-accent"
                      )}
                    >
                      {cat}
                      {category === cat && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </SheetInput>
            </div>

            {/* Country — search select */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Country
              </span>
              <SheetInput
                open={countryOpen}
                onOpenChange={(open) => {
                  if (open) setCountrySearch("");
                  setCountryOpen(open);
                }}
                title="Select Country"
                detents={["60%"]}
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={country}
                  placeholder="Search country…"
                  startIcon={<Search className="h-4 w-4" />}
                />
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder="Search…"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    startIcon={<Search className="h-4 w-4" />}
                    autoFocus
                  />
                  <div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No results found
                      </div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setCountryOpen(false);
                          }}
                          className={cn(
                            "flex min-h-touch items-center justify-between rounded-lg px-3 text-sm transition-colors",
                            country === c
                              ? "bg-primary/10 text-primary font-medium"
                              : "active:bg-accent"
                          )}
                        >
                          {c}
                          {country === c && <Check className="h-4 w-4" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </SheetInput>
            </div>

            {/* Quantity — number stepper */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quantity
              </span>
              <SheetInput
                open={quantityOpen}
                onOpenChange={(open) => {
                  if (open) setQuantityDraft(quantity);
                  setQuantityOpen(open);
                }}
                title="Set Quantity"
                container={containerRef.current}
              >
                <SheetInputTrigger
                  value={quantity > 0 ? String(quantity) : undefined}
                  placeholder="Set quantity…"
                  startIcon={<Hash className="h-4 w-4" />}
                />
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setQuantityDraft((q) => Math.max(0, q - 1))}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl font-bold transition-colors active:bg-accent"
                    >
                      −
                    </button>
                    <span className="min-w-[3ch] text-center text-3xl font-bold tabular-nums">
                      {quantityDraft}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantityDraft((q) => q + 1)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl font-bold transition-colors active:bg-accent"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setQuantity(quantityDraft);
                      setQuantityOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </SheetInput>
            </div>

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
