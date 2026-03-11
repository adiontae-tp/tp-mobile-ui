import { Avatar } from "@/components/ui/avatar";

export function AvatarPreview() {
  return (
    <div className="flex flex-col gap-5 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sizes</p>
      <div className="flex items-center gap-3">
        <Avatar size="sm" fallback="S" />
        <Avatar size="default" fallback="M" />
        <Avatar size="lg" fallback="L" />
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">With image</p>
      <div className="flex items-center gap-3">
        <Avatar src="https://api.dicebear.com/9.x/initials/svg?seed=JD" alt="JD" />
        <Avatar src="https://api.dicebear.com/9.x/initials/svg?seed=AB" alt="AB" />
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fallback</p>
      <div className="flex items-center gap-3">
        <Avatar alt="John Doe" />
        <Avatar fallback="UI" />
      </div>
    </div>
  );
}
