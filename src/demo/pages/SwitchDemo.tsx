import { ComponentPage } from "@/demo/ComponentPage";
import { SwitchPreview } from "@/demo/previews/SwitchPreview";

const usage = `import { Switch } from "@/components/ui/switch"

const [enabled, setEnabled] = useState(false)

<div className="flex items-center justify-between">
  <span>Notifications</span>
  <Switch checked={enabled} onCheckedChange={setEnabled} />
</div>`;

export function SwitchDemo() {
  return (
    <ComponentPage
      title="Switch"
      description="Toggle control for binary settings. Built on Radix UI Switch for full accessibility. Touch-friendly 48x28 track size."
      usage={usage}
      props={[
        { name: "checked", type: "boolean", description: "Controlled checked state." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Change handler." },
        { name: "disabled", type: "boolean", default: "false", description: "Disables interaction." },
      ]}
    >
      <SwitchPreview />
    </ComponentPage>
  );
}
