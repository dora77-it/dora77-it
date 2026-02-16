# 다음 스텝 체크리스트 (지금 바로 실행)

질문: **"이제 뭐해?"**
답: 아래 순서대로 하면 오늘 안에 1차 동작까지 갈 수 있습니다.

---

## 0) 오늘 목표 (완료 기준)
- `prompts.txt` 3개로 테스트
- 자동으로 입력/생성/저장 1회 이상 성공
- 실패 로그 1개 이상 확인

---

## 1) 개발 폴더 만들기 (10분)
```bash
mkdir whisk-mvp && cd whisk-mvp
npm init -y
npm i playwright
npx playwright install chromium
mkdir -p output
```

---

## 2) 테스트용 프롬프트 파일 만들기 (5분)
`prompts.txt`
```txt
a cute duck in a cyberpunk city, cinematic lighting
minimalist coffee poster, flat design, pastel colors
futuristic bookstore interior, ultra detailed, wide angle
```

---

## 3) 자동화 스크립트 만들기 (20~30분)
- `docs/WHISK_AUTOMATION_QUICKSTART_KO.md`의 `run-whisk.js` 예시 복붙
- Whisk 실제 버튼/입력창 셀렉터로 교체

---

## 4) 첫 실행 (10분)
```bash
node run-whisk.js
```
- 처음 1회는 로그인 필요할 수 있음
- 이미지가 `output/`에 저장되면 1차 성공

---

## 5) 실패해도 정상 (디버깅 루틴)
1. 브라우저 개발자도구로 입력창/버튼 셀렉터 재확인
2. `waitForSelector` 타임아웃을 120s로 증가
3. 프롬프트 간 딜레이 1.5s → 3s로 조정
4. 실패 로그 남기기 (`prompt`, `error`, `time`)

---

## 6) 내일 할 일 (고도화)
- 재시도 1회 정책 추가
- 파일명 규칙 고도화 (프롬프트 + timestamp)
- 처리 상태 표시 (`queued/running/success/failed`)

---

## 7) 확장 프로그램은 언제?
다음 조건일 때만 진행하세요.
- 클릭형 UI가 꼭 필요
- 다른 사람에게 설치형으로 배포해야 함

그 전에는 **Playwright CLI**로 충분히 실사용 가능합니다.
