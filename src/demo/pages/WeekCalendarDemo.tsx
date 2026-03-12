import { ComponentPage } from "@/demo/ComponentPage";
import { WeekCalendarPreview } from "@/demo/previews/WeekCalendarPreview";

const usage = `import {
  WeekCalendar, WeekCalendarStrip, WeekCalendarNav,
  WeekCalendarEvent, WeekCalendarDayEvents,
  type CalendarEvent,
} from "@/components/ui/week-calendar"

const events: CalendarEvent[] = [
  {
    id: "1",
    date: new Date(),
    title: "Team Meeting",
    startTime: "2:00 PM",
    endTime: "2:40 PM",
    duration: "40m",
  },
]

<WeekCalendar
  events={events}
  onDayPress={(day) => console.log("Tapped:", day)}
  onWeekChange={(weekStart) => console.log("Week:", weekStart)}
>
  <WeekCalendarStrip />
  <WeekCalendarNav />
  <WeekCalendarDayEvents
    onEventClick={(e) => console.log("Event:", e)}
    onEventMenuClick={(e) => console.log("Menu:", e)}
    emptyContent={<p>No events today.</p>}
  />
</WeekCalendar>`;

export function WeekCalendarDemo() {
  return (
    <ComponentPage
      title="Week Calendar"
      description="A mobile-first week view calendar with swipeable day strip, event dot indicators, and composable event cards. Today is auto-highlighted. Tapping a day fires a callback — the consumer decides the action."
      usage={usage}
      props={[
        { name: "weekOf", type: "Date", description: "Controlled: any date within the week to display." },
        { name: "defaultWeekOf", type: "Date", description: "Default week to display (uncontrolled)." },
        { name: "onDayPress", type: "(date: Date) => void", description: "Callback when a day in the strip is tapped." },
        { name: "onWeekChange", type: "(weekStart: Date) => void", description: "Callback when the displayed week changes via arrows or swipe." },
        { name: "events", type: "CalendarEvent[]", description: "Array of events — used for dot indicators and the event list." },
        { name: "date", type: "Date", description: "Which day's events to show in WeekCalendarDayEvents. Defaults to today." },
        { name: "onEventClick", type: "(event: CalendarEvent) => void", description: "Callback when an event card is tapped." },
        { name: "onEventMenuClick", type: "(event: CalendarEvent) => void", description: "Callback for the event card menu button." },
        { name: "renderEvent", type: "(event: CalendarEvent) => ReactNode", description: "Custom render function for event cards." },
        { name: "emptyContent", type: "ReactNode", description: "Content when no events exist for the displayed day." },
      ]}
    >
      <WeekCalendarPreview />
    </ComponentPage>
  );
}
