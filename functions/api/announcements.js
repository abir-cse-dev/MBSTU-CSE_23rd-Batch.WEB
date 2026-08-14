// functions/api/announcements.js

export async function onRequestGet(context) {
  const data = await context.env.NOTICES.get("latest_notices");
  const notices = data ? JSON.parse(data) : [];
  return Response.json(notices);
}

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { title, text, author, isUrgent, adminPassword } = body;

  // Checks secret environment variable set in Cloudflare dashboard
  if (adminPassword !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const data = await context.env.NOTICES.get("latest_notices");
  let notices = data ? JSON.parse(data) : [];

  const newNotice = {
    id: Date.now(),
    title,
    text,
    author: author || "Class Representative",
    isUrgent: Boolean(isUrgent),
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  notices.unshift(newNotice);
  await context.env.NOTICES.put("latest_notices", JSON.stringify(notices));

  return Response.json({ success: true, notice: newNotice });
}

export async function onRequestDelete(context) {
  const body = await context.request.json();
  const { id, adminPassword } = body;

  if (adminPassword !== context.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const data = await context.env.NOTICES.get("latest_notices");
  let notices = data ? JSON.parse(data) : [];
  notices = notices.filter((n) => n.id !== id);

  await context.env.NOTICES.put("latest_notices", JSON.stringify(notices));
  return Response.json({ success: true });
}
