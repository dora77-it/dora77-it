const $ = (id) => document.getElementById(id);
const statusEl = $("status");

const defaultConfig = {
  inputSelector: "textarea",
  generateSelector: "button[type='submit']",
  imageSelector: "img",
  timeoutMs: 120000,
  delayMs: 1500
};

async function loadConfig() {
  const data = await chrome.storage.local.get({ config: defaultConfig });
  const cfg = { ...defaultConfig, ...(data.config || {}) };
  $("inputSelector").value = cfg.inputSelector;
  $("generateSelector").value = cfg.generateSelector;
  $("imageSelector").value = cfg.imageSelector;
  $("timeoutMs").value = cfg.timeoutMs;
  $("delayMs").value = cfg.delayMs;
}

function readConfig() {
  return {
    inputSelector: $("inputSelector").value.trim(),
    generateSelector: $("generateSelector").value.trim(),
    imageSelector: $("imageSelector").value.trim(),
    timeoutMs: Number($("timeoutMs").value || 120000),
    delayMs: Number($("delayMs").value || 1500)
  };
}

function parsePrompts() {
  return $("prompts").value.split("\n").map((s) => s.trim()).filter(Boolean);
}

async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab?.id;
}

$("save").addEventListener("click", async () => {
  const config = readConfig();
  await chrome.storage.local.set({ config });
  statusEl.textContent = "설정 저장 완료";
});

$("start").addEventListener("click", async () => {
  const prompts = parsePrompts();
  if (!prompts.length) {
    statusEl.textContent = "프롬프트를 1개 이상 입력하세요.";
    return;
  }
  const config = readConfig();
  await chrome.storage.local.set({ config });
  const tabId = await getActiveTabId();
  if (!tabId) {
    statusEl.textContent = "활성 탭을 찾을 수 없습니다.";
    return;
  }
  chrome.runtime.sendMessage({ type: "START_QUEUE", payload: { tabId, prompts, config } });
  statusEl.textContent = `시작: ${prompts.length}개`;
});

$("stop").addEventListener("click", async () => {
  chrome.runtime.sendMessage({ type: "STOP_QUEUE" });
  statusEl.textContent = "중지 요청 보냄";
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "STATUS") {
    statusEl.textContent = message.text;
  }
});

loadConfig();
