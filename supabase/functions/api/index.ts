// TELsTP OmniCognitor API - Supabase Edge Function
// Complete RESTful API for unified AI platform

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Helper function to create JSON response
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse URL and route
    const url = new URL(req.url);
    const path = url.pathname.replace('/functions/v1/api', '');
    const method = req.method;

    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return jsonResponse({
        success: true,
        message: 'TELsTP OmniCognitor API is running',
        timestamp: new Date().toISOString(),
      });
    }

    // API info endpoint
    if (path === '/info' && method === 'GET') {
      return jsonResponse({
        success: true,
        name: 'TELsTP OmniCognitor API',
        version: '1.0.0',
        description: 'Unified AI Platform - Backend API',
        endpoints: [
          'GET /health - Health check',
          'GET /info - API information',
          'GET /stats - Database statistics',
          'GET /users - List all users',
          'POST /users - Create new user',
          'GET /platforms - List all platforms',
          'POST /platforms - Create new platform',
          'GET /workspaces - List all workspaces',
          'POST /workspaces - Create new workspace',
          'GET /conversations - List all conversations',
          'POST /conversations - Create new conversation',
          'GET /messages - List all messages',
          'POST /messages - Create new message',
        ],
      });
    }

    // Statistics endpoint
    if (path === '/stats' && method === 'GET') {
      const [usersCount, platformsCount, workspacesCount, conversationsCount, messagesCount] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('platforms').select('*', { count: 'exact', head: true }),
        supabase.from('workspaces').select('*', { count: 'exact', head: true }),
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
      ]);

      return jsonResponse({
        success: true,
        stats: {
          users: usersCount.count || 0,
          platforms: platformsCount.count || 0,
          workspaces: workspacesCount.count || 0,
          conversations: conversationsCount.count || 0,
          messages: messagesCount.count || 0,
        },
      });
    }

    // Users endpoints
    if (path === '/users') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return jsonResponse({ success: true, data });
      }

      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('users')
          .insert(body)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse({ success: true, data }, 201);
      }
    }

    // Platforms endpoints
    if (path === '/platforms') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('platforms')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        return jsonResponse({ success: true, data });
      }

      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('platforms')
          .insert(body)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse({ success: true, data }, 201);
      }
    }

    // Workspaces endpoints
    if (path === '/workspaces') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return jsonResponse({ success: true, data });
      }

      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('workspaces')
          .insert(body)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse({ success: true, data }, 201);
      }
    }

    // Conversations endpoints
    if (path === '/conversations') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            workspace:workspaces(name),
            user:users(username, full_name),
            platform:platforms(name, type)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return jsonResponse({ success: true, data });
      }

      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('conversations')
          .insert(body)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse({ success: true, data }, 201);
      }
    }

    // Messages endpoints
    if (path === '/messages') {
      if (method === 'GET') {
        const conversationId = url.searchParams.get('conversation_id');
        let query = supabase
          .from('messages')
          .select(`
            *,
            user:users(username, full_name),
            platform:platforms(name, type)
          `)
          .order('created_at', { ascending: true });

        if (conversationId) {
          query = query.eq('conversation_id', conversationId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return jsonResponse({ success: true, data });
      }

      if (method === 'POST') {
        const body = await req.json();
        const { data, error } = await supabase
          .from('messages')
          .insert(body)
          .select()
          .single();

        if (error) throw error;
        return jsonResponse({ success: true, data }, 201);
      }
    }

    // 404 - Route not found
    return jsonResponse({
      success: false,
      error: 'Route not found',
      path,
      method,
    }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({
      success: false,
      error: error.message || 'Internal server error',
    }, 500);
  }
});
