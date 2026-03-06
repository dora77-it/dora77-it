import DayList from "@/components/DayList";
import MapView from "@/components/MapView";
import type { Day } from "@/types/itinerary";

type RawSearchParams = Record<string, string | string[] | undefined>;

const conceptTextMap: Record<string, string> = {
  family: "가족 여행",
  friends: "친구 여행",
  couple: "커플 여행",
  solo: "혼자 여행",
};

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default function ItineraryPage({
  searchParams,
}: {
  searchParams?: RawSearchParams;
}) {
  const destination = firstValue(searchParams?.destination) || "도쿄";
  const daysText = firstValue(searchParams?.days) || "3박 4일";
  const conceptKey = firstValue(searchParams?.concept) || "family";
  const concept = conceptTextMap[conceptKey] || "가족 여행";

  const days: Day[] = [
    {
      dayIndex: 1,
      date: "오전, 오후, 저녁",
      slots: [
        {
          timeOfDay: "09:00",
          title: "도쿄 타워",
          description: "도쿄의 상징적인 랜드마크에서 시내 전경 감상",
          location: { lat: 35.6586, lng: 139.7454 },
          tag: "명소",
          stayMinutes: 120,
        },
        {
          timeOfDay: "13:30",
          title: "아사쿠사 센소지",
          description: "전통적인 도쿄 분위기를 느낄 수 있는 오래된 사찰과 상점가",
          location: { lat: 35.7148, lng: 139.7967 },
          tag: "문화",
          stayMinutes: 150,
        },
        {
          timeOfDay: "18:00",
          title: "롯폰기 힐즈 식당가",
          description: "다양한 고급 레스토랑이 모여있는 복합 문화 공간에서 저녁 식사",
          location: { lat: 35.6605, lng: 139.7292 },
          tag: "식사",
          stayMinutes: 90,
        },
      ],
    },
    { dayIndex: 2, date: "오전, 오후, 저녁", slots: [] },
    { dayIndex: 3, date: "오전, 오후, 저녁", slots: [] },
    { dayIndex: 4, date: "오전", slots: [] },
  ];

  return (
    <main className="itinerary-page">
      <header className="itinerary-nav">
        <div className="brand">
          <span className="brand-logo">🧭</span>
          <span>Trip Planner</span>
        </div>
        <nav>
          <button type="button">일정</button>
          <button type="button">탐색</button>
          <button type="button">마이페이지</button>
          <button type="button" aria-label="profile">
            ◻
          </button>
        </nav>
      </header>

      <section className="itinerary-content">
        <aside className="schedule-panel">
          <p className="eyebrow">여행 일정 결과</p>
          <h1>
            {destination} {daysText} | {concept}
          </h1>

          <div className="action-row">
            <button type="button" className="primary-btn">
              ✎ 일정 수정
            </button>
            <button type="button" className="icon-btn" aria-label="share">
              ↗
            </button>
          </div>

          <DayList days={days} />
        </aside>

        <section className="map-panel">
          <MapView days={days} />
        </section>
      </section>
    </main>
  );
}
