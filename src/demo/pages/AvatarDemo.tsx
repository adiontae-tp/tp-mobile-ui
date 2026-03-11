import { ComponentPage } from "@/demo/ComponentPage";
import { AvatarPreview } from "@/demo/previews/AvatarPreview";

const usage = `import { Avatar } from "@/components/ui/avatar"

// With image
<Avatar src="/photo.jpg" alt="John Doe" />

// Fallback (initials)
<Avatar fallback="JD" />
<Avatar alt="John Doe" />  {/* Uses first letter */}

// Sizes
<Avatar size="sm" fallback="S" />
<Avatar size="default" fallback="M" />
<Avatar size="lg" fallback="L" />`;

export function AvatarDemo() {
  return (
    <ComponentPage
      title="Avatar"
      description="Circular user profile image with automatic fallback to initials when the image fails to load."
      usage={usage}
      props={[
        { name: "src", type: "string", description: "Image URL." },
        { name: "alt", type: "string", description: "Alt text. First letter used as fallback." },
        { name: "fallback", type: "string", description: "Fallback text (overrides alt initial)." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Avatar size." },
      ]}
    >
      <AvatarPreview />
    </ComponentPage>
  );
}
