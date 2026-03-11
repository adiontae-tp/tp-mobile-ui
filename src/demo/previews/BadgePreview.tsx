import { Badge } from "@/components/ui/badge";

export function BadgePreview() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Variants</p>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In context</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Messages</span>
        <Badge>3 new</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status</span>
        <Badge variant="secondary">In Progress</Badge>
      </div>
    </div>
  );
}
