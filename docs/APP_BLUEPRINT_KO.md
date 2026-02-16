# Gordonte's AI Cabinet / 고든테의 AI 캐비넷 — 앱 설계서

## 0) 브랜드 고정값
- 제품명(고정): **Gordonte's AI Cabinet / 고든테의 AI 캐비넷**
- 로고(고정): **o_r**
- 원칙: 모든 화면(타이틀바/온보딩/설정/문서)에서 동일 표기 사용

---

## 1) 제품 목표
레퍼런스 화면처럼, 사용자가 실행 모드(버전)를 선택하고 Whisk 이미지 생성을 자동화할 수 있는 앱을 만든다.

- 핵심 목표: **적은 비용으로 시작 가능한 자동화 앱**
- 우선 가치: 단순한 UI, 실패 복구, 다운로드 안정성

---

## 2) 타깃 사용자
- 반복 프롬프트를 많이 돌리는 1인 크리에이터
- 크롬 확장 개발 경험이 없지만 자동화가 필요한 사용자
- 예산이 제한되어 무료/저비용 스택이 필요한 사용자

---

## 3) 화면 구조 (레퍼런스 반영)
### A. 상단
- 앱 타이틀 + 로고
- 언어 선택 드롭다운: 한국어 / English / 日本語

### B. 중앙 카드 영역 (모드 선택)
1. **API 모드 (권장)**
   - 고속 실행, 백그라운드 처리 중심
   - 커스텀 이미지 개수, 파일명 규칙 지원
2. **DOM 모드 (폴백)**
   - 브라우저 클릭/입력 자동화
   - API 모드 실패 시 대체 사용
3. **Standalone 모드 (선택)**
   - 브라우저 확장 없이 별도 앱/스크립트로 동작
   - 예산에 맞춰 단계적으로 도입

### C. 하단 액션
- User Guide
- 후원 링크 (선택)

---


## 3.5) 자동화 엔진 동작 순서
1. 프롬프트 로드 (`textarea` / `.txt`)
2. 큐 생성 (대기/실행/완료/실패 상태)
3. 생성 요청 (입력 + 생성 버튼 트리거)
4. 결과 감지 (DOM 변화/네트워크 완료/이미지 렌더 확인)
5. 저장 처리 (자동 다운로드 + 파일명 규칙)
6. 예외 처리 (타임아웃/에러 재시도 + 로그 기록)

> 핵심은 “작업 상태 머신”입니다. 각 프롬프트가 `queued -> running -> success/fail`로 이동하도록 설계하면 안정성이 크게 올라갑니다.

---

## 3.6) 확장 프로그램 외 실행 방식
- **CLI 실행기(Node + Playwright)**: 가장 저렴하고 빠른 시작
- **Electron 앱**: 일반 사용자 배포에 유리
- **백엔드 워커(선택)**: 대량 작업 시 서버 스케줄링 가능

## 3.7) 크롬 확장 아키텍처 (실체화 기준)
### 구성요소
- **Popup UI**: 프롬프트 입력, 시작/중지 버튼, 진행률 표시
- **Background(Service Worker)**: 작업 큐 상태 머신, 다운로드, 재시도 정책
- **Content Script**: Whisk 페이지 DOM 조작(입력/클릭/결과 감지)

### 메시지 프로토콜 예시
- `START_QUEUE` : Popup -> Background
- `RUN_PROMPT` : Background -> Content
- `PROMPT_RESULT` : Content -> Background
- `STOP_QUEUE` : Popup -> Background

### 상태 머신
`queued -> running -> success | retrying | failed`

### manifest 핵심 권한
- `storage` (설정/로그 저장)
- `downloads` (이미지 파일 저장)
- `scripting` (content script 주입)
- `activeTab` 또는 대상 host permission

---

## 3.8) 최소 동작 의사코드
```text
for prompt in queue:
  try:
    runPromptInWhisk(prompt)
    images = collectResultImages()
    download(images)
    markSuccess(prompt)
  except Error as e:
    if retryCount < 1:
      retry(prompt)
    else:
      markFailed(prompt, e)
```

위 의사코드만 정확히 구현해도 1차 실사용 버전이 됩니다.

---

## 3.9) 플랫폼 선택 가이드 (확장 필수 아님)
| 조건 | 추천 |
|---|---|
| 비용 최소 + 빠른 MVP | **Node.js + Playwright CLI** |
| 브라우저 내부 UI 필요 | **Chrome Extension (MV3)** |
| 설치형 앱 배포 필요 | **Electron** |

### 권장 전략
1. Playwright CLI로 자동화 엔진 먼저 완성
2. 이후 UI를 붙일 때 Extension 또는 Electron 선택
3. 공통 엔진(큐/재시도/로그)은 재사용

---

## 4) 기능 명세 (MVP)
### 필수
- 프롬프트 입력(멀티라인)
- `.txt` 불러오기
- 큐 순차 실행(시작/일시정지/중지)
- 자동 다운로드
- 실패 재시도(최대 N회)
- 실행 로그(성공/실패/시간)

### 선택
- 참조 이미지(Subject/Scene/Style)
- 파일명 템플릿
- 이미지 비율 및 생성 수 조절

---

## 5) 저비용 기술 스택 (추천)
### 옵션 1: 웹앱 + Playwright (무료 중심)
- UI: React + Vite + Tailwind
- 자동화 엔진: Node.js + Playwright
- 저장: 로컬 파일(JSON/SQLite)
- 장점: 무료/문서 풍부/확장 쉬움

### 옵션 2: Electron 단일 앱 (저비용)
- UI + 자동화 엔진을 데스크톱 앱으로 통합
- 브라우저 확장 없이 동작하는 사용자 경험 제공 가능

---

## 6) 개발 순서 (2주 MVP 예시)
### 1주차
- Day 1~2: UI 틀(언어 선택 + 모드 카드 + 실행 패널)
- Day 3~4: 프롬프트 큐/로그 로직
- Day 5~7: Playwright 기본 자동화(입력→실행→저장)

### 2주차
- Day 8~9: 실패 재시도/타임아웃 처리
- Day 10~11: DOM 폴백 모드
- Day 12~13: 설정 저장/불러오기
- Day 14: 배포 문서 + 사용자 가이드

---

## 7) 운영 체크리스트
- 과도한 요청 방지를 위한 속도 제한
- 서비스 약관 준수
- 실패 케이스 샘플 수집 및 회귀 테스트
- UI 변경(셀렉터 변경) 감지 시 핫픽스 가능 구조 유지

---

## 8) 바로 시작용 최소 TODO
1. `prompts.txt` 업로드 + 큐 리스트 표시
2. Start/Stop 버튼 동작
3. Playwright로 Whisk 페이지 열기
4. 프롬프트 1개 입력/실행/결과 감지
5. 이미지 다운로드 및 파일명 저장
6. 실패 시 1회 재시도

이 6가지만 먼저 완성하면 “돈 적게 들이는 실사용 가능한 1차 버전”이 됩니다.
