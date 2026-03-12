import { ComponentPage } from "@/demo/ComponentPage";
import { DrawerPreview } from "@/demo/previews/DrawerPreview";

const usage = `import {
  Drawer, DrawerTrigger, DrawerContent, DrawerBody,
  DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter,
} from "@/components/ui/drawer"

const [open, setOpen] = useState(false)

// Slide mode (overlay) — default
<Drawer open={open} onOpenChange={setOpen} side="left">
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Menu</DrawerTitle>
    </DrawerHeader>
    <nav>...</nav>
  </DrawerContent>
  {/* No DrawerBody needed for slide mode */}
  <main>Page content</main>
</Drawer>

// Push mode — shifts page content aside
<Drawer open={open} onOpenChange={setOpen} mode="push" width="300px">
  <DrawerContent>...</DrawerContent>
  <DrawerBody>
    {/* Content that gets pushed */}
    <main>Page content</main>
  </DrawerBody>
</Drawer>

// Right side, custom width
<Drawer side="right" width="80%">
  ...
</Drawer>`;

export function DrawerDemo() {
  return (
    <ComponentPage
      title="Drawer"
      description="Side panel that slides in from the left or right edge. Supports slide (overlay) and push (shift content) modes with configurable width. Built on Radix Dialog + framer-motion."
      usage={usage}
      props={[
        { name: "side", type: '"left" | "right"', default: '"left"', description: "Which edge the drawer slides from" },
        { name: "mode", type: '"slide" | "push"', default: '"slide"', description: "Slide overlays on top; push shifts the page content" },
        { name: "width", type: "string", default: '"280px"', description: "Drawer panel width — any CSS value (px, %, rem)" },
        { name: "container", type: "HTMLElement | null", default: "—", description: "Portal target for contained rendering (e.g. inside a phone frame)" },
      ]}
    >
      <DrawerPreview />
    </ComponentPage>
  );
}
