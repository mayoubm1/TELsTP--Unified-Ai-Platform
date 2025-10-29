// api/index.ts
// Corrected Supabase Edge Function using Deno.serve and standard Request typing.
// - Fixes TS errors: properties accessed on untyped objects
// - Ensures header check for "Pmo-Lxg-Omni"
// - Minimal dependencies (Web APIs only)
Deno.serve(async (req)=>{
  try {
    // Ensure we only accept POST (or allow other methods if desired)
    const method = req.method;
    if (method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Header check: exact header name required by your flow
    const headerName = 'Pmo-Lxg-Omni';
    const omniHeader = req.headers.get(headerName);
    if (!omniHeader) {
      return new Response(JSON.stringify({
        error: `Missing required header: ${headerName}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Parse JSON safely and type-check expected fields
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(JSON.stringify({
        error: 'Invalid JSON body'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const parsed = body;
    // Validate existence and type of clientAuth if required
    if (!parsed.clientAuth || typeof parsed.clientAuth !== 'string') {
      return new Response(JSON.stringify({
        error: 'Missing or invalid clientAuth in request body'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Example: if you need to inspect additional headers or method, they are available:
    // const contentType = req.headers.get('content-type');
    // Example business logic placeholder:
    // - Use parsed.clientAuth and omniHeader to authenticate/authorize
    // - Call Supabase REST or other services as necessary using SUPABASE_SERVICE_ROLE_KEY
    // Replace the following with your real logic:
    const result = {
      ok: true,
      message: 'Request validated',
      headerReceived: omniHeader,
      clientAuth: parsed.clientAuth
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    });
  } catch (err) {
    // Generic fallback error
    console.error('Unhandled error in function:', err);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
