export async function onRequestPost({ request, env }) {
  const data = await request.json().catch(() => null);
  if (!data || !data.email || !data.name) {
    return Response.json({ ok: false, error: "name and email are required" }, { status: 400 });
  }

  const lead = {
    ...data,
    createdAt: new Date().toISOString(),
    source: "lv-power-investor-site",
  };

  if (env.LEADS) {
    const key = `lead:${lead.createdAt}:${crypto.randomUUID()}`;
    await env.LEADS.put(key, JSON.stringify(lead));
  }

  if (env.LEAD_WEBHOOK_URL) {
    await fetch(env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  }

  return Response.json({ ok: true });
}
