import type { Day } from "@/types/itinerary";

function formatStay(minutes?: number) {
  if (!minutes) {
    return "예상 체류: 미정";
  }

  const hour = Math.floor(minutes / 60);
  const remain = minutes % 60;

  if (hour === 0) {
    return `예상 체류: ${remain}분`;
  }

  if (remain === 0) {
    return `예상 체류: ${hour}시간`;
  }

  return `예상 체류: ${hour}.${Math.round(remain / 6)}시간`;
}

export default function DayList({ days }: { days: Day[] }) {
  return (
    <div className="day-list">
      {days.map((day, dayIndex) => (
        <section key={day.dayIndex} className="day-card">
          <header>
            <div className="day-index">{day.dayIndex}</div>
            <strong>{day.dayIndex}일차</strong>
            <span>{day.date}</span>
            <span className="chevron">{dayIndex === 0 ? "⌃" : "⌄"}</span>
          </header>

          {day.slots.length > 0 && (
            <ol className="timeline">
              {day.slots.map((slot) => (
                <li key={`${day.dayIndex}-${slot.timeOfDay}-${slot.title}`}>
                  <time>{slot.timeOfDay}</time>
                  <article>
                    <div className="slot-header">
                      <h3>{slot.title}</h3>
                      <span>{slot.tag}</span>
                    </div>
                    <p>{slot.description}</p>
                    <small>{formatStay(slot.stayMinutes)}</small>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  );
}
