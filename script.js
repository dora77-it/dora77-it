let contests = [];

const fallbackContests = [
  {
    name: "메디힐 AI 영상 공모전",
    host: "메디힐",
    type: "AI 영상",
    category: "광고·브랜디드",
    status: "모집중",
    startDate: "2026-02-01",
    deadline: "2026-02-15",
    region: "한국",
    language: "한국어",
    reward: "상금 2,500만 원",
    format: "영상",
    target: "일반인",
    tags: ["#영상공모전", "#브랜디드"],
    note: "메디힐 브랜드 주제 AI 숏폼 공모전",
    link: "https://example.com/mediheal"
  },
  {
    name: "무쏘맨 AI AWARDS",
    host: "KGM",
    type: "AI 영상",
    category: "광고·브랜디드",
    status: "마감 임박",
    startDate: "2026-02-01",
    deadline: "2026-02-18",
    region: "한국",
    language: "한국어",
    reward: "총 1,100만 원",
    format: "영상",
    target: "일반인",
    tags: ["#AI영상", "#자동차"],
    note: "브랜드 스토리텔링 중심 공모전",
    link: "https://example.com/mussoman"
  },
  {
    name: "Kaggle AI Competition",
    host: "Kaggle",
    type: "AI 모델·데이터",
    category: "데이터·모델",
    status: "모집중",
    startDate: "2026-02-05",
    deadline: "2026-02-28",
    region: "글로벌",
    language: "영어",
    reward: "Prize + 랭킹",
    format: "모델/코드/리포트",
    target: "개발자/리서처",
    tags: ["#Kaggle", "#ML"],
    note: "글로벌 AI 모델 대회",
    link: "https://www.kaggle.com"
  }
];

const tools = [
  { name: "Sora", type: "영상", free: "High Quality", description: "OpenAI 텍스트-비디오 변환", link: "https://openai.com/sora", color: "#000" },
  { name: "Runway Gen-3", type: "영상", free: "Editor", description: "영상 편집 및 생성", link: "https://runwayml.com", color: "#6d4aff" },
  { name: "Luma Dream Machine", type: "영상", free: "3D & Video", description: "고품질 3D/비디오 생성", link: "https://lumalabs.ai", color: "#17b75f" },
  { name: "Midjourney", type: "이미지", free: "Artistic", description: "이미지 생성 도구", link: "https://www.midjourney.com", color: "#2463eb" },
  { name: "DALL·E 3", type: "이미지", free: "Precise", description: "정확한 프롬프트 이미지 생성", link: "https://chatgpt.com", color: "#ff6a00" },
  { name: "Gemini", type: "기획", free: "무료", description: "기획/카피/리서치", link: "https://gemini.google.com", color: "#2563eb" },
  { name: "ChatGPT", type: "기획", free: "무료 플랜", description: "시놉시스/스크립트 작성", link: "https://chatgpt.com", color: "#111827" }
];

const el = {
  cards: document.getElementById("contestCards"),
  urgentCards: document.getElementById("urgentCards"),
  homeToolCards: document.getElementById("homeToolCards"),
  search: document.getElementById("searchInput"),
  status: document.getElementById("statusFilter"),
  type: document.getElementById("typeFilter"),
  toolSearch: document.getElementById("toolSearch"),
  toolFilters: document.querySelectorAll("[data-tool-filter]"),
  listBtn: document.getElementById("listViewBtn"),
  calBtn: document.getElementById("calendarViewBtn"),
  listPanel: document.getElementById("listPanel"),
  calPanel: document.getElementById("calendarPanel"),
  calGrid: document.getElementById("calendarGrid"),
  calTitle: document.getElementById("calendarTitle"),
  prevMonth: document.getElementById("prevMonthBtn"),
  todayBtn: document.getElementById("todayBtn"),
  nextMonth: document.getElementById("nextMonthBtn"),
  tools: document.getElementById("toolCards"),
  drawer: document.getElementById("detailDrawer"),
  detail: document.getElementById("detailContent"),
  closeDrawer: document.getElementById("closeDrawer"),
  topLinks: document.querySelectorAll(".top-link"),
  pages: {
    home: document.getElementById("homePage"),
    contests: document.getElementById("contestsPage"),
    tools: document.getElementById("toolsPage"),
    about: document.getElementById("aboutPage")
  }
};

let viewDate = new Date(2026, 1, 1);
let activeToolFilter = "all";
const validPages = ["home", "contests", "tools", "about"];

function getPageFromHash() {
  const page = window.location.hash.replace("#", "");
  return validPages.includes(page) ? page : "home";
}

function parseDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysDiff(deadline) {
  const d = parseDate(deadline);
  if (!d) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

function getDday(deadline) {
  const diff = daysDiff(deadline);
  if (diff === null) return "일정 미정";
  if (diff === 0) return "D-day";
  if (diff < 0) return `D+${Math.abs(diff)}`;
  return `D-${diff}`;
}

function effectiveStatus(contest) {
  const diff = daysDiff(contest.deadline);
  if (diff === null) return contest.status || "모집중";
  if (diff < 0) return "마감";
  if (diff <= 7) return "마감 임박";
  return contest.status || "모집중";
}

function statusClass(status) {
  if (status === "모집중") return "status-open";
  if (status === "마감 임박") return "status-soon";
  return "status-closed";
}

function filteredContests() {
  const q = el.search?.value?.trim().toLowerCase() || "";
  return contests.filter((c) => {
    const name = String(c.name || "").toLowerCase();
    const host = String(c.host || "").toLowerCase();
    const status = effectiveStatus(c);
    const okQ = !q || name.includes(q) || host.includes(q);
    const okS = (el.status?.value || "all") === "all" || status === el.status.value;
    const okT = (el.type?.value || "all") === "all" || c.type === el.type.value;
    return okQ && okS && okT;
  });
}

function cardTemplate(c, index) {
  const status = effectiveStatus(c);
  const tags = Array.isArray(c.tags) ? c.tags : [];
  return `<article class="card" data-index="${index}">
      <div class="card-top">
        <span class="badge ${statusClass(status)}">${getDday(c.deadline)}</span>
        <button class="bookmark" aria-label="북마크">🔖</button>
      </div>
      <h3>${c.name || "제목 없음"}</h3>
      <p class="host">${c.host || "주최 정보 없음"}</p>
      <div class="tag-row">${tags.slice(0, 2).map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      <span class="category">${c.category || "일반"}</span>
      <div class="footer-row"><span>🏆 ${c.reward || "혜택 미정"}</span><span>${status}</span></div>
    </article>`;
}

function bindCardEvents(scope, sourceList) {
  scope.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const idx = Number(card.dataset.index);
      openDrawer(sourceList[idx]);
    });
  });
}

function renderCards() {
  const list = filteredContests();
  if (!el.cards) return;
  if (!list.length) {
    el.cards.innerHTML = `<article class="card"><p>조건에 맞는 공모전이 없습니다.</p></article>`;
    return;
  }
  el.cards.innerHTML = list.map((c, i) => cardTemplate(c, i)).join("");
  bindCardEvents(el.cards, list);
}

function renderUrgentCards() {
  if (!el.urgentCards) return;
  const list = contests.filter((c) => {
    const d = daysDiff(c.deadline);
    return d !== null && d >= 0 && d <= 7;
  });
  const source = list.length ? list : contests.slice(0, 3);
  el.urgentCards.innerHTML = source.map((c, i) => cardTemplate(c, i)).join("");
  bindCardEvents(el.urgentCards, source);
}

function dayItems(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return contests.filter((c) => c.deadline === dateStr);
}

function renderCalendar() {
  if (!el.calGrid || !el.calTitle) return;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  el.calTitle.textContent = `${year}년 ${month + 1}월`;

  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  el.calGrid.innerHTML = "";

  for (let i = 0; i < first; i += 1) {
    el.calGrid.innerHTML += `<div class="day empty"><div class="day-num"></div></div>`;
  }

  for (let d = 1; d <= total; d += 1) {
    const items = dayItems(year, month, d);
    const mark = items.length ? `<div class="day-item">${items.length}개</div>` : "";
    el.calGrid.innerHTML += `<div class="day"><div class="day-num">${d}</div>${mark}</div>`;
  }
}

function toolCard(t, compact = false) {
  if (compact) {
    return `<article class="tool-card"><div class="tool-icon" style="background:${t.color}">${t.name.slice(0, 2)}</div><h4>${t.name}</h4><p>${t.description}</p></article>`;
  }
  return `<article class="tool"><div class="tool-icon" style="background:${t.color}">${t.name.slice(0, 2)}</div><div><h3>${t.name}</h3><p>${t.description}</p><small>${t.free}</small></div></article>`;
}

function renderHomeTools() {
  if (!el.homeToolCards) return;
  el.homeToolCards.innerHTML = tools.slice(0, 4).map((t) => toolCard(t, true)).join("");
}

function filteredTools() {
  const q = el.toolSearch?.value?.trim().toLowerCase() || "";
  return tools.filter((t) => {
    const byFilter = activeToolFilter === "all" || t.type === activeToolFilter;
    const text = `${t.name} ${t.description}`.toLowerCase();
    return byFilter && (!q || text.includes(q));
  });
}

function renderTools() {
  if (!el.tools) return;
  el.tools.innerHTML = filteredTools().map((t) => toolCard(t)).join("");
}

function openDrawer(contest) {
  const tags = Array.isArray(contest.tags) ? contest.tags : [];
  const status = effectiveStatus(contest);
  el.detail.innerHTML = `
    <div class="poster">${String(contest.name || "공모").slice(0, 2)}</div>
    <h3>${contest.name || "제목 없음"}</h3>
    <p>${contest.host || "주최 정보 없음"}</p>
    <p>${contest.note || "상세 설명 없음"}</p>
    <div class="tag-row">${tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
    <div class="meta-row"><span class="badge ${statusClass(status)}">${status}</span></div>
    <div class="detail-meta">
      <div class="detail-box"><strong>마감일</strong><br>${contest.deadline || "미정"}<br><span class="dday">${getDday(contest.deadline)}</span></div>
      <div class="detail-box"><strong>상금</strong><br>${contest.reward || "혜택 미정"}</div>
      <div class="detail-box"><strong>참가자격</strong><br>${contest.target || "제한 없음"}</div>
      <div class="detail-box"><strong>지역</strong><br>${contest.region || "미정"}</div>
    </div>
    <p><a href="${contest.link || "#"}" target="_blank" rel="noreferrer">공식 페이지 이동</a></p>
  `;
  el.drawer.classList.remove("hidden");
}

function closeDrawer() {
  el.drawer.classList.add("hidden");
}

function setView(type) {
  const isList = type === "list";
  el.listPanel.classList.toggle("hidden", !isList);
  el.calPanel.classList.toggle("hidden", isList);
  el.listBtn.classList.toggle("active", isList);
  el.calBtn.classList.toggle("active", !isList);
}

function setPage(page, updateHash = true) {
  const target = validPages.includes(page) ? page : "home";
  Object.entries(el.pages).forEach(([key, node]) => node.classList.toggle("active", key === target));
  el.topLinks.forEach((btn) => btn.classList.toggle("active", btn.dataset.page === target));
  if (updateHash) {
    window.location.hash = target;
  }
}

function normalizeContests(raw) {
  return raw.map((c) => ({ ...c, status: effectiveStatus(c) }));
}

async function loadContests() {
  try {
    const response = await fetch("./data/contests.json", { cache: "no-store" });
    if (!response.ok) throw new Error("load failed");
    const data = await response.json();
    const source = Array.isArray(data) && data.length ? data : fallbackContests;
    contests = normalizeContests(source);
  } catch (_error) {
    contests = normalizeContests(fallbackContests);
  }
}

async function init() {
  await loadContests();
  renderCards();
  renderUrgentCards();
  renderCalendar();
  renderTools();
  renderHomeTools();

  el.search?.addEventListener("input", renderCards);
  el.status?.addEventListener("change", renderCards);
  el.type?.addEventListener("change", renderCards);
  el.toolSearch?.addEventListener("input", renderTools);

  el.toolFilters.forEach((btn) => btn.addEventListener("click", () => {
    activeToolFilter = btn.dataset.toolFilter;
    el.toolFilters.forEach((item) => item.classList.toggle("active", item === btn));
    renderTools();
  }));

  el.listBtn?.addEventListener("click", () => setView("list"));
  el.calBtn?.addEventListener("click", () => setView("calendar"));
  el.prevMonth?.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });
  el.todayBtn?.addEventListener("click", () => {
    viewDate = new Date();
    renderCalendar();
  });
  el.nextMonth?.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  setPage(getPageFromHash(), false);

  el.topLinks.forEach((btn) => btn.addEventListener("click", () => setPage(btn.dataset.page)));
  window.addEventListener("hashchange", () => setPage(getPageFromHash(), false));

  document.querySelectorAll("[data-jump]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    setPage(a.dataset.jump);
  }));

  document.getElementById("focusUrgentBtn")?.addEventListener("click", () => {
    el.status.value = "마감 임박";
    setView("list");
    renderCards();
  });

  el.closeDrawer?.addEventListener("click", closeDrawer);
}

init();
