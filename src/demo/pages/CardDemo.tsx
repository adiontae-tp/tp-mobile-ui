import { ComponentPage } from "@/demo/ComponentPage";
import { CardPreview } from "@/demo/previews/CardPreview";

const usage = `import {
  Card, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description text.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card body content.</p>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Action</Button>
  </CardFooter>
</Card>

// Pressable card with tap feedback
<Card pressable>
  <CardHeader>
    <CardTitle>Tap me</CardTitle>
  </CardHeader>
</Card>`;

export function CardDemo() {
  return (
    <ComponentPage
      title="Card"
      description="Flexible content container with compound sub-components. Supports an optional pressable variant with touch feedback."
      usage={usage}
      props={[
        { name: "pressable", type: "boolean", default: "false", description: "Adds active:scale tap feedback." },
      ]}
    >
      <CardPreview />
    </ComponentPage>
  );
}
