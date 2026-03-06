import SearchForm from "@/components/SearchForm";

const features = [
  {
    title: "AI 자동 일정 생성",
    description: "원하는 여행 컨셉과 속도에 맞춰 완성형 일정을 자동으로 생성합니다.",
    icon: "✦",
  },
  {
    title: "최적 동선 안내",
    description: "이동 시간을 최소화한 하루 코스를 구성해 피로도를 줄여줍니다.",
    icon: "⌘",
  },
  {
    title: "로컬 맛집 추천",
    description: "현지 평가가 좋은 맛집과 카페를 일정 중간에 자연스럽게 제안합니다.",
    icon: "🍽",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="top-nav">
        <div className="brand">
          <span className="brand-logo">🧭</span>
          <span>AI 여행 플래너</span>
        </div>
        <nav>
          <button type="button">로그인</button>
          <button type="button">회원가입</button>
          <button type="button" className="create-btn">
            일정 만들기
          </button>
        </nav>
      </header>

      <section className="hero">
        <h1>
          당신만의 완벽한 여행 일정을 <br />
          <span>AI가 설계합니다</span>
        </h1>
        <p>
          목적지와 날짜, 취향만 알려주세요. 최적의 동선과 숨겨진 맛집까지 한 번에 제안합니다.
        </p>
        <SearchForm />
      </section>

      <section className="feature-section">
        <h2>AI 여행 플래너의 특별한 기능</h2>
        <p>단 몇 분이면 완성되는 나만의 맞춤형 여행 일정</p>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-overlay">
          <h2>지금 바로 여행을 시작해보세요</h2>
          <p>로그인하고 더 많은 맞춤형 추천을 받아보세요.</p>
          <button type="button">무료로 시작하기 →</button>
        </div>
      </section>

      <footer className="footer">
        <div className="brand">
          <span className="brand-logo">🧭</span>
          <span>AI 여행 플래너</span>
        </div>
        <div className="footer-links">
          <button type="button">이용약관</button>
          <button type="button">개인정보처리방침</button>
          <button type="button">고객센터</button>
        </div>
        <small>© 2024 AI 여행 플래너. All rights reserved.</small>
      </footer>
    </main>
  );
}
