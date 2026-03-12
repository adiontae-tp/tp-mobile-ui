# Mobile UI — Component Library

Mobile-first React + Tailwind component library for building native-feeling mobile apps on the web.

## Quick Reference

- **Stack**: React 19, TypeScript, Tailwind CSS v4, Vite, framer-motion
- **Type-check**: `npx tsc --noEmit`
- **Dev server**: `npm run dev`
- **Build**: `npm run build`
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

## Components

| Component | File | Key Exports |
|-----------|------|-------------|
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
| Bottom Tabs | `bottom-tabs.tsx` | `BottomTabs`, `BottomTabsBar`, `BottomTabsTab`, `BottomTabsContent` |
| Toolbar Sheet | `toolbar-sheet.tsx` | `ToolbarSheet` — bottom toolbar with expandable sheet |
| View Switcher | `view-switcher.tsx` | `View.Mobile`, `View.Tablet`, `View.Desktop`, `useViewport()` |
| Navigation | `navigation/index.ts` | `StackNavigator`, `TabNavigator`, `ModalNavigator`, `SharedElement`, `useNavigation`, `useRoute` |

## Patterns & Conventions

### Component Pattern
Every component follows this pattern:
- Uses `cn()` from `@/lib/utils` for className merging
- Forwarded refs via `React.forwardRef`
- Spreads remaining props (`...props`)
- Has a `displayName`
- Uses Tailwind classes with design token colors (`bg-background`, `text-primary`, etc.)
- Touch targets: minimum `min-h-touch` (44px via `--spacing-touch`)
- Safe areas: `pb-safe-bottom`, `pt-safe-top` where applicable

### Adding a New Component
1. Create `src/components/ui/{name}.tsx`
2. Create `src/demo/previews/{Name}Preview.tsx` — interactive mobile preview
3. Create `src/demo/pages/{Name}Demo.tsx` — wraps preview in `ComponentPage`
4. Register in `src/App.tsx` (import + two routes: docs + preview)
5. Add to sidebar in `src/demo/DemoShell.tsx` (`navSections`)
6. Add to mobile index in `src/demo/pages/PreviewIndex.tsx`

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
