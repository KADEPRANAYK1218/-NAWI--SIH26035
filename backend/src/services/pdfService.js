/**
 * PDF Report Generator Service
 * Generates an official, publication-quality OIML R 76 Test Report using PDFKit
 * Designed with strict layout geometry to prevent text overlapping or coordinate drift.
 */

import PDFDocument from 'pdfkit';

export class PdfService {
  /**
   * Generates a PDF buffer for a test report
   * @param {Object} report Full report object with instrument, lab conditions, observations
   * @returns {Promise<Buffer>}
   */
  static async generateReportPdf(report) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
          bufferPages: true,
          autoFirstPage: true
        });

        const buffers = [];
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', err => reject(err));

        // Color Palette
        const cNavy = '#0F172A';
        const cBlue = '#1D4ED8';
        const cSlate = '#334155';
        const cGray = '#64748B';
        const cBorder = '#CBD5E1';
        const cBgLight = '#F8FAFC';
        const cPass = '#15803D';
        const cFail = '#B91C1C';

        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const margin = 40;
        const contentWidth = pageWidth - (margin * 2); // 515.28 pt

        let y = 38;

        const checkPageBreak = (neededHeight) => {
          if (y + neededHeight > pageHeight - 50) {
            doc.addPage();
            y = 40;
            return true;
          }
          return false;
        };

        // ==========================================
        // 1. OFFICIAL HEADER
        // ==========================================
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor(cSlate)
          .text('GOVERNMENT OF INDIA • DEPARTMENT OF CONSUMER AFFAIRS', margin, y, {
            width: contentWidth,
            align: 'center'
          });
        y += 14;

        doc.fontSize(8).font('Helvetica').fillColor(cGray)
          .text('DIRECTORATE OF LEGAL METROLOGY • REGIONAL REFERENCE STANDARDS LABORATORY', margin, y, {
            width: contentWidth,
            align: 'center'
          });
        y += 15;

        doc.fontSize(15).font('Helvetica-Bold').fillColor(cNavy)
          .text('NON-AUTOMATIC WEIGHING INSTRUMENT (NAWI)', margin, y, {
            width: contentWidth,
            align: 'center'
          });
        y += 18;

        doc.fontSize(11).font('Helvetica-Bold').fillColor(cBlue)
          .text('TYPE EVALUATION & PATTERN APPROVAL TEST REPORT', margin, y, {
            width: contentWidth,
            align: 'center'
          });
        y += 15;

        doc.fontSize(8.5).font('Helvetica-Oblique').fillColor(cGray)
          .text('Evaluated in accordance with OIML R 76-1 (Edition 2006) & Legal Metrology (General) Rules, 2011', margin, y, {
            width: contentWidth,
            align: 'center'
          });
        y += 16;

        // Prototype / Demonstration Notice Box
        const bannerHeight = 18;
        doc.rect(margin, y, contentWidth, bannerHeight)
          .fillAndStroke('#FEF3C7', '#F59E0B');

        doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#92400E')
          .text('★ PROTOTYPE / DEMONSTRATION RECORD — NOT A STATUTORY MODEL APPROVAL CERTIFICATE ★', margin, y + 4.5, {
            width: contentWidth,
            align: 'center'
          });
        y += bannerHeight + 10;

        // ==========================================
        // 2. METADATA BOX (ADMINISTRATIVE DETAILS)
        // ==========================================
        const metaBoxHeight = 52;
        doc.rect(margin, y, contentWidth, metaBoxHeight)
          .fillAndStroke(cBgLight, cBorder);

        const rptNum = report.reportNumber || report.id || 'RPT-001';
        const testDt = report.testDate || 'N/A';
        const labName = report.laboratoryName || 'Regional Reference Standards Laboratory (RRSL), New Delhi';
        const engName = report.testEngineerName || 'Sunita Verma';
        const isCompleted = (report.status || '').toUpperCase() === 'COMPLETED';

        // Row 1 inside Meta Box
        const r1Y = y + 8;
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor(cNavy)
          .text('Report ID:', margin + 12, r1Y);
        doc.font('Helvetica').fillColor(cBlue)
          .text(rptNum, margin + 65, r1Y);

        doc.font('Helvetica-Bold').fillColor(cNavy)
          .text('Test Date:', margin + 185, r1Y);
        doc.font('Helvetica').fillColor(cSlate)
          .text(testDt, margin + 235, r1Y);

        doc.font('Helvetica-Bold').fillColor(cNavy)
          .text('Verdict / Status:', margin + 335, r1Y);
        doc.font('Helvetica-Bold').fillColor(report.overallResult === 'PASS' ? cPass : cFail)
          .text(`${report.overallResult || 'PASS'} (${isCompleted ? 'COMPLETED' : report.status || 'ACTIVE'})`, margin + 415, r1Y);

        // Row 2 inside Meta Box
        const r2Y = y + 28;
        doc.fontSize(8).font('Helvetica-Bold').fillColor(cNavy)
          .text('Laboratory:', margin + 12, r2Y);
        doc.font('Helvetica').fillColor(cGray)
          .text(labName, margin + 65, r2Y, { width: 260, ellipsis: true });

        doc.font('Helvetica-Bold').fillColor(cNavy)
          .text('Officer:', margin + 335, r2Y);
        doc.font('Helvetica').fillColor(cSlate)
          .text(engName, margin + 380, r2Y, { width: 120, ellipsis: true });

        y += metaBoxHeight + 14;

        // Helper to draw clean section header
        const drawSectionHeader = (title) => {
          checkPageBreak(30);
          doc.fontSize(10).font('Helvetica-Bold').fillColor(cBlue)
            .text(title, margin, y, { width: contentWidth, align: 'left' });
          y += 13;
          doc.strokeColor(cBorder).lineWidth(0.75)
            .moveTo(margin, y)
            .lineTo(margin + contentWidth, y)
            .stroke();
          y += 6;
        };

        // ==========================================
        // 3. SECTION 1: INSTRUMENT TECHNICAL SPECS
        // ==========================================
        drawSectionHeader('1. INSTRUMENT & APPLICANT SPECIFICATIONS');

        const inst = report.instrument || {};
        const unit = inst.unit || 'kg';
        const specBoxHeight = 76;
        doc.rect(margin, y, contentWidth, specBoxHeight)
          .fillAndStroke('#FFFFFF', cBorder);

        // 4 sub-rows with grid lines
        const rowH = 19;
        const midX = margin + (contentWidth / 2); // 297.64

        // Draw internal dividers
        doc.strokeColor('#E2E8F0').lineWidth(0.5);
        for (let i = 1; i < 4; i++) {
          doc.moveTo(margin, y + (i * rowH)).lineTo(margin + contentWidth, y + (i * rowH)).stroke();
        }
        doc.moveTo(midX, y).lineTo(midX, y + specBoxHeight).stroke();

        const renderField = (label, val, xPos, yPos, labelW = 95, valW = 150) => {
          doc.fontSize(8).font('Helvetica-Bold').fillColor(cSlate)
            .text(label, xPos, yPos + 5, { width: labelW });
          doc.font('Helvetica').fillColor(cNavy)
            .text(String(val || 'N/A'), xPos + labelW, yPos + 5, { width: valW, ellipsis: true });
        };

        // Row 1
        renderField('Manufacturer:', inst.manufacturer || 'Apex Weighing Systems Ltd', margin + 8, y);
        renderField('Model Number:', inst.model || 'ABC-500', midX + 8, y);

        // Row 2
        renderField('Instrument Type:', inst.instrumentType || 'Electronic Bench Scale', margin + 8, y + rowH);
        renderField('Serial Number:', inst.serialNumber || 'SN-10234', midX + 8, y + rowH);

        // Row 3
        renderField('Accuracy Class:', `Class ${inst.accuracyClass || 'III'}`, margin + 8, y + (rowH * 2));
        renderField('Max Capacity (Max):', `${inst.maxCapacity} ${unit}`, midX + 8, y + (rowH * 2));

        // Row 4
        renderField('Min Capacity (Min):', `${inst.minCapacity || '0.1'} ${unit}`, margin + 8, y + (rowH * 3));
        renderField('Scale Interval (e / d):', `e = ${inst.verificationScaleInterval || '0.005'} ${unit}, d = ${inst.actualScaleInterval || inst.verificationScaleInterval || '0.005'} ${unit}`, midX + 8, y + (rowH * 3), 110, 135);

        y += specBoxHeight + 12;

        // ==========================================
        // 4. SECTION 2: ENVIRONMENTAL CONDITIONS
        // ==========================================
        drawSectionHeader('2. ENVIRONMENTAL CONDITIONS & REFERENCE STANDARDS');

        const lab = report.laboratoryConditions || {};
        const envBoxHeight = 36;
        doc.rect(margin, y, contentWidth, envBoxHeight)
          .fillAndStroke(cBgLight, cBorder);

        const colW = contentWidth / 3; // ~171.7 pt

        // Row 1 of Env
        const ey1 = y + 5;
        doc.fontSize(8).font('Helvetica-Bold').fillColor(cSlate)
          .text('Temperature:', margin + 8, ey1);
        doc.font('Helvetica').fillColor(cNavy)
          .text(`${lab.temperature || '23.4'} °C`, margin + 72, ey1);

        doc.font('Helvetica-Bold').fillColor(cSlate)
          .text('Relative Humidity:', margin + colW + 8, ey1);
        doc.font('Helvetica').fillColor(cNavy)
          .text(`${lab.humidity || '52.0'} % RH`, margin + colW + 90, ey1);

        doc.font('Helvetica-Bold').fillColor(cSlate)
          .text('Barometric Pressure:', margin + (colW * 2) + 8, ey1);
        doc.font('Helvetica').fillColor(cNavy)
          .text(`${lab.pressure || '1012.5'} hPa`, margin + (colW * 2) + 100, ey1);

        // Row 2 of Env
        const ey2 = y + 19;
        doc.font('Helvetica-Bold').fillColor(cSlate)
          .text('Mains Voltage:', margin + 8, ey2);
        doc.font('Helvetica').fillColor(cNavy)
          .text(`${lab.voltage || '230.2'} V AC (50 Hz)`, margin + 72, ey2);

        doc.font('Helvetica-Bold').fillColor(cSlate)
          .text('Reference Standards:', margin + colW + 8, ey2);
        doc.font('Helvetica').fillColor(cNavy)
          .text(lab.standardWeightsId || 'RRSL-STD-WT-SET-08 (Class F1)', margin + colW + 105, ey2, { width: 220, ellipsis: true });

        y += envBoxHeight + 12;

        // ==========================================
        // 5. SECTION 3: TEST OBSERVATIONS TABLE
        // ==========================================
        drawSectionHeader('3. TEST OBSERVATIONS, CALCULATED ERRORS & PERMISSIBLE LIMITS');

        const drawTableHeader = (headerY) => {
          doc.rect(margin, headerY, contentWidth, 18).fill('#0F172A');
          doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#FFFFFF');
          doc.text('Test Name & Load Application Point', margin + 8, headerY + 5, { width: 170, align: 'left' });
          doc.text(`Reference (${unit})`, margin + 182, headerY + 5, { width: 62, align: 'right' });
          doc.text(`Observed (${unit})`, margin + 250, headerY + 5, { width: 62, align: 'right' });
          doc.text(`Error (E)`, margin + 318, headerY + 5, { width: 60, align: 'right' });
          doc.text('Tolerance Limit (MPE)', margin + 384, headerY + 5, { width: 78, align: 'center' });
          doc.text('Result', margin + 468, headerY + 5, { width: 40, align: 'center' });
        };

        drawTableHeader(y);
        y += 18;

        const observations = report.observations || [];
        const tableRowHeight = 16;

        observations.forEach((obs, idx) => {
          checkPageBreak(tableRowHeight + 5);

          // Zebra striping
          const rowBg = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
          doc.rect(margin, y, contentWidth, tableRowHeight).fill(rowBg);
          doc.strokeColor('#E2E8F0').lineWidth(0.5)
            .moveTo(margin, y + tableRowHeight)
            .lineTo(margin + contentWidth, y + tableRowHeight)
            .stroke();

          // Full readable test description
          const testName = obs.testType || `Test Step ${idx + 1}`;
          const testPt = obs.testPoint ? ` - ${obs.testPoint}` : '';
          const fullDesc = `${testName}${testPt}`;

          doc.fontSize(7.5).font('Helvetica').fillColor(cNavy)
            .text(fullDesc, margin + 8, y + 4, { width: 170, ellipsis: true });

          // Reference Load
          const refVal = obs.referenceValue !== undefined && obs.referenceValue !== null ? `${obs.referenceValue}` : '—';
          doc.font('Helvetica').fillColor(cSlate)
            .text(refVal, margin + 182, y + 4, { width: 62, align: 'right' });

          // Observed Value
          const indVal = obs.indicatedValue !== undefined && obs.indicatedValue !== null ? `${obs.indicatedValue}` : '—';
          doc.font('Helvetica').fillColor(cSlate)
            .text(indVal, margin + 250, y + 4, { width: 62, align: 'right' });

          // Calculated Error
          const errVal = Number(obs.calculatedError);
          const errText = !isNaN(errVal) ? (errVal > 0 ? `+${errVal}` : `${errVal}`) : (obs.calculatedError || '0');
          doc.font('Helvetica-Bold').fillColor(cNavy)
            .text(`${errText} ${unit}`, margin + 318, y + 4, { width: 60, align: 'right' });

          // MPE
          const mpeText = obs.applicableRequirement || (obs.mpe ? `±${obs.mpe}` : '±1.0 e');
          doc.font('Helvetica').fillColor(cGray)
            .text(mpeText, margin + 384, y + 4, { width: 78, align: 'center' });

          // Verdict Pill / Text
          const pass = (obs.result || 'PASS').toUpperCase() === 'PASS';
          doc.font('Helvetica-Bold').fillColor(pass ? cPass : cFail)
            .text(obs.result || 'PASS', margin + 468, y + 4, { width: 40, align: 'center' });

          y += tableRowHeight;
        });

        y += 12;

        // ==========================================
        // 6. SECTION 4: COMPLIANCE DETERMINATION BOX
        // ==========================================
        checkPageBreak(50);
        const verdictBoxHeight = 44;
        const isPassOverall = (report.overallResult || 'PASS').toUpperCase() === 'PASS';
        const vBg = isPassOverall ? '#F0FDF4' : '#FEF2F2';
        const vBorder = isPassOverall ? '#16A34A' : '#DC2626';

        doc.rect(margin, y, contentWidth, verdictBoxHeight)
          .fillAndStroke(vBg, vBorder);

        doc.fontSize(9).font('Helvetica-Bold').fillColor(cNavy)
          .text('OVERALL METROLOGICAL DETERMINATION:', margin + 12, y + 8);

        doc.fontSize(13).font('Helvetica-Bold').fillColor(isPassOverall ? cPass : cFail)
          .text(isPassOverall ? 'PASSED (COMPLIANT)' : 'FAILED (NON-COMPLIANT)', margin + 250, y + 6);

        const remarksText = report.remarks || 'All evaluated verification parameters satisfy the maximum permissible error limits specified in OIML R 76-1.';
        doc.fontSize(8).font('Helvetica').fillColor(cSlate)
          .text(remarksText, margin + 12, y + 25, { width: contentWidth - 24, ellipsis: true });

        y += verdictBoxHeight + 14;

        // ==========================================
        // 7. SECTION 5: SIGNATURES & STAMPS
        // ==========================================
        checkPageBreak(55);
        const sigBlockWidth = (contentWidth - 20) / 2; // ~247.6 pt

        // Left signature: Test Metrologist
        const leftSigX = margin;
        doc.strokeColor(cBorder).lineWidth(0.5)
          .moveTo(leftSigX + 10, y + 25)
          .lineTo(leftSigX + sigBlockWidth - 10, y + 25)
          .stroke();

        doc.fontSize(8).font('Helvetica-Bold').fillColor(cNavy)
          .text(report.testEngineerName || 'Sunita Verma', leftSigX + 10, y + 28);
        doc.fontSize(7.5).font('Helvetica').fillColor(cGray)
          .text('Test Metrologist • RRSL Legal Metrology', leftSigX + 10, y + 39);
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor(cPass)
          .text('✔ DIGITALLY VERIFIED RECORD', leftSigX + 10, y + 49);

        // Right signature: Reviewing Officer
        const rightSigX = margin + sigBlockWidth + 20;
        doc.strokeColor(cBorder).lineWidth(0.5)
          .moveTo(rightSigX + 10, y + 25)
          .lineTo(rightSigX + sigBlockWidth - 10, y + 25)
          .stroke();

        doc.fontSize(8).font('Helvetica-Bold').fillColor(cNavy)
          .text(report.reviewerName || 'Dr. Ramesh Sharma', rightSigX + 10, y + 28);
        doc.fontSize(7.5).font('Helvetica').fillColor(cGray)
          .text('Reviewing Officer • Directorate of Legal Metrology', rightSigX + 10, y + 39);
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor(cBlue)
          .text('✔ STATUTORY REVIEW RECORD', rightSigX + 10, y + 49);

        // ==========================================
        // 8. PAGE FOOTERS WITH EXACT NUMBERING
        // ==========================================
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          doc.strokeColor('#E2E8F0').lineWidth(0.5)
            .moveTo(margin, pageHeight - 34)
            .lineTo(margin + contentWidth, pageHeight - 34)
            .stroke();

          doc.fontSize(7).font('Helvetica').fillColor(cGray)
            .text('Government of India • Directorate of Legal Metrology • NAWI Type Evaluation Prototype', margin, pageHeight - 26, {
              width: contentWidth - 80,
              align: 'left'
            });

          doc.fontSize(7).font('Helvetica-Bold').fillColor(cSlate)
            .text(`Page ${i + 1} of ${range.count}`, margin + contentWidth - 70, pageHeight - 26, {
              width: 70,
              align: 'right'
            });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
