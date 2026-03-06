import DayList from "@/components/DayList";
import MapView from "@/components/MapView";
import type { Day } from "@/types/itinerary";
import styles from "./itinerary.module.css";

type SearchParams = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  concept?: string;
  pace?: string;
};

export default function ItineraryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { destination, startDate, endDate } = searchParams;
  const days: Day[] = [
    {
      dayIndex: 1,
      date: startDate,
      slots: [
        {
          timeOfDay: "morning",
          title: "도쿄 타워",
          description: "도쿄 전경을 한눈에 보는 전망대",
          location: { lat: 35.6586, lng: 139.7454 },
        },
        {
          timeOfDay: "afternoon",
          title: "아사쿠사 센소지",
          description: "전통 거리와 사원 산책",
          location: { lat: 35.7148, lng: 139.7967 },
        },
      ],
    },
  ];

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>{destination || "여행지"} 일정 결과</h1>
            <p className={styles.subtitle}>
              {startDate || "출발일"} ~ {endDate || "도착일"}
            </p>
          </div>
        </div>
      </header>
      <section className={styles.section}>
        <div className={styles.dayListWrapper}>
          <DayList days={days} />
        </div>
        <div className={styles.mapWrapper}>
          <MapView days={days} />
        </div>
      </section>
    </main>
  );
}
