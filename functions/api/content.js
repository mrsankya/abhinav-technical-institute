export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const db = env.DB || env.CERTS;
    if (db) {
      const row = await db.prepare('SELECT json_data FROM site_content WHERE key = ?')
        .bind('main')
        .first();
      if (row && row.json_data) {
        return new Response(row.json_data, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }
    }
  } catch (e) {}

  return new Response(JSON.stringify({}), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const db = env.DB || env.CERTS;
    const url = new URL(request.url);

    if (url.pathname.endsWith('/reset')) {
      if (db) {
        await db.prepare('DELETE FROM site_content WHERE key = ?').bind('main').run();
      }
      return new Response(JSON.stringify({ success: true, message: 'Content reset to default' }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const payload = await request.json();
    if (db && payload) {
      await db.prepare(
        'INSERT INTO site_content (key, json_data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET json_data = excluded.json_data, updated_at = CURRENT_TIMESTAMP'
      )
        .bind('main', JSON.stringify(payload))
        .run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Content saved in D1', content: payload }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
