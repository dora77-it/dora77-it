# 고든테의 AI 캐비닛 운영 가이드

## 1) 사이트 배포
정적 사이트이므로 아래 중 하나로 바로 배포할 수 있습니다.

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

기본 파일:
- `index.html`
- `styles.css`
- `script.js`
- `data/contests.json`

`script.js`는 `data/contests.json`를 읽어 화면을 렌더링합니다.

---

## 2) 핵심: "업데이트/소개글" 수동 작업 없이 자동 운영
이 저장소는 이제 기본적으로 **자동수집 모드**로 동작합니다.

- `scripts/sync-notion-to-json.mjs`가 Google News RSS + Kaggle RSS를 주기적으로 수집
- 공모전 성격 키워드를 필터링해 `data/contests.json` 갱신
- `note(간략 소개글)`이 비어 있으면 자동으로 생성
- GitHub Actions가 6시간마다 실행 후 변경 시 자동 커밋
- GitHub Pages 배포와 연결되어 있으면 사이트도 자동 업데이트

즉, **사용자가 공모전 데이터나 소개글을 매번 직접 작성하지 않아도 돌아가게 설계**되어 있습니다.

---

## 3) Notion은 선택사항
원하면 Notion DB를 함께 붙일 수 있고, 없어도 동작합니다.

### Notion 사용 시 필요한 Secrets
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

Secrets가 있으면:
1. Notion 데이터 동기화
2. 웹 자동수집 데이터 추가 병합

Secrets가 없으면:
- 웹 자동수집만으로 동작

---

## 4) 공개 배포 (GitHub Pages)
워크플로우 `.github/workflows/deploy-pages.yml`가 이미 포함되어 있습니다.

### 최초 1회
1. GitHub 저장소 → **Settings → Pages**
2. **Build and deployment** 를 `GitHub Actions`로 선택
3. 브랜치(`work`, `main`, `master`)에 push

### 이후
- 6시간마다 자동 데이터 동기화
- 데이터 변경 커밋 발생 시 자동 재배포

---

## 5) 로컬 실행/테스트
동기화 실행:

```bash
node scripts/sync-notion-to-json.mjs
```

로컬 미리보기:

```bash
python3 -m http.server 4173
```

---

## 6) 운영 팁
- 자동수집 데이터 특성상 일부 항목의 마감일/상금이 비어 있을 수 있습니다.
- 중요한 공모전만 수동 고정하고 싶다면, Notion을 함께 쓰는 하이브리드 모드가 가장 안정적입니다.
- 수집 품질을 높이고 싶다면 `CONTEST_QUERIES` 키워드를 프로젝트 성격에 맞게 조정하세요.
