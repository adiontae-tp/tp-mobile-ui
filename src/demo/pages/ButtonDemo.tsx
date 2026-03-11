import { ComponentPage } from "@/demo/ComponentPage";
import { ButtonPreview } from "@/demo/previews/ButtonPreview";

const usage = `import { Button } from "@/components/ui/button"

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Heart /></Button>

// States
<Button loading>Saving...</Button>
<Button disabled>Disabled</Button>`;

export function ButtonDemo() {
  return (
    <ComponentPage
      title="Button"
      description="Displays a button with multiple variants, sizes, and states. All sizes enforce a 44px minimum touch target for mobile."
      usage={usage}
      props={[
        { name: "variant", type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"', default: '"default"', description: "Visual style of the button." },
        { name: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: "Size preset." },
        { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and disables interaction." },
        { name: "asChild", type: "boolean", default: "false", description: "Render as child element via Radix Slot." },
      ]}
    >
      <ButtonPreview />
    </ComponentPage>
  );
}
