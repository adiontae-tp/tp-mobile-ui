import { ComponentPage } from "@/demo/ComponentPage";
import { CalendarPreview } from "@/demo/previews/CalendarPreview";

const usage = `import {
  Calendar, CalendarHeader, CalendarGrid,
  type DateRange,
} from "@/components/ui/calendar"

// Single date
const [date, setDate] = useState<Date | undefined>(new Date())

<Calendar mode="single" selected={date} onSelect={setDate}>
  <CalendarHeader />
  <CalendarGrid />
</Calendar>

// Date range
const [range, setRange] = useState<DateRange | undefined>()

<Calendar mode="range" selected={range} onSelect={setRange}>
  <CalendarHeader />
  <CalendarGrid />
</Calendar>

// Multiple dates with constraints
<Calendar
  mode="multiple"
  selected={dates}
  onSelect={setDates}
  min={new Date()}
  disabled={(d) => d.getDay() === 0}
>
  <CalendarHeader />
  <CalendarGrid />
</Calendar>`;

export function CalendarDemo() {
  return (
    <ComponentPage
      title="Calendar"
      description="A full month calendar grid with swipeable month navigation and three selection modes. Follows the compound component pattern — compose CalendarHeader and CalendarGrid as children of Calendar."
      usage={usage}
      props={[
        { name: "mode", type: '"single" | "range" | "multiple"', description: 'Selection mode. Default "single".' },
        { name: "selected", type: "Date | DateRange | Date[]", description: "Controlled selected value (type depends on mode)." },
        { name: "defaultSelected", type: "same", description: "Uncontrolled default selection." },
        { name: "onSelect", type: "(value) => void", description: "Callback when the selection changes." },
        { name: "month", type: "Date", description: "Controlled displayed month." },
        { name: "defaultMonth", type: "Date", description: "Initial month (defaults to today or first selected date)." },
        { name: "onMonthChange", type: "(date: Date) => void", description: "Fires when the displayed month changes." },
        { name: "min", type: "Date", description: "Earliest selectable date." },
        { name: "max", type: "Date", description: "Latest selectable date." },
        { name: "disabled", type: "Date[] | (date: Date) => boolean", description: "Disabled dates — array or predicate." },
        { name: "weekStartsOn", type: "0-6", description: "First day of week. Default 0 (Sunday)." },
      ]}
    >
      <CalendarPreview />
    </ComponentPage>
  );
}
