import { ComponentPage } from "@/demo/ComponentPage";
import { CheckboxPreview } from "@/demo/previews/CheckboxPreview";

const usage = `import { Checkbox } from "@/components/ui/checkbox"

<label className="flex items-center gap-3">
  <Checkbox />
  <span>Accept terms</span>
</label>`;

export function CheckboxDemo() {
  return (
    <ComponentPage
      title="Checkbox"
      description="Selection control built on Radix UI Checkbox. 24px minimum size for comfortable mobile tapping."
      usage={usage}
      props={[
        { name: "checked", type: "boolean", description: "Controlled checked state." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Change handler." },
        { name: "disabled", type: "boolean", default: "false", description: "Disables interaction." },
      ]}
    >
      <CheckboxPreview />
    </ComponentPage>
  );
}
