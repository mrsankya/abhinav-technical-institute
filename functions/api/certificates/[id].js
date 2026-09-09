// Cloudflare Pages Function for /api/certificates/:id
// Handles CORS, GET, and DELETE for specific certificate

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context) {
  const { env, params, request } = context;
  const db = env.DB || env.CERTS;
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const id = params && params.id
    ? String(params.id).toUpperCase().trim()
    : (pathParts.length > 2 ? decodeURIComponent(pathParts[pathParts.length - 1]).toUpperCase().trim() : '');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing certificate registration ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (!db) {
    return new Response(JSON.stringify({ error: 'Database binding DB not found' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const res = await db.prepare(
      `SELECT * FROM certificates WHERE UPPER(reg_number) = ? OR UPPER(REPLACE(reg_number, '-', '')) = ? OR UPPER(REPLACE(reg_number, '/', '')) = ?`
    ).bind(
      id,
      id.replace(/[^A-Z0-9]/g, ''),
      id.replace(/[^A-Z0-9]/g, '')
    ).all();

    const row = res && res.results && res.results.length ? res.results[0] : null;
    if (row) {
      let parsed = {};
      if (row.raw_json) {
        try {
          parsed = JSON.parse(row.raw_json);
        } catch {}
      }

      const regNumber = row.reg_number || parsed.regNumber || parsed.id || id;
      const formatted = {
        ...parsed,
        regNumber,
        id: regNumber,
        studentName: row.student_name || parsed.studentName || '',
        fatherName: parsed.fatherName || '',
        courseName: row.course_name || parsed.courseName || parsed.course || 'Vocational Trade',
        course: parsed.course || row.course_name || 'Vocational Trade',
        grade: row.grade || parsed.grade || 'A Grade',
        percentage: row.percentage || parsed.percentage || '85%',
        issueDate: row.issue_date || parsed.issueDate || '',
        validUntil: row.valid_until || parsed.validUntil || 'Lifetime Valid',
        status: row.status || parsed.status || 'Valid',
        isValid: (row.status || parsed.status) === 'Valid',
        instituteCenter: row.institute_center || parsed.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
        remarks: row.remarks || parsed.remarks || '',
      };

      return new Response(JSON.stringify(formatted), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    return new Response(JSON.stringify({ error: 'Certificate not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function onRequestDelete(context) {
  const { env, params, request } = context;
  const db = env.DB || env.CERTS;
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const id = params && params.id
    ? String(params.id).toUpperCase().trim()
    : (pathParts.length > 2 ? decodeURIComponent(pathParts[pathParts.length - 1]).toUpperCase().trim() : '');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing certificate registration ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (db) {
    try {
      await db.prepare(
        `DELETE FROM certificates WHERE UPPER(reg_number) = ? OR UPPER(REPLACE(reg_number, '-', '')) = ? OR UPPER(REPLACE(reg_number, '/', '')) = ?`
      ).bind(
        id,
        id.replace(/[^A-Z0-9]/g, ''),
        id.replace(/[^A-Z0-9]/g, '')
      ).run();
    } catch (e) {}
  }

  return new Response(JSON.stringify({ success: true, message: 'Certificate deleted' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// Fallback dispatcher
export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return onRequestOptions(context);
  if (context.request.method === 'GET') return onRequestGet(context);
  if (context.request.method === 'DELETE') return onRequestDelete(context);
  return new Response(null, { status: 405 });
}
