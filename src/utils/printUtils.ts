import QRCode from 'qrcode';
import type { StudentCertificate } from '../types';

export interface FeeReceiptData {
  receiptNo: string;
  studentId: string;
  studentName: string;
  fatherName?: string;
  phone?: string;
  course: string;
  feeAmount: string;
  feePaid: string;
  paymentMode: string;
  date?: string;
}

/**
 * Clean isolated printing helper
 */
export const openCleanPrintWindow = (title: string, htmlContent: string) => {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Please allow pop-ups in your browser to print receipts and certificates.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #172033;
            background: #ffffff;
            margin: 0;
            padding: 20px;
          }
          .print-card {
            max-width: 680px;
            margin: 0 auto;
            border: 2px solid #002760;
            border-radius: 16px;
            padding: 28px;
            background: #ffffff;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #002760;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 900;
            color: #002760;
            letter-spacing: 0.5px;
          }
          .header p {
            margin: 4px 0 0;
            font-size: 12px;
            color: #475569;
            font-weight: 500;
          }
          .header .reg-info {
            font-size: 11px;
            color: #0369a1;
            font-weight: bold;
            margin-top: 3px;
          }
          .badge {
            display: inline-block;
            background: #002760;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 5px 16px;
            border-radius: 9999px;
            margin-top: 10px;
            text-transform: uppercase;
          }
          .grid-table {
            width: 100%;
            border-collapse: collapse;
            margin: 18px 0;
          }
          .grid-table td {
            padding: 9px 12px;
            font-size: 13px;
            border-bottom: 1px dashed #cbd5e1;
          }
          .grid-table .label {
            width: 38%;
            color: #64748b;
            font-weight: 600;
          }
          .grid-table .value {
            font-weight: 800;
            color: #0f172a;
          }
          .paid-highlight {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 10px;
            padding: 12px 16px;
            margin: 16px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .paid-highlight .amount {
            font-size: 20px;
            font-weight: 900;
            color: #166534;
          }
          .footer-section {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .sign-box {
            text-align: center;
          }
          .sign-line {
            width: 180px;
            border-top: 1.5px solid #1e293b;
            margin-top: 45px;
            padding-top: 5px;
            font-size: 11px;
            font-weight: bold;
            color: #0f172a;
          }
          .qr-section {
            display: flex;
            align-items: center;
            gap: 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            margin-top: 16px;
          }
          .qr-section img {
            width: 75px;
            height: 75px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .print-card {
              border: 1.5px solid #002760;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-card">
          ${htmlContent}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Print Official Student Fee Receipt
 */
export const printOfficialFeeReceipt = (data: FeeReceiptData) => {
  const total = Number(data.feeAmount || 0);
  const paid = Number(data.feePaid || 0);
  const balance = Math.max(0, total - paid);
  const dateStr = data.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const html = `
    <div class="header">
      <h1>ABHINAV TECHNICAL INSTITUTE</h1>
      <p>First Floor, Mansing Market, near railway station, Jalgaon, Maharashtra 425001, India • Helpline: +91 94234 88174</p>
      <div class="reg-info">Govt Recognized • ISO 9001:2015 Certified Vocational Training Center (Est. 1997)</div>
      <div class="badge">OFFICIAL ADMISSION FEE RECEIPT</div>
    </div>

    <table class="grid-table">
      <tr>
        <td class="label">Receipt Number</td>
        <td class="value font-mono" style="color: #002760; font-size: 14px;">${data.receiptNo}</td>
      </tr>
      <tr>
        <td class="label">Date of Payment</td>
        <td class="value">${dateStr}</td>
      </tr>
      <tr>
        <td class="label">Student ID Number</td>
        <td class="value font-mono">${data.studentId}</td>
      </tr>
      <tr>
        <td class="label">Student Full Name</td>
        <td class="value" style="font-size: 15px; color: #002760;">${data.studentName || '—'}</td>
      </tr>
      ${data.fatherName ? `<tr><td class="label">Father's Name</td><td class="value">${data.fatherName}</td></tr>` : ''}
      ${data.phone ? `<tr><td class="label">Contact Phone</td><td class="value">${data.phone}</td></tr>` : ''}
      <tr>
        <td class="label">Course / Trade</td>
        <td class="value" style="color: #1557c0;">${data.course}</td>
      </tr>
      <tr>
        <td class="label">Total Prescribed Fee</td>
        <td class="value">₹${total.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td class="label">Payment Mode</td>
        <td class="value">${data.paymentMode}</td>
      </tr>
    </table>

    <div class="paid-highlight">
      <div>
        <div style="font-size: 12px; color: #166534; font-weight: bold; text-transform: uppercase;">Amount Received</div>
        <div style="font-size: 13px; font-weight: 600; color: #14532d;">Payment successfully verified and credited</div>
      </div>
      <div class="amount">₹${paid.toLocaleString('en-IN')}</div>
    </div>

    <table class="grid-table" style="margin-top: 0;">
      <tr>
        <td class="label" style="color: #991b1b;">Balance Remaining (If Any)</td>
        <td class="value" style="color: #991b1b; font-size: 15px;">₹${balance.toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <div style="font-size: 10px; color: #64748b; margin-top: 10px; line-height: 1.4;">
      * Terms: Fees once paid are non-refundable. Please retain this original receipt for student ID card issuance and examination hall ticket.
    </div>

    <div class="footer-section">
      <div class="sign-box">
        <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">ATI Jalgaon Official Seal</div>
        <div style="border: 1px dashed #94a3b8; border-radius: 6px; padding: 12px 20px; font-size: 10px; font-weight: bold; color: #002760;">
          SEAL / STAMP
        </div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Authorized Signatory / Principal</div>
      </div>
    </div>
  `;

  openCleanPrintWindow(`Fee_Receipt_${data.receiptNo}`, html);
};

/**
 * Print Official Certificate Verification Slip
 */
export const printCertificateVerificationSlip = (cert: StudentCertificate, qrDataUrl?: string) => {
  const verifyUrl = `${window.location.origin}/#verify?id=${encodeURIComponent(cert.regNumber)}`;
  const dateStr = cert.issueDate || new Date().toLocaleDateString('en-GB');

  const html = `
    <div class="header">
      <h1>ABHINAV TECHNICAL INSTITUTE</h1>
      <p>First Floor, Mansing Market, near railway station, Jalgaon, Maharashtra 425001, India • Helpline: +91 94234 88174</p>
      <div class="reg-info">Govt Recognized • ISO 9001:2015 Certified Vocational Training Center (Est. 1997)</div>
      <div class="badge" style="background: #047857;">OFFICIAL CERTIFICATE VERIFICATION RECORD</div>
    </div>

    <div style="background: #ecfdf5; border: 1.5px solid #10b981; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="color: #065f46; font-size: 13px; font-weight: 800; text-transform: uppercase;">
          ✓ Verified Authentic Govt-Recognized Credential
        </div>
        <div style="font-size: 11px; color: #047857; margin-top: 2px;">
          This record matches the official registry database of Abhinav Technical Institute.
        </div>
      </div>
      <div style="background: #10b981; color: #fff; font-weight: 900; font-size: 12px; padding: 4px 10px; border-radius: 6px;">
        STATUS: VALID
      </div>
    </div>

    <table class="grid-table">
      <tr>
        <td class="label">Certificate / Registration ID</td>
        <td class="value font-mono" style="color: #002760; font-size: 15px;">${cert.regNumber}</td>
      </tr>
      <tr>
        <td class="label">Candidate Full Name</td>
        <td class="value" style="font-size: 16px; color: #002760; text-transform: uppercase;">${cert.studentName}</td>
      </tr>
      <tr>
        <td class="label">Vocational Trade / Course</td>
        <td class="value" style="color: #1557c0; font-size: 14px;">${cert.courseName}</td>
      </tr>
      <tr>
        <td class="label">Performance / Grade Awarded</td>
        <td class="value" style="color: #047857; font-size: 14px;">${cert.grade} ${cert.percentage ? `(${cert.percentage})` : ''}</td>
      </tr>
      <tr>
        <td class="label">Date of Issuance</td>
        <td class="value">${dateStr}</td>
      </tr>
      <tr>
        <td class="label">Credential Validity</td>
        <td class="value" style="color: #047857;">${cert.validUntil || 'Lifetime Valid'}</td>
      </tr>
      <tr>
        <td class="label">Examination Authority</td>
        <td class="value">${cert.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon'}</td>
      </tr>
    </table>

    <div class="qr-section">
      ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Verification Seal" />` : ''}
      <div style="font-size: 11px; color: #334155; line-height: 1.5;">
        <strong style="color: #002760; font-size: 12px; display: block;">Instant Digital Verification QR Seal</strong>
        Scan this QR code with any smartphone camera to view and authenticate this original certificate record online at:
        <br />
        <span style="font-family: monospace; color: #0284c7; word-break: break-all;">${verifyUrl}</span>
      </div>
    </div>

    <div class="footer-section">
      <div class="sign-box">
        <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Official Registry Stamp</div>
        <div style="border: 1px dashed #94a3b8; border-radius: 6px; padding: 12px 20px; font-size: 10px; font-weight: bold; color: #002760;">
          INSTITUTE SEAL
        </div>
      </div>
      <div class="sign-box">
        <div class="sign-line">Director / Controller of Examinations</div>
      </div>
    </div>
  `;

  openCleanPrintWindow(`Certificate_Verification_${cert.regNumber}`, html);
};

/**
 * Generate a branded PNG QR code sticker for student certificates and download it directly
 */
export const downloadBrandedStudentQrCode = async (
  studentName: string,
  regNumber: string,
  courseName?: string
) => {
  try {
    const verifyUrl = `${window.location.origin}/#verify?id=${encodeURIComponent(regNumber.trim().toUpperCase())}`;
    
    // Generate high resolution QR Data URL
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 420,
      margin: 1,
      color: {
        dark: '#002760',
        light: '#FFFFFF',
      },
    });

    // Create off-screen canvas to render branded sticker
    const canvas = document.createElement('canvas');
    const width = 500;
    const height = 620;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#002760';
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Header bar
    ctx.fillStyle = '#002760';
    ctx.fillRect(8, 8, width - 16, 68);

    // Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ABHINAV TECHNICAL INSTITUTE', width / 2, 35);
    ctx.font = '11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#FFD21F';
    ctx.fillText('Govt Recognized & ISO 9001:2015 Certified • Jalgaon', width / 2, 54);

    // QR Image load
    const qrImg = new Image();
    await new Promise((resolve, reject) => {
      qrImg.onload = resolve;
      qrImg.onerror = reject;
      qrImg.src = qrDataUrl;
    });

    // Draw QR Code
    const qrSize = 320;
    const qrX = (width - qrSize) / 2;
    const qrY = 90;
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Student Details
    ctx.fillStyle = '#002760';
    ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    ctx.fillText(studentName.toUpperCase(), width / 2, 435);

    ctx.fillStyle = '#0284C7';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`REG ID: ${regNumber.toUpperCase()}`, width / 2, 460);

    if (courseName) {
      ctx.fillStyle = '#475569';
      ctx.font = '600 12px "Segoe UI", Arial, sans-serif';
      // Truncate course name if too long
      const displayCourse = courseName.length > 45 ? courseName.slice(0, 42) + '...' : courseName;
      ctx.fillText(displayCourse, width / 2, 485);
    }

    // Bottom Scan Instruction
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(16, 520, width - 32, 70);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 520, width - 32, 70);

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    ctx.fillText('✓ SCAN TO VERIFY CERTIFICATE ONLINE', width / 2, 545);

    ctx.fillStyle = '#64748B';
    ctx.font = '10px monospace';
    ctx.fillText(verifyUrl.length > 50 ? verifyUrl.slice(0, 48) + '...' : verifyUrl, width / 2, 568);

    // Trigger Download
    const downloadUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const cleanName = studentName.trim().replace(/[^a-zA-Z0-9]/g, '_');
    const cleanReg = regNumber.trim().replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `QR_${cleanName}_${cleanReg}.png`;
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to download QR code', err);
    alert('Failed to generate downloadable QR sticker.');
  }
};
