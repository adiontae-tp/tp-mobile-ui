import { Separator } from "@/components/ui/separator";

export function SeparatorPreview() {
  return (
    <div className="flex flex-col gap-5 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Horizontal</p>
      <div>
        <p className="text-sm mb-3">Content above</p>
        <Separator />
        <p className="text-sm mt-3">Content below</p>
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vertical</p>
      <div className="flex h-8 items-center gap-4">
        <span className="text-sm">Left</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Center</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Right</span>
      </div>
    </div>
  );
}
