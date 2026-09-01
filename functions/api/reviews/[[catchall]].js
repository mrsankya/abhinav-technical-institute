async function ensureReviewsTable(db) {
  if (!db) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    course TEXT,
    rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    date TEXT,
    verified INTEGER DEFAULT 1,
    raw_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB || env.CERTS;

  try {
    if (db) {
      await ensureReviewsTable(db);
      const { results } = await db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
      if (results && results.length > 0) {
        const list = results.map(r => r.raw_json ? JSON.parse(r.raw_json) : {
          id: r.id,
          name: r.name,
          course: r.course,
          rating: r.rating,
          comment: r.comment,
          date: r.date,
          verified: r.verified === 1
        });
        return new Response(JSON.stringify(list), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }
  } catch (e) {}

  return new Response(JSON.stringify([]), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB || env.CERTS;

  try {
    const rev = await request.json();
    if (!rev || !rev.name || !rev.comment) {
      return new Response(JSON.stringify({ error: 'Name and comment required' }), { status: 400 });
    }

    const newRev = {
      id: rev.id || `rev-${Date.now()}`,
      name: rev.name,
      course: rev.course || 'Vocational Trade',
      rating: Number(rev.rating) || 5,
      comment: rev.comment,
      date: rev.date || new Date().toLocaleDateString('en-GB'),
      verified: rev.verified !== false,
    };

    if (db) {
      await ensureReviewsTable(db);
      await db.prepare(`
        INSERT INTO reviews (id, name, course, rating, comment, date, verified, raw_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          course = excluded.course,
          rating = excluded.rating,
          comment = excluded.comment,
          date = excluded.date,
          verified = excluded.verified,
          raw_json = excluded.raw_json
      `).bind(
        newRev.id,
        newRev.name,
        newRev.course,
        newRev.rating,
        newRev.comment,
        newRev.date,
        newRev.verified ? 1 : 0,
        JSON.stringify(newRev)
      ).run();
    }

    return new Response(JSON.stringify(newRev), {
      status: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const db = env.DB || env.CERTS;
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const id = pathParts.length > 2 ? decodeURIComponent(pathParts[pathParts.length - 1]) : null;

  if (db && id) {
    try {
      await ensureReviewsTable(db);
      await db.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
    } catch (e) {}
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
