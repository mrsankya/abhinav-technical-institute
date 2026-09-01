export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB || env.CERTS;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not bound' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // Ensure table exists
  await db.prepare(`CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    reg_number TEXT,
    studentName TEXT,
    student_name TEXT,
    fatherName TEXT,
    course TEXT,
    course_name TEXT,
    grade TEXT,
    percentage TEXT,
    startDate TEXT,
    endDate TEXT,
    issueDate TEXT,
    issue_date TEXT,
    validUntil TEXT,
    valid_until TEXT,
    status TEXT DEFAULT 'Valid',
    instituteCenter TEXT,
    institute_center TEXT,
    remarks TEXT,
    raw_json TEXT,
    isValid INTEGER DEFAULT 1
  )`).run();

  if (request.method === 'POST') {
    try {
      const cert = await request.json();
      const id = String(cert.regNumber || cert.id || '').toUpperCase().trim();
      if (!id) return new Response(JSON.stringify({ error: 'Invalid payload, missing registration ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

      const studentName = cert.studentName || cert.student_name || '';
      const courseName = cert.courseName || cert.course || '';
      const fatherName = cert.fatherName || '';
      const grade = cert.grade || 'A Grade';
      const percentage = cert.percentage || '85%';
      const issueDate = cert.issueDate || cert.issue_date || new Date().toLocaleDateString('en-GB');
      const validUntil = cert.validUntil || cert.valid_until || 'Lifetime Valid';
      const status = cert.status || 'Valid';
      const instituteCenter = cert.instituteCenter || cert.institute_center || 'Abhinav Technical Institute, Main Campus Jalgaon';
      const remarks = cert.remarks || '';
      const isValid = cert.isValid !== false && status !== 'Revoked';

      await db.prepare(`INSERT OR REPLACE INTO certificates (
        id, reg_number, studentName, student_name, fatherName, course, course_name, grade, percentage, issueDate, issue_date, validUntil, valid_until, status, instituteCenter, institute_center, remarks, raw_json, isValid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
        id, id, studentName, studentName, fatherName, courseName, courseName, grade, percentage, issueDate, issueDate, validUntil, validUntil, status, instituteCenter, instituteCenter, remarks, JSON.stringify(cert), isValid ? 1 : 0
      ).run();

      return new Response(JSON.stringify(cert), { status: 201, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
  }

  if (request.method === 'GET') {
    try {
      const res = await db.prepare(`SELECT * FROM certificates ORDER BY rowid DESC`).all();
      const results = (res && res.results) ? res.results.map(r => {
        if (r.raw_json) {
          try { return JSON.parse(r.raw_json); } catch {}
        }
        return {
          id: r.id,
          regNumber: r.reg_number || r.id,
          studentName: r.student_name || r.studentName,
          fatherName: r.fatherName || '',
          courseName: r.course_name || r.course,
          grade: r.grade || 'A Grade',
          percentage: r.percentage || '85%',
          issueDate: r.issue_date || r.issueDate || '',
          validUntil: r.valid_until || r.validUntil || 'Lifetime Valid',
          status: r.status || (r.isValid ? 'Valid' : 'Revoked'),
          instituteCenter: r.institute_center || r.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
          remarks: r.remarks || '',
        };
      }) : [];
      return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
  }

  return new Response(null, { status: 405 });
}
