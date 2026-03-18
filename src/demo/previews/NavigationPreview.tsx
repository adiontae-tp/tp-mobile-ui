import { useState } from "react";
import {
  StackNavigator,
  TabNavigator,
  ModalNavigator,
  SharedElement,
  useNavigation,
  useRoute,
  type TransitionType,
} from "@/components/ui/navigation";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Home, Search, User, Plus, X } from "lucide-react";

/* ── Stack screens ───────────────────────────────────────────────── */

const transitionTypes: TransitionType[] = [
  "ios", "android", "fade", "slide-up", "slide-down", "zoom", "flip", "cover-vertical",
];

function FeedScreen() {
  const { push } = useNavigation();
  const items = [
    { id: "1", title: "Getting Started", color: "bg-blue-500" },
    { id: "2", title: "Components", color: "bg-purple-500" },
    { id: "3", title: "Navigation", color: "bg-green-500" },
    { id: "4", title: "Animations", color: "bg-orange-500" },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 space-y-3">
      <p className="text-sm text-muted-foreground mb-2">
        Tap a card to push a detail screen. Swipe from left edge to go back (iOS).
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          className="flex w-full items-center gap-3 rounded-xl border p-3 text-left active:bg-accent"
          onClick={() => push("detail", { id: item.id, title: item.title, color: item.color })}
        >
          <SharedElement id={`card-${item.id}`}>
            <div className={`h-12 w-12 rounded-lg ${item.color}`} />
          </SharedElement>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">Tap to view details</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function DetailScreen() {
  const { push } = useNavigation();
  const { params } = useRoute();
  const { id, title, color } = params as { id: string; title: string; color: string };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 space-y-4">
      <SharedElement id={`card-${id}`}>
        <div className={`h-40 w-full rounded-xl ${color}`} />
      </SharedElement>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">
        This screen was pushed onto the stack. You can go back by tapping the back button or
        swiping from the left edge on iOS.
      </p>
      <Button onClick={() => push("nested", { from: title })} className="w-full">
        Push another screen
      </Button>
    </div>
  );
}

function NestedScreen() {
  const { params } = useRoute();

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <p className="text-sm text-muted-foreground">
        Navigated from: <span className="font-medium text-foreground">{(params as { from: string }).from}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        This is a deeply nested screen. The full stack is preserved — swipe back
        multiple times to return to the feed.
      </p>
    </div>
  );
}

/* ── Search tab screen ───────────────────────────────────────────── */

function SearchScreen() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Search" />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          Search...
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          This tab has no stack — it's a simple content screen. Switch tabs to verify
          each tab preserves its state independently.
        </p>
      </div>
    </div>
  );
}

/* ── Profile tab screen ──────────────────────────────────────────── */

function ProfileScreen() {
  const nav = useNavigation();
  const hasModal = "presentModal" in nav;

  return (
    <div className="flex h-full flex-col">
      <Header title="Profile" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Demo User</p>
            <p className="text-sm text-muted-foreground">@demo</p>
          </div>
        </div>
        {hasModal && (
          <Button
            onClick={() => (nav as { presentModal: (name: string) => void }).presentModal("compose")}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Present Modal
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Modal screen ────────────────────────────────────────────────── */

function ComposeModal() {
  const nav = useNavigation();

  return (
    <div className="flex h-full flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Compose</h2>
        <button
          onClick={nav.goBack}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="rounded-lg border p-3 min-h-[120px] text-sm text-muted-foreground">
        This is a modal screen. It slides up from the bottom with a card-style animation.
        The content behind scales down. Swipe down or tap X to dismiss.
      </div>
      <Button variant="outline" onClick={nav.goBack} className="w-full">
        Dismiss
      </Button>
    </div>
  );
}

/* ── Main Preview ────────────────────────────────────────────────── */

export function NavigationPreview() {
  const [transition, setTransition] = useState<TransitionType>("ios");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border">
      {/* Transition picker */}
      <div className="shrink-0 border-b bg-muted/30 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Stack Transition
        </p>
        <div className="flex flex-wrap gap-1">
          {transitionTypes.map((t) => (
            <button
              key={t}
              onClick={() => setTransition(t)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                transition === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Navigator */}
      <div className="flex-1 min-h-0">
        <ModalNavigator>
          <ModalNavigator.Screen name="compose" component={ComposeModal} />
          <TabNavigator initialTab="home" animation="crossfade">
            <TabNavigator.Tab name="home" icon={<Home />} label="Home">
              <StackNavigator initialRoute="feed" transition={transition} key={transition}>
                <StackNavigator.Screen
                  name="feed"
                  component={FeedScreen}
                  title="Feed"
                />
                <StackNavigator.Screen
                  name="detail"
                  component={DetailScreen}
                  title={(params) => (params.title as string) || "Detail"}
                />
                <StackNavigator.Screen
                  name="nested"
                  component={NestedScreen}
                  title="Nested"
                />
              </StackNavigator>
            </TabNavigator.Tab>
            <TabNavigator.Tab name="search" icon={<Search />} label="Search">
              <SearchScreen />
            </TabNavigator.Tab>
            <TabNavigator.Tab name="profile" icon={<User />} label="Profile">
              <ProfileScreen />
            </TabNavigator.Tab>
          </TabNavigator>
        </ModalNavigator>
      </div>
    </div>
  );
}
