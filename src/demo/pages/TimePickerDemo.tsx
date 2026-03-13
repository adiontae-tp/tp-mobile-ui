import { ComponentPage } from "@/demo/ComponentPage";
import { TimePickerPreview } from "@/demo/previews/TimePickerPreview";

const usage = `import {
  TimePicker, TimePickerWheels,
  formatTimeValue, type TimeValue,
} from "@/components/ui/time-picker"

// Modal time picker
const [time, setTime] = useState<TimeValue>({
  hours: 9, minutes: 30, period: "AM",
})
const [open, setOpen] = useState(false)

<TimePicker
  open={open}
  onOpenChange={setOpen}
  value={time}
  onConfirm={setTime}
  format="12h"
  title="Select Time"
>
  <Button variant="outline">
    {formatTimeValue(time, "12h")}
  </Button>
</TimePicker>

// Inline wheels (no sheet)
<TimePickerWheels
  value={time}
  onChange={setTime}
  format="24h"
  minuteStep={5}
/>`;

export function TimePickerDemo() {
  return (
    <ComponentPage
      title="Time Picker"
      description="An iOS-style scroll wheel time picker with 12-hour and 24-hour formats. Use TimePicker for a modal bottom sheet presentation, or TimePickerWheels for inline use."
      usage={usage}
      props={[
        { name: "value", type: "TimeValue", description: "Controlled time value ({ hours, minutes, period? })." },
        { name: "defaultValue", type: "TimeValue", description: "Uncontrolled default time." },
        { name: "onConfirm", type: "(value: TimeValue) => void", description: "Fires when the user confirms (modal). Use onChange for inline." },
        { name: "onChange", type: "(value: TimeValue) => void", description: "Fires on every wheel change (inline TimePickerWheels)." },
        { name: "format", type: '"12h" | "24h"', description: 'Clock format. Default "12h".' },
        { name: "minuteStep", type: "number", description: "Minute increment. Default 1." },
        { name: "open", type: "boolean", description: "Controlled open state (modal)." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes (modal)." },
        { name: "title", type: "string", description: "Sheet header title." },
        { name: "confirmLabel", type: "string", description: 'Confirm button text. Default "Done".' },
        { name: "clearLabel", type: "string", description: 'Clear button text. Default "Clear".' },
        { name: "container", type: "HTMLElement | null", description: "Portal target for contained rendering." },
      ]}
    >
      <TimePickerPreview />
    </ComponentPage>
  );
}
