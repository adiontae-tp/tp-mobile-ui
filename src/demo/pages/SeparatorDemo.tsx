import { ComponentPage } from "@/demo/ComponentPage";
import { SeparatorPreview } from "@/demo/previews/SeparatorPreview";

const usage = `import { Separator } from "@/components/ui/separator"

// Horizontal (default)
<Separator />

// Vertical
<div className="flex h-8 items-center gap-4">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>`;

export function SeparatorDemo() {
  return (
    <ComponentPage
      title="Separator"
      description="A visual divider for separating content sections. Supports horizontal and vertical orientations."
      usage={usage}
      props={[
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction of the separator." },
        { name: "decorative", type: "boolean", default: "true", description: 'When false, adds role="separator" for accessibility.' },
      ]}
    >
      <SeparatorPreview />
    </ComponentPage>
  );
}
