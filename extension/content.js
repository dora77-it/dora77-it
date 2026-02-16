function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidCssSelector(selector) {
  if (!selector) return false;
  try {
    document.querySelector(selector);
    return true;
  } catch {
    return false;
  }
}

function findGenerateButton(selector) {
  if (isValidCssSelector(selector)) {
    const el = document.querySelector(selector);
    if (el) return el;
  }

  const candidates = Array.from(document.querySelectorAll("button, [role='button']"));
  const keywords = ["generate", "create", "run", "생성"];
  return candidates.find((el) => {
    const text = (el.textContent || "").toLowerCase().trim();
    return keywords.some((k) => text.includes(k));
  });
}

function pickBestImage(imageSelector) {
  const selectors = [];
  if (isValidCssSelector(imageSelector)) selectors.push(imageSelector);
  selectors.push("main img", "img");

  for (const sel of selectors) {
    const imgs = Array.from(document.querySelectorAll(sel));
    const found = imgs
      .map((img) => img.getAttribute("src"))
      .find((src) => src && /^https?:/.test(src) && !src.includes("data:image"));
    if (found) return found;
  }
  return null;
}

async function waitForImage(imageSelector, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const src = pickBestImage(imageSelector);
    if (src) return src;
    await wait(700);
  }
  throw new Error("결과 이미지 대기 타임아웃");
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "RUN_PROMPT") return;

  (async () => {
    const { prompt, config } = message.payload;
    const inputSelector = config.inputSelector || "textarea";
    const inputEl = isValidCssSelector(inputSelector) ? document.querySelector(inputSelector) : null;
    if (!inputEl) {
      throw new Error(`입력창을 찾지 못함: ${inputSelector}`);
    }

    inputEl.focus();
    inputEl.value = prompt;
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));

    const btn = findGenerateButton(config.generateSelector);
    if (!btn) {
      throw new Error(`생성 버튼을 찾지 못함: ${config.generateSelector || "(자동탐색 실패)"}`);
    }
    btn.click();

    const imageUrl = await waitForImage(config.imageSelector || "img", config.timeoutMs || 120000);
    sendResponse({ ok: true, imageUrl });
  })().catch((error) => {
    sendResponse({ ok: false, error: error.message || String(error) });
  });

  return true;
});
