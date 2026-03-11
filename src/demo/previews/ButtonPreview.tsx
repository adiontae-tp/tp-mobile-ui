import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function ButtonPreview() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="flex flex-col gap-2.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Variants</p>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </section>
      <section className="flex flex-col gap-2.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sizes</p>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <div className="flex gap-2">
          <Button size="icon"><Heart className="h-5 w-5" /></Button>
        </div>
      </section>
      <section className="flex flex-col gap-2.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">States</p>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </section>
    </div>
  );
}
