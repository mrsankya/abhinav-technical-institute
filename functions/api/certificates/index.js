// Cloudflare Pages Function for /api/certificates
// Handles CORS, GET (list all certificates), and POST (issue/save certificate)

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  const db = env.DB || env.CERTS;
  if (!db) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const res = await db.prepare(`SELECT * FROM certificates ORDER BY rowid DESC`).all();
    const results = (res && res.results) ? res.results.map((r) => {
      let parsed = {};
      if (r.raw_json) {
        try {
          parsed = JSON.parse(r.raw_json);
        } catch {}
      }

      const regNumber = r.reg_number || parsed.regNumber || parsed.id || '';
      return {
        ...parsed,
        regNumber,
        id: regNumber,
        studentName: r.student_name || parsed.studentName || '',
        fatherName: parsed.fatherName || '',
        courseName: r.course_name || parsed.courseName || parsed.course || 'Vocational Trade',
        course: parsed.course || r.course_name || 'Vocational Trade',
        grade: r.grade || parsed.grade || 'A Grade',
        percentage: r.percentage || parsed.percentage || '85%',
        issueDate: r.issue_date || parsed.issueDate || '',
        validUntil: r.valid_until || parsed.validUntil || 'Lifetime Valid',
        status: r.status || parsed.status || 'Valid',
        isValid: (r.status || parsed.status) === 'Valid',
        instituteCenter: r.institute_center || parsed.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
        remarks: r.remarks || parsed.remarks || '',
      };
    }) : [];

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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

export async function onRequestPost(context) {
  const { request, env } = context;
  const db = env.DB || env.CERTS;
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
    const cert = await request.json();
    const regNumber = String(cert.regNumber || cert.id || '').toUpperCase().trim();
    if (!regNumber) {
      return new Response(JSON.stringify({ error: 'Missing certificate registration ID (regNumber/id)' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const studentName = (cert.studentName || cert.student_name || '').trim();
    const courseName = (cert.courseName || cert.course || 'Vocational Trade').trim();
    const grade = cert.grade || 'A Grade';
    const percentage = cert.percentage || '85%';
    const issueDate = cert.issueDate || cert.issue_date || new Date().toLocaleDateString('en-GB');
    const validUntil = cert.validUntil || cert.valid_until || 'Lifetime Valid';
    const status = cert.status || 'Valid';
    const instituteCenter = cert.instituteCenter || cert.institute_center || 'Abhinav Technical Institute, Main Campus Jalgaon';
    const remarks = cert.remarks || '';

    // Standardized payload to save in raw_json
    const formattedCert = {
      ...cert,
      regNumber,
      id: regNumber,
      studentName,
      courseName,
      course: courseName,
      grade,
      percentage,
      issueDate,
      validUntil,
      status,
      isValid: status === 'Valid',
      instituteCenter,
      remarks,
    };

    // Use exact columns defined in D1 table: reg_number, student_name, course_name, grade, percentage, issue_date, valid_until, status, institute_center, remarks, raw_json
    await db.prepare(`
      INSERT INTO certificates (
        reg_number,
        student_name,
        course_name,
        grade,
        percentage,
        issue_date,
        valid_until,
        status,
        institute_center,
        remarks,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(reg_number) DO UPDATE SET
        student_name = excluded.student_name,
        course_name = excluded.course_name,
        grade = excluded.grade,
        percentage = excluded.percentage,
        issue_date = excluded.issue_date,
        valid_until = excluded.valid_until,
        status = excluded.status,
        institute_center = excluded.institute_center,
        remarks = excluded.remarks,
        raw_json = excluded.raw_json
    `).bind(
      regNumber,
      studentName,
      courseName,
      grade,
      percentage,
      issueDate,
      validUntil,
      status,
      instituteCenter,
      remarks,
      JSON.stringify(formattedCert)
    ).run();

    return new Response(JSON.stringify(formattedCert), {
      status: 201,
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

// Export onRequest as fallback for any method
export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') return onRequestOptions(context);
  if (context.request.method === 'POST') return onRequestPost(context);
  if (context.request.method === 'GET') return onRequestGet(context);
  return new Response(null, { status: 405 });
}
