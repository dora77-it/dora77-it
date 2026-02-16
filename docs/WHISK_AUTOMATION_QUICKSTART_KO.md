# Whisk 자동화 실전 가이드 (빠른 시작)

## 한 줄 요약
Whisk 자동화는 **프롬프트 입력 → 생성 클릭 → 결과 감지 → 이미지 저장 → 다음 프롬프트 반복**을 코드로 돌리는 것입니다.

---

## 1) 가장 저렴한 시작 방식 (추천)
### Node.js + Playwright CLI
- 비용: 무료
- 장점: 빠른 MVP, 확장 프로그램 없이 가능
- 준비물:
  - Node.js 18+
  - npm

### 설치
```bash
npm init -y
npm i playwright
npx playwright install chromium
```

---

## 2) 자동화 기본 흐름
1. `prompts.txt` 읽기
2. Whisk 페이지 열기
3. 프롬프트 입력창에 값 입력
4. 생성 버튼 클릭
5. 결과 이미지가 나타날 때까지 대기
6. 이미지 URL 수집 후 저장
7. 다음 프롬프트 반복

---

## 3) 최소 동작 코드 (개념 예시)
```js
// run-whisk.js
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const prompts = fs.readFileSync('prompts.txt', 'utf8')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://labs.google/fx/tools/whisk', { waitUntil: 'domcontentloaded' });

  // TODO: 로그인 필요 시 수동 로그인 1회

  for (const prompt of prompts) {
    // TODO: 실제 Whisk 셀렉터로 교체
    await page.fill('textarea', prompt);
    await page.click('button:has-text("Generate")');

    // 결과가 뜰 때까지 대기 (셀렉터는 실제 DOM에 맞게 교체)
    await page.waitForSelector('img', { timeout: 120000 });

    const imageUrl = await page.locator('img').first().getAttribute('src');
    if (imageUrl) {
      const safe = prompt.replace(/[^a-zA-Z0-9가-힣_-]+/g, '_').slice(0, 50);
      const res = await page.request.get(imageUrl);
      fs.writeFileSync(`output/${safe}.png`, Buffer.from(await res.body()));
      console.log('saved:', safe);
    }

    await page.waitForTimeout(1500); // 과도 요청 방지
  }

  await browser.close();
})();
```

---

## 4) 실행 방법
```bash
mkdir -p output
node run-whisk.js
```

---

## 5) 왜 실패할 수 있나?
- Whisk UI가 바뀌어 셀렉터가 달라진 경우
- 로그인 세션 만료
- 네트워크 지연/타임아웃

### 안정화 팁
- 셀렉터를 상수 파일로 분리
- 프롬프트 단위 재시도 1~2회
- 타임아웃(예: 90~120초) 설정
- 실패 로그(JSON/CSV) 남기기

---

## 6) 크롬 확장이 꼭 필요한 경우
아래 조건이면 확장이 유리합니다.
- 브라우저 안에서 버튼형 UI가 꼭 필요함
- 일반 사용자에게 설치형 UX 제공 필요

그 외에는 Playwright CLI만으로도 충분히 실사용 자동화를 만들 수 있습니다.
