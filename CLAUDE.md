# Mobile UI — Component Library

Mobile-first React + Tailwind component library for building native-feeling mobile apps on the web.

## Quick Reference

- **Stack**: React 19, TypeScript, Tailwind CSS v4, Vite, framer-motion
- **Type-check**: `npx tsc --noEmit`
- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Build CLI**: `cd cli && node build.js` (syncs registry from src/)
- **Path alias**: `@/` → `src/`

## Project Structure

```
src/
├── components/ui/          # Component library (the product)
│   ├── navigation/         # Navigation system (stack, tabs, modal, shared-element)
│   └── *.tsx               # Individual components
├── demo/
│   ├── pages/              # Docs pages (desktop) — *Demo.tsx
│   ├── previews/           # Mobile previews — *Preview.tsx
│   ├── DemoShell.tsx        # Desktop docs shell (sidebar + header)
│   ├── PreviewShell.tsx     # Mobile preview shell (header + outlet)
│   ├── ComponentPage.tsx    # Docs page template
│   └── PhonePreview.tsx     # Phone frame for docs previews
├── hooks/                  # Shared hooks
├── lib/utils.ts            # cn() — Tailwind class merger
├── App.tsx                 # Routes (docs + mobile previews)
├── app.css                 # Theme tokens, safe areas, animations
└── main.tsx                # Entry point
```

## Page Layout System

Every screen must use the Page layout system for correct positioning on all devices (especially iOS PWA). Components do not own their own full-screen layout — they are designed to be placed into Page slots.

### iOS PWA Viewport (`app.css`)

The root viewport follows an Ionic-inspired pattern for edge-to-edge rendering on iOS standalone PWAs:

- `html` has `min-height: calc(100% + env(safe-area-inset-top))` — compensates for iOS expanding the viewport upward behind the status bar without growing the document downward
- `html` has `background-color: var(--background)` — fills the home indicator area with the app color instead of white
- `body` is `position: fixed; overflow: hidden` on mobile (`< 768px`) — locks body to the physical screen and delegates all scrolling to `ScrollView` / component-level scroll containers
- Desktop (`>= 768px`) uses normal document scrolling for the docs site

### Core Components (`page.tsx`)

| Component | Role |
|-----------|------|
| `Page` | Absolutely-positioned flex-column container (`absolute inset-0`) with CSS containment — fills its nearest positioned ancestor |
| `PageContent` | Non-scrollable content area (`flex-1`, `relative`, `overflow-hidden`) |
| `ScrollView` | Scrollable region that fills its parent (`flex-1`, `overflow-y-auto`) |
| `PageFooter` | Bottom-anchored slot (`shrink-0`), sits above safe area |

### Usage Patterns

**Scrollable content with footer (most common):**
```tsx
<Page>
  <Header title="Settings" />
  <PageContent>
    <ScrollView className="p-4">
      {/* scrollable content */}
    </ScrollView>
  </PageContent>
  <PageFooter>
    <FooterButtons>
      <Button>Save</Button>
    </FooterButtons>
  </PageFooter>
</Page>
```

**Chat (component has its own scroll):**
```tsx
<Page>
  <PageContent>
    <ChatMessageList>{/* messages */}</ChatMessageList>
  </PageContent>
  <ChatTypingIndicator visible={isTyping} />
  <PageFooter>
    <ChatInput />
  </PageFooter>
</Page>
```

**Non-scrolling content (map, fixed layout):**
```tsx
<Page>
  <PageContent>
    <MapView />
  </PageContent>
  <ToolbarSheet>{/* toolbar */}</ToolbarSheet>
</Page>
```

**Tab bar:**
```tsx
<BottomTabs value={tab} onValueChange={setTab}>
  <Page>
    <PageContent>
      <ScrollView>
        <BottomTabsContent value="home">{/* ... */}</BottomTabsContent>
      </ScrollView>
    </PageContent>
    <PageFooter>
      <BottomTabsBar>{/* tabs */}</BottomTabsBar>
    </PageFooter>
  </Page>
</BottomTabs>
```

### Key Rules
- **Page** uses `absolute inset-0` to fill its nearest positioned ancestor — ensure the parent has `position: relative` (or is itself absolutely/fixed positioned)
- **PageContent** does NOT scroll — add `ScrollView` inside when scrolling is needed
- Components like `BottomTabs` and `Chat` use `display: contents` — they provide context/state but no layout. Page handles layout.
- Components with their own scroll (`ChatMessageList`) go directly inside `PageContent` without `ScrollView`
- Bottom-anchored components (`FooterButtons`, `BottomTabsBar`, `ChatInput`) go in `PageFooter`
- Overlay components (`ToolbarSheet`, `FooterSheet`, `ActionSheet`) work because `Page` establishes a positioning context
- **Safe area bottom padding**: use the inline pattern `pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))]` — do NOT use `pb-safe-bottom` (the Tailwind `@theme` token may not resolve `env()` correctly at runtime on iOS)

## Components

| Component | File | Key Exports |
|-----------|------|-------------|
| Page | `page.tsx` | `Page`, `PageContent`, `PageFooter`, `ScrollView` — page layout system |
| Button | `button.tsx` | `Button` — variants: default, destructive, outline, secondary, ghost, link; sizes: default, sm, lg, icon |
| Text | `text.tsx` | `Text` — semantic typography with variant/size props |
| Input | `input.tsx` | `Input` — mobile-optimized with 16px font (no iOS zoom) |
| Card | `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| Badge | `badge.tsx` | `Badge` — variants: default, secondary, destructive, outline |
| Avatar | `avatar.tsx` | `Avatar`, `AvatarImage`, `AvatarFallback` |
| Separator | `separator.tsx` | `Separator` |
| Switch | `switch.tsx` | `Switch` — Radix-based toggle |
| Checkbox | `checkbox.tsx` | `Checkbox` — Radix-based with indeterminate |
| Tabs | `tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| Header | `header.tsx` | `Header` — sticky nav bar with title, leftAction, rightAction |
| Bottom Sheet | `bottom-sheet.tsx` | `BottomSheet`, `BottomSheetContent`, etc. — snap points, drag physics |
| Action Sheet | `action-sheet.tsx` | `ActionSheet`, `ActionSheetItem`, etc. — iOS-style action menu |
| Toast | `toast.tsx` | `Toaster`, `toast()` — sonner-based notifications |
| Bottom Tabs | `bottom-tabs.tsx` | `BottomTabs` (context only), `BottomTabsBar`, `BottomTabsTab`, `BottomTabsContent` |
| Toolbar Sheet | `toolbar-sheet.tsx` | `ToolbarSheet` — bottom toolbar with expandable sheet |
| View Switcher | `view-switcher.tsx` | `View.Mobile`, `View.Tablet`, `View.Desktop`, `useViewport()` |
| Navigation | `navigation/index.ts` | `StackNavigator`, `TabNavigator`, `ModalNavigator`, `SharedElement`, `useNavigation`, `useRoute` |
| Drawer | `drawer.tsx` | `Drawer`, `DrawerContent`, `DrawerHeader`, etc. — slide-out panel with swipe |
| List | `list.tsx` | `List`, `ListSection`, `ListItem` — iOS-style grouped list |
| Footer Buttons | `footer-buttons.tsx` | `FooterButtons` — sticky footer bar for 1-2 action buttons |
| Footer Sheet | `footer-sheet.tsx` | `FooterSheet`, `FooterSheetContent`, `FooterSheetFooter` — bottom sheet with built-in footer buttons |
| Week Calendar | `week-calendar.tsx` | `WeekCalendar` — swipeable week calendar with date selection |
| Chat | `chat.tsx` | `Chat` (context only), `ChatMessageList`, `ChatMessage`, `ChatInput`, `ChatTypingIndicator` |
| Calendar | `calendar.tsx` | `Calendar` — full month grid with single, range, and multiple selection |
| Date Picker | `date-picker.tsx` | `DatePicker`, `DatePickerTrigger` — calendar in a bottom sheet |
| Time Picker | `time-picker.tsx` | `TimePicker`, `TimePickerWheels`, `formatTimeValue` — iOS-style scroll wheels |

## Patterns & Conventions

### Component Pattern
Every component follows this pattern:
- Uses `cn()` from `@/lib/utils` for className merging
- Forwarded refs via `React.forwardRef`
- Spreads remaining props (`...props`)
- Has a `displayName`
- Uses Tailwind classes with design token colors (`bg-background`, `text-primary`, etc.)
- Touch targets: minimum `min-h-touch` (44px via `--spacing-touch`)
- Safe areas: use `pb-[var(--safe-area-inset-bottom,env(safe-area-inset-bottom,0px))]` for bottom, `pt-safe-top` for top
- Components do NOT own full-screen layout — they are slots for the Page system

### Adding a New Component
1. Create `src/components/ui/{name}.tsx`
2. Create `src/demo/previews/{Name}Preview.tsx` — interactive mobile preview using `Page`/`PageContent`/`ScrollView`/`PageFooter`
3. Create `src/demo/pages/{Name}Demo.tsx` — wraps preview in `ComponentPage`
4. Register in `src/App.tsx` (import + two routes: docs + preview)
5. Add to sidebar in `src/demo/DemoShell.tsx` (`navSections`)
6. Add to mobile index in `src/demo/pages/PreviewIndex.tsx`
7. Add to CLI registry in `cli/src/registry.js` (file, dependencies, description)
8. Run `cd cli && node build.js` to sync registry files

### Animation
- framer-motion for physics-based animations
- Spring config: `{ damping: 28, stiffness: 260, mass: 0.8 }` (shared with bottom-sheet)
- GPU-composited properties only: `transform`, `opacity` — never animate `boxShadow`, `borderRadius`, `width`, `height`
- Use `will-change` sparingly

### Theme
- oklch color space in `app.css`
- Light/dark via CSS variables, toggled with `.dark` class on `<html>`
- Color tokens: background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring

### Navigation System (`navigation/`)
- State-driven stack (in-memory, no router dependency)
- Platform-detected transitions: iOS slide + swipe-back, Android fade-up
- `StackNavigator.Screen` accepts `title` prop for built-in animated header
- `TabNavigator` composes existing `BottomTabs` components
- `ModalNavigator` renders slide-up card modals with backdrop blur
- `SharedElement` uses framer-motion `layoutId` for morph animations
- Composable: Tabs → Stack → Modal all nest correctly

### Breakpoints (Tailwind v4 defaults)
- Mobile: `< 768px`
- Tablet: `768px – 1023px` (`md:`)
- Desktop: `>= 1024px` (`lg:`)

## CLI (`cli/`)

The CLI lets users add components to their projects (shadcn/ui pattern).

### Structure
```
cli/
├── src/
│   ├── index.js          # CLI entry point (commands: init, add, update, list)
│   └── registry.js       # Component metadata (files, deps, descriptions, version)
├── build.js              # Copies src/ components into cli/registry/ for distribution
├── dist/                 # Built CLI (gitignored, generated by build.js)
└── registry/             # Component files for distribution (gitignored, generated by build.js)
```

### Commands
- `npx mobile-ui init` — set up project (utils, theme, directories)
- `npx mobile-ui add <name...>` — add components (auto-resolves internal deps)
- `npx mobile-ui add --all` — add all components
- `npx mobile-ui update [name...]` — update installed components to latest version
- `npx mobile-ui list` — show available components with install/update status

### Version Tracking
- `REGISTRY_VERSION` in `registry.js` — bump when components change
- Components are stamped with `// mobile-ui@{version}` on first line when copied
- `update` command compares stamp to current version and overwrites if outdated
- `list` command shows ✓ (up to date) or ↑ (update available) per component
