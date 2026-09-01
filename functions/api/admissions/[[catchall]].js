async function ensureAdmissionsTable(db) {
  if (!db) return;
  await db.prepare(`CREATE TABLE IF NOT EXISTS course_admissions (
    course_id TEXT PRIMARY KEY,
    is_open INTEGER DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB || env.CERTS;

  try {
    if (db) {
      await ensureAdmissionsTable(db);
      const { results } = await db.prepare('SELECT course_id, is_open FROM course_admissions').all();
      if (results && results.length > 0) {
        const obj = {};
        results.forEach(r => {
          obj[r.course_id] = r.is_open === 1;
        });
        return new Response(JSON.stringify(obj), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }
  } catch (e) {}

  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB || env.CERTS;

  try {
    const payload = await request.json();
    if (db && payload && typeof payload === 'object') {
      await ensureAdmissionsTable(db);
      for (const [courseId, isOpen] of Object.entries(payload)) {
        await db.prepare(`
          INSERT INTO course_admissions (course_id, is_open, updated_at)
          VALUES (?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(course_id) DO UPDATE SET
            is_open = excluded.is_open,
            updated_at = CURRENT_TIMESTAMP
        `).bind(courseId, isOpen ? 1 : 0).run();
      }
    }

    return new Response(JSON.stringify({ success: true, admissions: payload }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
