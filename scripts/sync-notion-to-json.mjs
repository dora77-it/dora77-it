import { writeFile } from "node:fs/promises";

const NOTION_API = "https://api.notion.com/v1/databases";
const notionToken = process.env.NOTION_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;


const seedContests = [
  {
    name: "메디힐 AI 영상 공모전",
    host: "메디힐",
    type: "AI 영상",
    category: "광고·브랜디드",
    status: "모집중",
    startDate: "",
    deadline: "",
    region: "한국",
    language: "한국어",
    reward: "공식 요강 참고",
    format: "영상",
    target: "일반인",
    tags: ["#자동생성", "#AI영상"],
    note: "메디힐에서 진행하는 AI 영상 공모전입니다. 접수 일정과 제출 규격은 공식 페이지에서 확인하세요.",
    link: "https://example.com/mediheal-ai"
  },
  {
    name: "무쏘맨 AI AWARDS",
    host: "KGM",
    type: "AI 영상",
    category: "광고·브랜디드",
    status: "모집중",
    startDate: "",
    deadline: "",
    region: "한국",
    language: "한국어",
    reward: "공식 요강 참고",
    format: "영상",
    target: "일반인",
    tags: ["#자동생성", "#브랜디드"],
    note: "브랜드 테마 기반 AI 영상 어워즈입니다. 공모 요강, 제출 링크, 일정은 주최 측 공지를 확인하세요.",
    link: "https://example.com/mussoman-awards"
  },
  {
    name: "Kaggle AI Competition",
    host: "Kaggle",
    type: "AI 모델·데이터",
    category: "데이터·모델",
    status: "모집중",
    startDate: "",
    deadline: "",
    region: "글로벌",
    language: "영어",
    reward: "Prize 및 랭킹",
    format: "모델/코드/리포트",
    target: "개발자/리서처",
    tags: ["#자동생성", "#Kaggle"],
    note: "Kaggle에서 수시로 열리는 AI 대회 목록입니다. 상세 조건은 대회 페이지에서 확인하세요.",
    link: "https://www.kaggle.com/competitions"
  }
];

const CONTEST_QUERIES = [
  "AI 공모전",
  "AI 영상 공모전",
  "AI 영화제",
  "AI competition",
  "AI awards"
];

function getText(prop) {
  if (!prop) return "";
  if (prop.type === "title") return prop.title?.[0]?.plain_text ?? "";
  if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text ?? "";
  if (prop.type === "url") return prop.url ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "multi_select") return prop.multi_select?.map((x) => x.name) ?? [];
  if (prop.type === "date") return prop.date?.start ?? "";
  return "";
}

function parseDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function calcStatus(deadline, rawStatus) {
  if (rawStatus === "마감") return "마감";
  const d = parseDate(deadline);
  if (!d) return rawStatus || "모집중";

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "마감";
  if (diff <= 7) return "마감 임박";
  return rawStatus || "모집중";
}

function inferType(title = "") {
  const t = title.toLowerCase();
  if (/(영상|film|movie|shorts?|video)/i.test(t)) return "AI 영상";
  if (/(이미지|image|photo|poster|art)/i.test(t)) return "AI 이미지";
  if (/(model|dataset|kaggle|ml|machine learning|데이터)/i.test(t)) return "AI 모델·데이터";
  return "AI 공모전";
}

function inferCategory(title = "") {
  if (/(광고|브랜디드|brand)/i.test(title)) return "광고·브랜디드";
  if (/(영화|film|movie)/i.test(title)) return "영상·영화";
  if (/(데이터|model|kaggle|ml)/i.test(title)) return "데이터·모델";
  return "일반";
}

function inferRegion(text = "") {
  if (/(korea|한국|seoul|부산|대구|인천)/i.test(text)) return "한국";
  if (/(asia|아시아|japan|china|singapore)/i.test(text)) return "아시아";
  if (/(europe|eu|germany|france|uk)/i.test(text)) return "유럽";
  if (/(usa|north america|canada)/i.test(text)) return "북미";
  return "글로벌";
}

function stripTags(text = "") {
  return text.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

function firstMatch(text, regex) {
  const m = text.match(regex);
  return m?.[1] ?? "";
}

function parseRssItems(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => ({
    title: stripTags(firstMatch(item, /<title>([\s\S]*?)<\/title>/i)),
    link: stripTags(firstMatch(item, /<link>([\s\S]*?)<\/link>/i)),
    pubDate: stripTags(firstMatch(item, /<pubDate>([\s\S]*?)<\/pubDate>/i)),
    source: stripTags(firstMatch(item, /<source[^>]*>([\s\S]*?)<\/source>/i) || firstMatch(item, /<dc:creator>([\s\S]*?)<\/dc:creator>/i)),
    description: stripTags(firstMatch(item, /<description>([\s\S]*?)<\/description>/i))
  }));
}

function autoSummary(item) {
  const source = item.host || item.source || "공식 채널";
  const base = `${item.name} 관련 최신 안내가 ${source}에 게시되었습니다.`;
  const tip = `접수 일정·제출 형식·참가 조건을 공식 페이지에서 확인하세요.`;
  return `${base} ${tip}`;
}

function isContestLike(text = "") {
  return /(공모전|awards?|challenge|competition|contest|festival|hackathon)/i.test(text);
}

async function fetchGoogleNewsContests(query) {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const xml = await response.text();

    return parseRssItems(xml)
    .filter((item) => isContestLike(`${item.title} ${item.description}`))
    .slice(0, 20)
    .map((item) => {
      const name = item.title.replace(/\s+-\s+[^-]+$/, "").trim();
      const host = item.source || "미확인";
      const language = /[가-힣]/.test(name) ? "한국어" : "영어";
      return {
        name,
        host,
        type: inferType(name),
        category: inferCategory(name),
        status: "모집중",
        startDate: "",
        deadline: "",
        region: inferRegion(`${name} ${host}`),
        language,
        reward: "공식 페이지 참고",
        format: "공모 요강 참고",
        target: "요강 참고",
        tags: ["#자동수집", "#AI공모전"],
        note: autoSummary({ name, host }),
        link: item.link
      };
    });
  } catch (_error) {
    return [];
  }
}

async function fetchKaggleRss() {
  try {
    const response = await fetch("https://www.kaggle.com/competitions.rss");
    if (!response.ok) return [];
    const xml = await response.text();
    return parseRssItems(xml).slice(0, 20).map((item) => ({
    name: item.title,
    host: "Kaggle",
    type: "AI 모델·데이터",
    category: "데이터·모델",
    status: "모집중",
    startDate: "",
    deadline: "",
    region: "글로벌",
    language: "영어",
    reward: "Kaggle 공지 참고",
    format: "모델/코드/리포트",
    target: "개발자/리서처",
    tags: ["#Kaggle", "#자동수집"],
    note: autoSummary({ name: item.title, host: "Kaggle" }),
    link: item.link
  }));
  } catch (_error) {
    return [];
  }
}

function dedupeContests(items) {
  const map = new Map();
  for (const item of items) {
    const key = String(item.name || "").toLowerCase().trim();
    if (!key) continue;
    if (!map.has(key)) map.set(key, item);
  }
  return [...map.values()];
}

async function queryAllNotionPages() {
  let hasMore = true;
  let cursor;
  const results = [];

  while (hasMore) {
    const response = await fetch(`${NOTION_API}/${notionDatabaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ page_size: 100, start_cursor: cursor })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Notion query failed: ${text}`);
    }

    const data = await response.json();
    results.push(...data.results);
    hasMore = data.has_more;
    cursor = data.next_cursor;
  }

  return results;
}

async function syncFromNotion() {
  const pages = await queryAllNotionPages();
  return pages.map((page) => {
    const p = page.properties;
    const rawStatus = getText(p["모집 상태"]);
    const deadline = getText(p["마감일"]);
    const name = getText(p["이름"]);
    const host = getText(p["주최"]);

    return {
      name,
      host,
      type: getText(p["공모전 유형"]) || inferType(name),
      category: getText(p["카테고리"]) || inferCategory(name),
      status: calcStatus(deadline, rawStatus),
      startDate: getText(p["접수 시작일"]),
      deadline,
      region: getText(p["국가·지역"]) || inferRegion(`${name} ${host}`),
      language: getText(p["언어"]),
      reward: getText(p["상금·혜택"]),
      format: getText(p["출품 형식"]),
      target: getText(p["대상"]),
      tags: getText(p["키워드 태그"]),
      note: getText(p["비고/메모"]) || autoSummary({ name, host }),
      link: getText(p["링크"])
    };
  });
}

async function syncFromWeb() {
  const sets = await Promise.all([
    ...CONTEST_QUERIES.map((q) => fetchGoogleNewsContests(q)),
    fetchKaggleRss()
  ]);
  return dedupeContests(sets.flat());
}

let contests = [];

if (notionToken && notionDatabaseId) {
  try {
    const notionContests = await syncFromNotion();
    const autoContests = await syncFromWeb();
    contests = dedupeContests([...notionContests, ...autoContests]);
    console.log(`Notion ${notionContests.length}건 + 웹 자동수집 ${autoContests.length}건`);
  } catch (error) {
    console.warn(`Notion 동기화 실패, 자동수집 모드로 전환: ${error.message}`);
    contests = await syncFromWeb();
  }
} else {
  console.log("NOTION_TOKEN/NOTION_DATABASE_ID 없음: 자동수집 모드로 실행");
  contests = await syncFromWeb();
}

if (!contests.length) {
  contests = seedContests;
  console.log("네트워크/외부 API 제한으로 seed 데이터 사용");
}

await writeFile("data/contests.json", JSON.stringify(contests, null, 2) + "\n", "utf8");
console.log(`Synced ${contests.length} contests to data/contests.json`);
