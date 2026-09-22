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

      const regNumber = r.reg_number || parsed.regNumber || parsed.enrollmentNo || parsed.id || '';
      const enrollmentNo = parsed.enrollmentNo || regNumber;
      const studentName = r.student_name || parsed.studentName || '';
      const studentDob = parsed.studentDob || parsed.dob || '';
      const instituteName = parsed.instituteName || r.institute_center || parsed.instituteCenter || 'Abhinav Technical Institute, Jalgaon';
      const courseName = r.course_name || parsed.courseName || parsed.course || 'Vocational Trade';
      const resultStatus = parsed.resultStatus || r.grade || parsed.grade || 'Passed';
      const totalMarks = parsed.totalMarks || r.percentage || parsed.percentage || '';
      const duration = parsed.duration || '1 Year';
      const examYear = parsed.examYear || parsed.year || '';
      const photo = parsed.photo || parsed.studentPhoto || '';

      return {
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
        percentage: totalMarks || r.percentage || '85%',
        duration,
        examYear,
        photo,
        studentPhoto: photo,
        issueDate: r.issue_date || parsed.issueDate || '',
        validUntil: r.valid_until || parsed.validUntil || 'Lifetime Valid',
        status: r.status || parsed.status || 'Valid',
        isValid: (r.status || parsed.status) === 'Valid',
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
    const rawId = cert.enrollmentNo || cert.regNumber || cert.id || '';
    const regNumber = String(rawId).toUpperCase().trim();
    if (!regNumber) {
      return new Response(JSON.stringify({ error: 'Missing Enrollment / Registration Number (enrollmentNo/regNumber)' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const studentName = (cert.studentName || cert.student_name || cert.name || '').trim();
    const studentDob = (cert.studentDob || cert.dob || '').trim();
    const enrollmentNo = (cert.enrollmentNo || regNumber).trim();
    const instituteName = (cert.instituteName || cert.instituteCenter || cert.institute_center || 'Abhinav Technical Institute, Jalgaon').trim();
    const courseName = (cert.courseName || cert.course || 'Vocational Trade').trim();
    const resultStatus = (cert.resultStatus || cert.grade || 'Passed').trim();
    const totalMarks = (cert.totalMarks || cert.percentage || '').trim();
    const duration = (cert.duration || '1 Year').trim();
    const examYear = (cert.examYear || cert.year || '').trim();
    const photo = cert.photo || cert.studentPhoto || '';
    const grade = resultStatus || cert.grade || 'A Grade';
    const percentage = totalMarks || cert.percentage || '85%';
    const issueDate = cert.issueDate || cert.issue_date || new Date().toLocaleDateString('en-GB');
    const validUntil = cert.validUntil || cert.valid_until || 'Lifetime Valid';
    const status = cert.status || 'Valid';
    const instituteCenter = instituteName;
    const remarks = cert.remarks || '';

    // Standardized payload to save in raw_json
    const formattedCert = {
      ...cert,
      regNumber,
      id: regNumber,
      enrollmentNo,
      studentName,
      studentDob,
      instituteName,
      instituteCenter,
      courseName,
      course: courseName,
      resultStatus,
      grade,
      totalMarks,
      percentage,
      duration,
      examYear,
      photo,
      studentPhoto: photo,
      issueDate,
      validUntil,
      status,
      isValid: status === 'Valid',
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
