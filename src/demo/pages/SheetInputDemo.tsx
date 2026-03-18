import { ComponentPage } from "@/demo/ComponentPage";
import { SheetInputPreview } from "@/demo/previews/SheetInputPreview";

const usage = `import {
  SheetInput, SheetInputTrigger,
} from "@/components/ui/sheet-input"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const [value, setValue] = useState("")
const [open, setOpen] = useState(false)

<SheetInput
  open={open}
  onOpenChange={setOpen}
  title="Enter Details"
>
  <SheetInputTrigger
    value={value}
    placeholder="Tap to enter…"
  />
  <div className="flex flex-col gap-3">
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
    />
    <Button onClick={() => setOpen(false)}>
      Done
    </Button>
  </div>
</SheetInput>`;

export function SheetInputDemo() {
  return (
    <ComponentPage
      title="Sheet Input"
      description="An input-like trigger that opens a bottom sheet for complex input scenarios — multi-field forms, long text, pickers, or any custom content. Looks like a standard input but delegates the actual editing to a sheet."
      usage={usage}
      props={[
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when sheet opens or closes." },
        { name: "title", type: "string", description: "Sheet header title." },
        { name: "description", type: "string", description: "Sheet header description text." },
        { name: "detents", type: 'Detent[]', default: '["content"]', description: "Bottom sheet snap detents." },
        { name: "container", type: "HTMLElement | null", description: "Portal target for contained rendering." },
        { name: "value", type: "string", description: "Display value shown in the trigger (on SheetInputTrigger)." },
        { name: "placeholder", type: "string", description: "Placeholder text when no value (on SheetInputTrigger)." },
        { name: "startIcon", type: "ReactNode", description: "Icon at the start of the trigger." },
        { name: "endIcon", type: "ReactNode", description: "Icon at the end of the trigger. Default: ChevronRight." },
        { name: "hideEndIcon", type: "boolean", default: "false", description: "Hide the trailing icon." },
      ]}
    >
      <SheetInputPreview />
    </ComponentPage>
  );
}
