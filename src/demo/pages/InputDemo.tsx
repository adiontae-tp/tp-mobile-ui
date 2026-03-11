import { ComponentPage } from "@/demo/ComponentPage";
import { InputPreview } from "@/demo/previews/InputPreview";

const usage = `import { Input } from "@/components/ui/input"

// Basic
<Input placeholder="Enter text..." />

// With icons
<Input
  placeholder="Search..."
  startIcon={<Search className="h-4 w-4" />}
/>

// Mobile keyboard types — use inputMode instead of type="number"
// to get the right keyboard WITHOUT the spinner arrows
<Input placeholder="Amount" inputMode="decimal" />
<Input placeholder="Zip code" inputMode="numeric" pattern="[0-9]*" />
<Input placeholder="Phone" inputMode="tel" />
<Input placeholder="Email" inputMode="email" />
<Input placeholder="URL" inputMode="url" />

// Smart defaults: email/password/url inputs automatically
// set autoCapitalize="none" and autoCorrect="off"
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />`;

export function InputDemo() {
  return (
    <ComponentPage
      title="Input"
      description="Touch-friendly text input with mobile-native behavior. Uses 16px font to prevent iOS zoom, hides number spinners, and sets smart defaults for autocapitalize/autocorrect per input type."
      usage={usage}
      props={[
        { name: "startIcon", type: "ReactNode", description: "Icon displayed on the left side." },
        { name: "endIcon", type: "ReactNode", description: "Icon displayed on the right side." },
        { name: "inputMode", type: '"text" | "email" | "tel" | "numeric" | "decimal" | "url" | "search"', description: "Controls which keyboard opens on mobile. Use this instead of type=\"number\"." },
      ]}
    >
      <InputPreview />
    </ComponentPage>
  );
}
