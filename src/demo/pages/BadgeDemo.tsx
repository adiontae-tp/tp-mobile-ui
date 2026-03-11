import { ComponentPage } from "@/demo/ComponentPage";
import { BadgePreview } from "@/demo/previews/BadgePreview";

const usage = `import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`;

export function BadgeDemo() {
  return (
    <ComponentPage
      title="Badge"
      description="Compact, pill-shaped status indicators with multiple visual variants."
      usage={usage}
      props={[
        { name: "variant", type: '"default" | "secondary" | "destructive" | "outline"', default: '"default"', description: "Visual style." },
      ]}
    >
      <BadgePreview />
    </ComponentPage>
  );
}
