import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function SwitchPreview() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Notifications</span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Dark mode</span>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Airplane mode</span>
        <Switch defaultChecked />
      </div>
      <div className="flex items-center justify-between opacity-50">
        <span className="text-sm font-medium">Disabled</span>
        <Switch disabled />
      </div>
      <p className="text-xs text-muted-foreground">
        Notifications: {enabled ? "On" : "Off"}
      </p>
    </div>
  );
}
