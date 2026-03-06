import DayList from "@/components/DayList";
import MapView from "@/components/MapView";
import type { Day } from "@/types/itinerary";

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
    <main className="min-h-screen flex flex-col p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{destination || "여행지"} 일정 결과</h1>
        <p className="text-sm text-gray-600">
          {startDate || "출발일"} ~ {endDate || "도착일"}
        </p>
      </header>

      <section className="flex flex-1 gap-4">
        <div className="w-1/3 border rounded p-2 overflow-y-auto">
          <DayList days={days} />
        </div>
        <div className="flex-1 border rounded" style={{ minHeight: 480 }}>
          <MapView days={days} />
        </div>
      </section>
    </main>
  );
}
