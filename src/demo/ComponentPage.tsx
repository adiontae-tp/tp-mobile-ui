import { PhonePreview } from "@/demo/PhonePreview";
import { CodeBlock } from "@/demo/CodeBlock";
import { QRPreview } from "@/demo/QRPreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ComponentPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
  usage: string;
  props?: Array<{ name: string; type: string; default?: string; description: string }>;
}

export function ComponentPage({
  title,
  description,
  children,
  usage,
  props,
}: ComponentPageProps) {
  const cliName = title.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      </div>

      {/* Preview + Code tabs */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-auto inline-flex bg-muted">
          <TabsTrigger value="preview" className="flex-none px-6">Preview</TabsTrigger>
          <TabsTrigger value="code" className="flex-none px-6">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="rounded-lg border bg-muted/30 p-6 md:p-10 lg:flex-1">
              <PhonePreview>{children}</PhonePreview>
            </div>
            <div className="shrink-0 lg:w-[220px]">
              <QRPreview path={`/${cliName}`} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <CodeBlock code={usage} filename={`${cliName}.tsx`} />
        </TabsContent>
      </Tabs>

      {/* Installation */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Installation</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Use the CLI to add this component to your project. It copies the source file and installs dependencies automatically.
        </p>
        <CodeBlock code={`npx mobile-ui add ${cliName}`} filename="terminal" />
      </section>

      {/* Usage */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Usage</h2>
        <CodeBlock code={usage} filename="example.tsx" />
      </section>

      {/* Props table */}
      {props && props.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">API Reference</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Prop</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Default</th>
                  <th className="px-4 py-3 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((prop) => (
                  <tr key={prop.name} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-primary">{prop.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.type}</td>
                    <td className="px-4 py-3 font-mono text-xs">{prop.default || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
