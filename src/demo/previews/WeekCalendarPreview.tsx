import { useMemo } from "react";
import {
  WeekCalendar,
  WeekCalendarStrip,
  WeekCalendarNav,
  WeekCalendarDayEvents,
  type CalendarEvent,
} from "@/components/ui/week-calendar";

/** Generate a rich set of events across multiple weeks. */
function generateEvents(centerDate: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const start = new Date(centerDate);
  start.setDate(start.getDate() - 21); // 3 weeks back

  for (let week = 0; week < 8; week++) {
    const weekBase = new Date(start);
    weekBase.setDate(weekBase.getDate() + week * 7);

    // Monday — Morning standup
    const mon = new Date(weekBase);
    mon.setDate(mon.getDate() + ((1 - mon.getDay() + 7) % 7));
    events.push({
      id: `standup-${week}`,
      date: mon,
      title: "Team Standup",
      startTime: "9:00 AM",
      endTime: "9:15 AM",
      duration: "15m",
    });

    // Monday — Sprint planning (every other week)
    if (week % 2 === 0) {
      events.push({
        id: `sprint-${week}`,
        date: mon,
        title: "Sprint Planning",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        duration: "1h 30m",
      });
    }

    // Tuesday — Practice
    const tue = new Date(weekBase);
    tue.setDate(tue.getDate() + ((2 - tue.getDay() + 7) % 7));
    events.push({
      id: `practice-${week}`,
      date: tue,
      title: "Practice",
      startTime: "4:00 PM",
      endTime: "5:30 PM",
      duration: "1h 30m",
    });

    // Tuesday — Film review
    events.push({
      id: `film-${week}`,
      date: tue,
      title: "Film Review",
      startTime: "6:00 PM",
      endTime: "7:00 PM",
      duration: "1h",
    });

    // Wednesday — Conditioning
    const wed = new Date(weekBase);
    wed.setDate(wed.getDate() + ((3 - wed.getDay() + 7) % 7));
    events.push({
      id: `conditioning-${week}`,
      date: wed,
      title: "Conditioning",
      startTime: "3:30 PM",
      endTime: "4:30 PM",
      duration: "1h",
    });

    // Thursday — Game Day
    const thu = new Date(weekBase);
    thu.setDate(thu.getDate() + ((4 - thu.getDay() + 7) % 7));
    events.push({
      id: `game-${week}`,
      date: thu,
      title: "Game Day",
      startTime: "2:00 PM",
      endTime: "2:40 PM",
      duration: "40m",
    });

    // Thursday — Team dinner
    events.push({
      id: `dinner-${week}`,
      date: thu,
      title: "Team Dinner",
      startTime: "6:30 PM",
      endTime: "8:00 PM",
      duration: "1h 30m",
    });

    // Friday — Recovery / light practice
    const fri = new Date(weekBase);
    fri.setDate(fri.getDate() + ((5 - fri.getDay() + 7) % 7));
    events.push({
      id: `recovery-${week}`,
      date: fri,
      title: "Recovery Session",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      duration: "1h",
    });

    // Saturday — Tournament (alternating weeks)
    if (week % 2 === 0) {
      const sat = new Date(weekBase);
      sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7));
      events.push({
        id: `tournament-${week}`,
        date: sat,
        title: "Tournament",
        startTime: "9:00 AM",
        endTime: "12:00 PM",
        duration: "3h",
      });
    }

    // Sunday — Open gym (some weeks)
    if (week % 3 === 0) {
      const sun = new Date(weekBase);
      sun.setDate(sun.getDate() - sun.getDay()); // Sunday
      events.push({
        id: `opengym-${week}`,
        date: sun,
        title: "Open Gym",
        startTime: "1:00 PM",
        endTime: "3:00 PM",
        duration: "2h",
      });
    }
  }

  return events;
}

export function WeekCalendarPreview() {
  const events = useMemo(() => generateEvents(new Date()), []);

  return (
    <div className="flex flex-col p-3">
      <WeekCalendar
        events={events}
        onDayPress={(day) =>
          alert(`Tapped: ${day.toLocaleDateString()}`)
        }
      >
        <div className="sticky top-0 z-10 flex flex-col gap-1 bg-background pb-1">
          <WeekCalendarStrip />
          <WeekCalendarNav />
        </div>
        <WeekCalendarDayEvents
          onEventClick={(e) => alert(`Event: ${e.title}`)}
          onEventMenuClick={(e) => alert(`Menu: ${e.title}`)}
          emptyContent={
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No events scheduled for today.
              </p>
            </div>
          }
        />
      </WeekCalendar>
    </div>
  );
}
