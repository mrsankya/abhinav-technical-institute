export async function onRequest(context) {
  const { request, env, params } = context;
  const db = env.DB || env.CERTS;
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const id = params && params.id ? String(params.id).toUpperCase().trim() : (pathParts.length > 2 ? decodeURIComponent(pathParts[pathParts.length - 1]).toUpperCase().trim() : '');

  if (!id) return new Response(JSON.stringify({ error: 'Missing certificate registration id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  if (request.method === 'DELETE') {
    if (db) {
      await db.prepare(`DELETE FROM certificates WHERE id = ? OR reg_number = ?`).bind(id, id).run();
    }
    return new Response(JSON.stringify({ success: true, message: 'Certificate deleted' }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  if (request.method === 'GET') {
    try {
      if (db) {
        const res = await db.prepare(`SELECT * FROM certificates WHERE id = ? OR reg_number = ?`).bind(id, id).all();
        const row = res && res.results && res.results.length ? res.results[0] : null;
        if (row) {
          if (row.raw_json) {
            try {
              return new Response(row.raw_json, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
            } catch {}
          }
          const formatted = {
            id: row.id,
            regNumber: row.reg_number || row.id,
            studentName: row.student_name || row.studentName,
            fatherName: row.fatherName || '',
            courseName: row.course_name || row.course,
            grade: row.grade || 'A Grade',
            percentage: row.percentage || '85%',
            issueDate: row.issue_date || row.issueDate || '',
            validUntil: row.valid_until || row.validUntil || 'Lifetime Valid',
            status: row.status || (row.isValid ? 'Valid' : 'Revoked'),
            instituteCenter: row.institute_center || row.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
            remarks: row.remarks || '',
          };
          return new Response(JSON.stringify(formatted), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
      }
      return new Response(JSON.stringify({ error: 'Certificate not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(null, { status: 405 });
}
