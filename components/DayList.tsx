import type { Day } from "@/types/itinerary";

export default function DayList({ days }: { days: Day[] }) {
  return (
    <div>
      {days.map((day) => (
        <div key={day.dayIndex} className="mb-4">
          <h2 className="font-semibold mb-2">
            {day.dayIndex}일차 {day.date && `(${day.date})`}
          </h2>

          <ul className="space-y-2">
            {day.slots.map((slot, index) => (
              <li key={index} className="border rounded p-2 text-sm">
                <div className="font-medium">
                  {slot.timeOfDay.toUpperCase()} · {slot.title}
                </div>
                <div className="text-gray-600">{slot.description}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
