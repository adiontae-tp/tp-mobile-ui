import { ComponentPage } from "@/demo/ComponentPage";
import { DatePickerPreview } from "@/demo/previews/DatePickerPreview";

const usage = `import {
  DatePicker, DatePickerTrigger,
} from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"

const [date, setDate] = useState<Date | undefined>()
const [open, setOpen] = useState(false)

<DatePicker
  mode="single"
  selected={date}
  onSelect={setDate}
  open={open}
  onOpenChange={setOpen}
  title="Select Date"
>
  <DatePickerTrigger asChild>
    <Button variant="outline">
      {date ? date.toLocaleDateString() : "Pick a date…"}
    </Button>
  </DatePickerTrigger>
</DatePicker>`;

export function DatePickerDemo() {
  return (
    <ComponentPage
      title="Date Picker"
      description="A modal date picker that presents a Calendar inside a bottom sheet. Supports single, range, and multiple selection modes. In single mode, selecting a date auto-closes the sheet. Range and multiple modes show confirm/clear footer buttons."
      usage={usage}
      props={[
        { name: "mode", type: '"single" | "range" | "multiple"', description: 'Selection mode. Default "single".' },
        { name: "selected", type: "Date | DateRange | Date[]", description: "Controlled selected value." },
        { name: "onSelect", type: "(value) => void", description: "Callback when selection changes." },
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
        { name: "title", type: "string", description: "Sheet header title." },
        { name: "confirmLabel", type: "string", description: 'Confirm button text (range/multiple). Default "Done".' },
        { name: "clearLabel", type: "string", description: 'Clear button text. Default "Clear".' },
        { name: "closeOnSelect", type: "boolean", description: "Auto-close on select in single mode. Default true." },
        { name: "min", type: "Date", description: "Earliest selectable date." },
        { name: "max", type: "Date", description: "Latest selectable date." },
        { name: "disabled", type: "Date[] | (date: Date) => boolean", description: "Disabled dates." },
        { name: "container", type: "HTMLElement | null", description: "Portal target for contained rendering." },
      ]}
    >
      <DatePickerPreview />
    </ComponentPage>
  );
}
