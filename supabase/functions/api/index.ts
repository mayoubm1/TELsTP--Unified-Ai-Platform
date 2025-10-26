import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://vrfyjirddfdnwuffzqhb.supabase.co"
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split("/").filter(Boolean)

    // GET /functions/v1/api/health
    if (path[2] === "health" && req.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          service: "TELsTP OmniCognitor Backend",
          version: "1.0.0",
          deployedBy: "MMAC - Manus Mission Accomplished",
          infrastructure: "Supabase Edge Functions (100% Free)",
        }),
        { headers: corsHeaders }
      )
    }

    // GET /functions/v1/api/info
    if (path[2] === "info" && req.method === "GET") {
      return new Response(
        JSON.stringify({
          name: "TELsTP OmniCognitor Backend",
          version: "1.0.0",
          status: "running",
          database: "Supabase (PostgreSQL)",
          features: ["Multi-platform AI", "Workspace Management", "Message Chaining"],
          deployedBy: "MMAC - Manus Mission Accomplished",
          infrastructure: "Supabase Edge Functions (Zero Cost)",
          uptime: "100%",
        }),
        { headers: corsHeaders }
      )
    }

    // GET /functions/v1/api/stats
    if (path[2] === "stats" && req.method === "GET") {
      const tables = ["users", "platforms", "workspaces", "messages", "conversations"]
      const stats: any = {}

      for (const table of tables) {
        try {
          const { count } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true })

          stats[table] = count || 0
        } catch (e) {
          stats[table] = 0
        }
      }

      return new Response(JSON.stringify({ success: true, stats }), { headers: corsHeaders })
    }

    // GET /functions/v1/api/users
    if (path[2] === "users" && req.method === "GET") {
      const { data, error } = await supabase.from("users").select("*").limit(10)

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), { headers: corsHeaders })
    }

    // GET /functions/v1/api/platforms
    if (path[2] === "platforms" && req.method === "GET") {
      const { data, error } = await supabase.from("platforms").select("*").limit(20)

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), { headers: corsHeaders })
    }

    // GET /functions/v1/api/workspaces
    if (path[2] === "workspaces" && req.method === "GET") {
      const { data, error } = await supabase.from("workspaces").select("*").limit(20)

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), { headers: corsHeaders })
    }

    // GET /functions/v1/api/messages
    if (path[2] === "messages" && req.method === "GET") {
      const { data, error } = await supabase.from("messages").select("*").limit(50)

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), { headers: corsHeaders })
    }

    // POST /functions/v1/api/users
    if (path[2] === "users" && req.method === "POST") {
      const body = await req.json()
      const { username, email } = body

      if (!username) {
        return new Response(JSON.stringify({ error: "Username is required" }), {
          status: 400,
          headers: corsHeaders,
        })
      }

      const { data, error } = await supabase
        .from("users")
        .insert([{ username, email }])
        .select()

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), {
        status: 201,
        headers: corsHeaders,
      })
    }

    // POST /functions/v1/api/workspaces
    if (path[2] === "workspaces" && req.method === "POST") {
      const body = await req.json()
      const { name, description, ownerId, isPublic = false } = body

      if (!name || !ownerId) {
        return new Response(JSON.stringify({ error: "Name and ownerId are required" }), {
          status: 400,
          headers: corsHeaders,
        })
      }

      const { data, error } = await supabase
        .from("workspaces")
        .insert([{ name, description, owner_id: ownerId, is_public: isPublic }])
        .select()

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), {
        status: 201,
        headers: corsHeaders,
      })
    }

    // POST /functions/v1/api/messages
    if (path[2] === "messages" && req.method === "POST") {
      const body = await req.json()
      const { conversationId, content, type = "user", authorId } = body

      if (!conversationId || !content || !authorId) {
        return new Response(
          JSON.stringify({ error: "conversationId, content, and authorId are required" }),
          { status: 400, headers: corsHeaders }
        )
      }

      const { data, error } = await supabase
        .from("messages")
        .insert([{ conversation_id: conversationId, content, type, author_id: authorId }])
        .select()

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data }), {
        status: 201,
        headers: corsHeaders,
      })
    }

    // 404
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: corsHeaders,
    })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})

