import type { Day } from "@/types/itinerary";
import styles from "./DayList.module.css";

export default function DayList({ days }: { days: Day[] }) {
  return (
    <div className={styles.container}>
      {days.map((day) => (
        <div key={day.dayIndex} className={styles.dayCard}>
          <div className={styles.dayHeader}>
            <h2 className={styles.dayTitle}>
              Day {day.dayIndex}
              {day.date && <span className={styles.dateSpan}>({day.date})</span>}
            </h2>
          </div>
          <ul className={styles.slotList}>
            {day.slots.map((slot, index) => (
              <li key={index} className={styles.slotItem}>
                <div className={styles.slotHeader}>
                  <span className={styles.timeOfDay}>
                    {slot.timeOfDay.charAt(0).toUpperCase() + slot.timeOfDay.slice(1)}
                  </span>
                  <span className={styles.slotTitle}>{slot.title}</span>
                </div>
                <div className={styles.slotDescription}>
                  {slot.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
