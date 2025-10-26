/**
 * Edge Function: api
 * Author: Pmo-Lxg-Omni
 *
 * Routes:
 *  - GET  /api/health
 *  - GET  /api/info
 *  - GET  /api/stats
 *  - GET  /api/users
 *  - POST /api/users
 *  - GET  /api/platforms
 *  - GET  /api/workspaces
 *  - POST /api/workspaces
 *  - GET  /api/messages
 *  - POST /api/messages
 *
 * Notes:
 *  - Uses SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (for writes).
 *  - For temporary testing, set ALLOW_PUBLIC_WRITE=true in your function's environment.
 *  - No external dependencies; uses fetch with Supabase REST API.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://vrfyjirddfdnwuffzqhb.supabase.co";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ALLOW_PUBLIC_WRITE = (Deno.env.get("ALLOW_PUBLIC_WRITE") ?? "false").toLowerCase() === "true";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

function jsonResponse(body: unknown, status = 200, headers = corsHeaders) {
  return new Response(JSON.stringify(body), { status, headers });
}

async function supabaseRest(path: string, opts: RequestInit = {}) {
  const url = SUPABASE_URL.replace(/\/+$/, "") + path;
  const headers = new Headers(opts.headers ?? {});
  if (SERVICE_ROLE_KEY) {
    headers.set("apikey", SERVICE_ROLE_KEY);
    headers.set("Authorization", `Bearer ${SERVICE_ROLE_KEY}`);
  }
  if (!headers.has("Content-Type") && opts.method && opts.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body, headers: res.headers };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const raw = url.pathname.split("/").filter(Boolean);
    const apiIndex = raw.indexOf("api");
    const path = apiIndex >= 0 ? raw.slice(apiIndex + 1) : raw;

    if (path.length === 0 && req.method === "GET") {
      return jsonResponse({
        message: "API root. Available: /api/health, /api/info, /api/stats, /api/users, /api/platforms, /api/workspaces, /api/messages",
      });
    }

    if (path[0] === "health" && req.method === "GET") {
      return jsonResponse({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "TELsTP OmniCognitor Backend",
        version: "1.0.0",
        deployedBy: "MMAC - Manus Mission Accomplished",
        infrastructure: "Supabase Edge Functions",
      });
    }

    if (path[0] === "info" && req.method === "GET") {
      return jsonResponse({
        name: "TELsTP OmniCognitor Backend",
        version: "1.0.0",
        status: "running",
        database: "Supabase (PostgreSQL)",
        features: ["Multi-platform AI", "Workspace Management", "Message Chaining"],
        deployedBy: "MMAC - Manus Mission Accomplished",
        infrastructure: "Supabase Edge Functions",
        uptime: "100%",
      });
    }

    if (path[0] === "stats" && req.method === "GET") {
      const tables = ["users", "platform", "projects", "messages", "conversation"];
      const stats: Record<string, number> = {};
      for (const table of tables) {
        try {
          const res = await supabaseRest(`/rest/v1/${table}?select=*&limit=1`);
          const countHeader = res.headers.get?.("content-range") || "";
          const match = countHeader.match(/\/(\d+)$/);
          stats[table] = match ? parseInt(match[1], 10) : (Array.isArray(res.body) ? res.body.length : 0);
        } catch {
          stats[table] = 0;
        }
      }
      return jsonResponse({ success: true, stats });
    }

    if (path[0] === "users" && req.method === "GET") {
      const res = await supabaseRest(`/rest/v1/users?select=*&limit=10`);
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body });
    }

    if (path[0] === "platforms" && req.method === "GET") {
      const res = await supabaseRest(`/rest/v1/platform?select=*&limit=20`);
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body });
    }

    if (path[0] === "workspaces" && req.method === "GET") {
      const res = await supabaseRest(`/rest/v1/projects?select=*&limit=20`);
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body });
    }

    if (path[0] === "messages" && req.method === "GET") {
      const res = await supabaseRest(`/rest/v1/messages?select=*&limit=50`);
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body });
    }

    if (path[0] === "users" && req.method === "POST") {
      if (!SERVICE_ROLE_KEY && !ALLOW_PUBLIC_WRITE) {
        return jsonResponse({ error: "Writes require SUPABASE_SERVICE_ROLE_KEY or enable ALLOW_PUBLIC_WRITE" }, 401);
      }
      const body = await req.json().catch(() => null);
      if (!body || !body.username) {
        return jsonResponse({ error: "Username is required" }, 400);
      }
      const payload = { username: body.username, email: body.email ?? null };
      const res = await supabaseRest(`/rest/v1/users`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body }, 201);
    }

    if (path[0] === "workspaces" && req.method === "POST") {
      if (!SERVICE_ROLE_KEY && !ALLOW_PUBLIC_WRITE) {
        return jsonResponse({ error: "Writes require SUPABASE_SERVICE_ROLE_KEY or enable ALLOW_PUBLIC_WRITE" }, 401);
      }
      const body = await req.json().catch(() => null);
      const name = body?.name;
      const ownerId = body?.ownerId;
      if (!name || !ownerId) return jsonResponse({ error: "Name and ownerId are required" }, 400);
      const payload = { name, description: body.description ?? null, owner_id: ownerId, is_public: !!body.isPublic };
      const res = await supabaseRest(`/rest/v1/projects`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body }, 201);
    }

    if (path[0] === "messages" && req.method === "POST") {
      if (!SERVICE_ROLE_KEY && !ALLOW_PUBLIC_WRITE) {
        return jsonResponse({ error: "Writes require SUPABASE_SERVICE_ROLE_KEY or enable ALLOW_PUBLIC_WRITE" }, 401);
      }
      const body = await req.json().catch(() => null);
      const conversationId = body?.conversationId;
      const content = body?.content;
      const authorId = body?.authorId;
      if (!conversationId || !content || !authorId) {
        return jsonResponse({ error: "conversationId, content, and authorId are required" }, 400);
      }
      const payload = { conversation_id: conversationId, content, author_id: authorId, type: body?.type ?? "user" };
      const res = await supabaseRest(`/rest/v1/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.status >= 400) return jsonResponse({ error: res.body }, res.status);
      return jsonResponse({ success: true, data: res.body }, 201);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    console.error("Function error:", err);
    return jsonResponse({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
