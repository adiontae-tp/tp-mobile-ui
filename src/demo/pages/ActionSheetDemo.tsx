import { ComponentPage } from "@/demo/ComponentPage";
import { ActionSheetPreview } from "@/demo/previews/ActionSheetPreview";

const usage = `import { ActionSheet } from "@/components/ui/action-sheet"

const [open, setOpen] = useState(false)

<ActionSheet
  open={open}
  onOpenChange={setOpen}
  actions={[
    { label: "Share", icon: <Share2 />, onSelect: () => {} },
    { label: "Copy Link", icon: <Copy />, onSelect: () => {} },
    { label: "Delete", icon: <Trash2 />, onSelect: () => {}, destructive: true },
  ]}
>
  <Button>Show Actions</Button>
</ActionSheet>`;

export function ActionSheetDemo() {
  return (
    <ComponentPage
      title="Action Sheet"
      description="iOS-style action menu built on top of Bottom Sheet. Presents a list of contextual actions with an optional destructive style and cancel button."
      usage={usage}
      props={[
        { name: "actions", type: "ActionSheetAction[]", description: "Array of { label, icon?, onSelect, destructive? }." },
        { name: "cancelLabel", type: "string", default: '"Cancel"', description: "Text for the cancel button." },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Open state change handler." },
      ]}
    >
      <ActionSheetPreview />
    </ComponentPage>
  );
}
