import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function TabsPreview() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">General</TabsTrigger>
          <TabsTrigger value="tab2">Settings</TabsTrigger>
          <TabsTrigger value="tab3">About</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <div className="rounded-lg border p-4">
            <p className="text-sm">General content goes here.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <div className="rounded-lg border p-4">
            <p className="text-sm">Settings panel content.</p>
          </div>
        </TabsContent>
        <TabsContent value="tab3">
          <div className="rounded-lg border p-4">
            <p className="text-sm">About section content.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
