let running = false;
let stopRequested = false;

function notify(text) {
  chrome.runtime.sendMessage({ type: "STATUS", text }).catch(() => {});
}

function safeName(prompt, index) {
  const base = prompt.replace(/[^a-zA-Z0-9가-힣_-]+/g, "_").slice(0, 50) || `prompt_${index}`;
  return `${String(index + 1).padStart(3, "0")}_${base}.png`;
}

async function downloadImage(url, filename) {
  await chrome.downloads.download({ url, filename, saveAs: false, conflictAction: "uniquify" });
}

async function runPrompt(tabId, prompt, config, index) {
  const result = await chrome.tabs.sendMessage(tabId, {
    type: "RUN_PROMPT",
    payload: { prompt, config }
  });

  if (!result?.ok || !result?.imageUrl) {
    throw new Error(result?.error || "이미지 URL을 찾지 못했습니다.");
  }

  await downloadImage(result.imageUrl, safeName(prompt, index));
}

async function runQueue({ tabId, prompts, config }) {
  running = true;
  stopRequested = false;
  let okCount = 0;
  let failCount = 0;

  for (let i = 0; i < prompts.length; i += 1) {
    if (stopRequested) break;
    const prompt = prompts[i];
    notify(`[${i + 1}/${prompts.length}] 실행 중...`);

    try {
      await runPrompt(tabId, prompt, config, i);
      okCount += 1;
      notify(`[${i + 1}/${prompts.length}] 저장 완료`);
    } catch (error) {
      failCount += 1;
      notify(`[${i + 1}/${prompts.length}] 실패: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, config.delayMs || 1500));
  }

  running = false;
  notify(`완료: 성공 ${okCount}, 실패 ${failCount}${stopRequested ? " (중지됨)" : ""}`);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "START_QUEUE") {
    if (running) {
      notify("이미 실행 중입니다.");
      return;
    }
    runQueue(message.payload).catch((e) => {
      running = false;
      notify(`오류: ${e.message}`);
    });
  }

  if (message?.type === "STOP_QUEUE") {
    stopRequested = true;
    notify("중지 요청 수신");
  }
});
