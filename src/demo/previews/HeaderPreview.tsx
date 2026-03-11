import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";

export function HeaderPreview() {
  return (
    <div className="flex h-full flex-col">
      <Header
        title="Messages"
        leftAction={
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
        rightAction={
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5" />
          </Button>
        }
      />
      <div className="flex-1 p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 border-b py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {String.fromCharCode(65 + i)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Contact {String.fromCharCode(65 + i)}</p>
              <p className="text-xs text-muted-foreground">Last message preview...</p>
            </div>
            <span className="text-xs text-muted-foreground">{i + 1}m ago</span>
          </div>
        ))}
      </div>
    </div>
  );
}
