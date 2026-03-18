import { ComponentPage } from "@/demo/ComponentPage";
import { TransitionPreview } from "@/demo/previews/TransitionPreview";

const usage = `import { Transition } from "@/components/ui/transition"

// Basic entrance animation
<Transition type="fade-up">
  <Card>Content fades up on mount</Card>
</Transition>

// Toggle visibility
<Transition type="zoom" show={isVisible} spring="bouncy">
  <Card>Zooms in/out</Card>
</Transition>

// With delay
<Transition type="scale" delay={0.2}>
  <Card>Delayed entrance</Card>
</Transition>

// Staggered group
<Transition.Group stagger={0.05}>
  {items.map(item => (
    <Transition.Child key={item.id} type="fade-up">
      <ListItem>{item.name}</ListItem>
    </Transition.Child>
  ))}
</Transition.Group>

// Spring presets
<Transition type="pop" spring="bouncy">...</Transition>
<Transition type="fade-up" spring="smooth">...</Transition>
<Transition type="scale" spring="gentle">...</Transition>`;

export function TransitionDemo() {
  return (
    <ComponentPage
      title="Transition"
      description="Declarative entrance, exit, and stagger animations powered by framer-motion. 16 animation presets and 4 spring feels for building fluid mobile interactions."
      usage={usage}
      props={[
        { name: "type", type: "TransitionPreset", default: '"fade-up"', description: "Animation preset: fade, fade-up, fade-down, fade-left, fade-right, scale, scale-up, slide-up, slide-down, slide-left, slide-right, zoom, flip-x, flip-y, blur, pop." },
        { name: "spring", type: '"snappy" | "smooth" | "bouncy" | "gentle"', default: '"snappy"', description: "Spring physics feel." },
        { name: "show", type: "boolean", default: "true", description: "Controls visibility with AnimatePresence." },
        { name: "delay", type: "number", default: "0", description: "Delay before animation starts (seconds)." },
        { name: "duration", type: "number", default: "—", description: "Duration override (uses tween instead of spring)." },
        { name: "animateOnMount", type: "boolean", default: "true", description: "Whether to animate on initial mount." },
      ]}
    >
      <TransitionPreview />
    </ComponentPage>
  );
}
