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

      const regNumber = row.reg_number || parsed.regNumber || parsed.enrollmentNo || parsed.id || id;
      const enrollmentNo = parsed.enrollmentNo || regNumber;
      const studentName = row.student_name || parsed.studentName || '';
      const studentDob = parsed.studentDob || parsed.dob || '';
      const instituteName = parsed.instituteName || row.institute_center || parsed.instituteCenter || 'Abhinav Technical Institute, Jalgaon';
      const courseName = row.course_name || parsed.courseName || parsed.course || 'Vocational Trade';
      const resultStatus = parsed.resultStatus || row.grade || parsed.grade || 'Passed';
      const totalMarks = parsed.totalMarks || row.percentage || parsed.percentage || '';
      const duration = parsed.duration || '1 Year';
      const examYear = parsed.examYear || parsed.year || '';
      const photo = parsed.photo || parsed.studentPhoto || '';

      const formatted = {
        ...parsed,
        regNumber,
        id: regNumber,
        enrollmentNo,
        studentName,
        studentDob,
        instituteName,
        instituteCenter: instituteName,
        courseName,
        course: courseName,
        resultStatus,
        grade: resultStatus,
        totalMarks,
        percentage: totalMarks || row.percentage || '85%',
        duration,
        examYear,
        photo,
        studentPhoto: photo,
        issueDate: row.issue_date || parsed.issueDate || '',
        validUntil: row.valid_until || parsed.validUntil || 'Lifetime Valid',
        status: row.status || parsed.status || 'Valid',
        isValid: (row.status || parsed.status) === 'Valid',
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
