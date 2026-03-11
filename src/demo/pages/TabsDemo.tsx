import { ComponentPage } from "@/demo/ComponentPage";
import { TabsPreview } from "@/demo/previews/TabsPreview";

const usage = `import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs"

<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="about">About</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <p>General content here.</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings content here.</p>
  </TabsContent>
</Tabs>`;

export function TabsDemo() {
  return (
    <ComponentPage
      title="Tabs"
      description="Tabbed navigation panels built on Radix UI Tabs. Full-width triggers with 44px minimum height for easy tapping."
      usage={usage}
    >
      <TabsPreview />
    </ComponentPage>
  );
}
