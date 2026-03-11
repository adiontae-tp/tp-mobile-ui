import { ComponentPage } from "@/demo/ComponentPage";
import { HeaderPreview } from "@/demo/previews/HeaderPreview";

const usage = `import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreVertical } from "lucide-react"

// The Header automatically handles safe area insets.
// Its background extends to the top edge of the screen,
// while content sits below the notch/status bar area.

<Header title="Page Title" />

<Header
  title="With Actions"
  leftAction={
    <Button variant="ghost" size="icon" className="h-9 w-9">
      <ArrowLeft className="h-5 w-5" />
    </Button>
  }
  rightAction={
    <Button variant="ghost" size="icon" className="h-9 w-9">
      <MoreVertical className="h-5 w-5" />
    </Button>
  }
/>`;

export function HeaderDemo() {
  return (
    <ComponentPage
      title="Header"
      description="Sticky top navigation bar with safe area handling. The background extends to the physical top of the screen while content sits below the notch/status bar. Works correctly on all devices."
      usage={usage}
      props={[
        { name: "title", type: "string", description: "Center title text." },
        { name: "leftAction", type: "ReactNode", description: "Left slot (typically a back button)." },
        { name: "rightAction", type: "ReactNode", description: "Right slot (menu, share, etc.)." },
      ]}
    >
      <HeaderPreview />
    </ComponentPage>
  );
}
