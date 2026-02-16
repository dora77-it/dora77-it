# 무료 Whisk 자동화 크롬 확장 (MVP)

## 1) 설치
1. Chrome 주소창에 `chrome://extensions` 입력
2. 우측 상단 **개발자 모드** ON
3. **압축해제된 확장 프로그램 로드** 클릭
4. 이 폴더(`extension/`) 선택

## 2) 사용
1. Whisk 페이지(`https://labs.google/fx/tools/whisk`)를 연다
2. 확장 팝업에서 프롬프트 입력 (한 줄 1개)
3. 필요하면 고급 셀렉터 설정 수정
4. **시작** 클릭

## 3) 무료로 가능한 이유
- Chrome 확장 개발 자체는 무료
- Node/Playwright도 무료
- 유료 API 서버 없이 브라우저 자동화 방식으로 동작

## 4) 주의
- Whisk UI가 바뀌면 셀렉터를 조정해야 함
- 서비스 약관을 준수해야 함


## 5) `not found` 오류가 뜰 때
가장 흔한 원인은 셀렉터 불일치입니다.

- 기본 생성 버튼 셀렉터를 `button[type='submit']`로 바꿨습니다.
- 그래도 안 되면 Whisk 화면에서 개발자도구(F12)로 버튼/입력창 셀렉터를 확인해 넣어주세요.
- 현재 버전은 생성 버튼 텍스트(`Generate`, `Create`, `Run`, `생성`) 자동 탐색 폴백도 포함합니다.


## 6) "이걸 가지고 가서" 바로 쓰기
- 전달 대상: `extension/` 폴더 전체
- 설치 경로: `chrome://extensions` -> 개발자 모드 ON -> 압축해제 로드
- 처음엔 프롬프트 1~3개로 테스트 후 점진적으로 늘리세요.

자세한 인계 절차: `docs/HOW_TO_TAKE_AND_USE_KO.md`
