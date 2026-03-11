import { ComponentPage } from "@/demo/ComponentPage";
import { TextPreview } from "@/demo/previews/TextPreview";

const usage = `import { Text } from "@/components/ui/text"

<Text variant="h1">Heading 1</Text>
<Text variant="h2">Heading 2</Text>
<Text variant="p">Body text paragraph.</Text>
<Text variant="lead">Lead introduction text.</Text>
<Text variant="large">Large emphasized text.</Text>
<Text variant="small">Small text.</Text>
<Text variant="muted">Muted secondary text.</Text>
<Text variant="code">inline code</Text>

// Custom element
<Text variant="h2" as="span">Renders as span</Text>`;

export function TextDemo() {
  return (
    <ComponentPage
      title="Text"
      description="Semantic typography component with variant-based styling. Automatically renders the correct HTML element for each variant."
      usage={usage}
      props={[
        { name: "variant", type: '"h1" | "h2" | "h3" | "h4" | "p" | "lead" | "large" | "small" | "muted" | "code"', default: '"p"', description: "Typography style and semantic element." },
        { name: "as", type: "ElementType", description: "Override the rendered HTML element." },
      ]}
    >
      <TextPreview />
    </ComponentPage>
  );
}
