const form = document.querySelector("#lead-form");
const statusEl = document.querySelector("#form-status");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "正在提交...";
  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("submit failed");
    form.reset();
    statusEl.textContent = "已收到。我们会尽快联系你。";
  } catch {
    const subject = encodeURIComponent("Power SKY 投资人联系");
    const body = encodeURIComponent(
      Object.entries(payload)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
    );
    statusEl.innerHTML =
      `当前托管未启用表单后端。<a href="mailto:investor@example.com?subject=${subject}&body=${body}">点击这里用邮件发送</a>，或部署 Cloudflare Pages Functions 后自动接收。</a>`;
  }
});
