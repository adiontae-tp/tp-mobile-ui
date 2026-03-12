import { ComponentPage } from "@/demo/ComponentPage";
import { FooterButtonsPreview } from "@/demo/previews/FooterButtonsPreview";

const usage = `import { FooterButtons } from "@/components/ui/footer-buttons"
import { FooterSheet, FooterSheetContent, FooterSheetFooter } from "@/components/ui/footer-sheet"
import { Button } from "@/components/ui/button"

// Two buttons
<FooterButtons>
  <Button variant="outline">Close</Button>
  <Button>Add Period</Button>
</FooterButtons>

// Single button (full width)
<FooterButtons>
  <Button>Save Changes</Button>
</FooterButtons>

// With expandable sheet
<FooterSheet snapPoints={[0, 200, 400]} defaultSnapPoint={0}>
  <FooterSheetContent>
    <p>Sheet content here — drag to expand</p>
  </FooterSheetContent>
  <FooterSheetFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </FooterSheetFooter>
</FooterSheet>`;

export function FooterButtonsDemo() {
  return (
    <ComponentPage
      title="Footer Buttons"
      description="Sticky footer bar for primary actions, with an optional expandable bottom sheet. Supports one or two buttons with automatic layout."
      usage={usage}
      props={[
        { name: "children", type: "ReactNode", description: "One or two Button elements (FooterButtons) or FooterSheetContent + FooterSheetFooter (FooterSheet)." },
        { name: "snapPoints", type: "number[]", description: "Sheet content heights in pixels. E.g. [0, 200, 400]. (FooterSheet only)" },
        { name: "defaultSnapPoint", type: "number", default: "0", description: "Index into snapPoints to start at. (FooterSheet only)" },
        { name: "onSnapPointChange", type: "(index: number) => void", description: "Called when the sheet settles on a snap point. (FooterSheet only)" },
      ]}
    >
      <FooterButtonsPreview />
    </ComponentPage>
  );
}
