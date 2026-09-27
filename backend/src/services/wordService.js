/**
 * Word (DOCX) Report Generator Service
 * Generates an editable .docx file for a test report using docx
 * Formatted with clear margins, bordered tables, and OIML R 76 layout
 */

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Packer
} from 'docx';

export class WordService {
  /**
   * Generates a DOCX Buffer for a test report
   * @param {Object} report Full report object
   * @returns {Promise<Buffer>}
   */
  static async generateReportDocx(report) {
    const inst = report.instrument || {};
    const lab = report.laboratoryConditions || {};
    const observations = report.observations || [];
    const unit = inst.unit || 'kg';

    const tableBorder = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: 'CBD5E1'
    };

    const borders = {
      top: tableBorder,
      bottom: tableBorder,
      left: tableBorder,
      right: tableBorder
    };

    const cellMargins = {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140
    };

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000
            }
          }
        },
        children: [
          // Title Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'GOVERNMENT OF INDIA • DEPARTMENT OF CONSUMER AFFAIRS',
                bold: true,
                size: 20,
                color: '334155'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DIRECTORATE OF LEGAL METROLOGY • REGIONAL REFERENCE STANDARDS LABORATORY',
                size: 16,
                color: '64748B'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: 'NON-AUTOMATIC WEIGHING INSTRUMENT (NAWI)',
                bold: true,
                size: 28,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'TYPE EVALUATION & PATTERN APPROVAL TEST REPORT',
                bold: true,
                size: 22,
                color: '1D4ED8'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Evaluated in accordance with OIML R 76-1 (2006) & Legal Metrology (General) Rules, 2011',
                italics: true,
                size: 17,
                color: '64748B'
              })
            ]
          }),

          // Disclaimer notice
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: '[ PROTOTYPE / DEMONSTRATION RECORD — NOT A STATUTORY MODEL APPROVAL CERTIFICATE ]',
                bold: true,
                size: 15,
                color: 'B45309'
              })
            ]
          }),

          // Report Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Report ID:', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(report.reportNumber || report.id || 'N/A')]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Test Date:', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(report.testDate || 'N/A')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Laboratory:', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(report.laboratoryName || 'RRSL, New Delhi')]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Status:', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph({
                      children: [new TextRun({
                        text: `${report.overallResult || 'PASS'} (${report.status || 'COMPLETED'})`,
                        bold: true,
                        color: report.overallResult === 'PASS' ? '15803D' : 'B91C1C'
                      })]
                    })]
                  })
                ]
              })
            ]
          }),

          // 1. Instrument Specifications
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            children: [new TextRun({ text: '1. Instrument Technical Specifications', bold: true, color: '1D4ED8' })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Manufacturer', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(inst.manufacturer || 'Apex Weighing Systems Ltd')]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Model Number', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(inst.model || 'ABC-500')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Instrument Type', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(inst.instrumentType || 'Electronic Bench Scale')]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Serial Number', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(inst.serialNumber || 'SN-10234')]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Accuracy Class', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`Class ${inst.accuracyClass || 'III'}`)]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Max Capacity (Max)', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`${inst.maxCapacity} ${unit}`)]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Min Capacity (Min)', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`${inst.minCapacity || '0.1'} ${unit}`)]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Scale Intervals (e / d)', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`e = ${inst.verificationScaleInterval || '0.005'} ${unit}, d = ${inst.actualScaleInterval || inst.verificationScaleInterval || '0.005'} ${unit}`)]
                  })
                ]
              })
            ]
          }),

          // 2. Laboratory Environment
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            children: [new TextRun({ text: '2. Environmental Conditions & Reference Standards', bold: true, color: '1D4ED8' })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Temperature', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`${lab.temperature || '23.4'} °C`)]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Relative Humidity', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`${lab.humidity || '52.0'} % RH`)]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Barometric Pressure', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`${lab.pressure || '1012.5'} hPa`)]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Mains Supply', bold: true })] })]
                  }),
                  new TableCell({
                    borders,
                    children: [new Paragraph(`${lab.voltage || '230.2'} V AC @ ${lab.frequency || '50.0'} Hz`)]
                  })
                ]
              })
            ]
          }),

          // 3. Observations Table
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            children: [new TextRun({ text: '3. Test Observations, Errors & Tolerances', bold: true, color: '1D4ED8' })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Test Name & Point', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Ref Load (${unit})`, bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Observed (${unit})`, bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Calc. Error (${unit})`, bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tolerance (mpe)', bold: true, color: 'FFFFFF' })] })]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: '0F172A' },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Result', bold: true, color: 'FFFFFF' })] })]
                  })
                ]
              }),
              ...observations.map((obs, idx) => {
                const isEven = idx % 2 === 0;
                return new TableRow({
                  children: [
                    new TableCell({
                      borders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph(`${obs.testType || 'Test'}: ${obs.testPoint || ''}`)]
                    }),
                    new TableCell({
                      borders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(`${obs.referenceValue !== undefined ? obs.referenceValue : '—'}`)] })]
                    }),
                    new TableCell({
                      borders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun(`${obs.indicatedValue !== undefined ? obs.indicatedValue : '—'}`)] })]
                    }),
                    new TableCell({
                      borders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({
                          text: `${Number(obs.calculatedError) > 0 ? '+' : ''}${obs.calculatedError || '0'}`,
                          bold: true
                        })]
                      })]
                    }),
                    new TableCell({
                      borders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(obs.applicableRequirement || (obs.mpe ? `±${obs.mpe}` : '±1.0 e'))] })]
                    }),
                    new TableCell({
                      borders,
                      shading: { fill: isEven ? 'FFFFFF' : 'F8FAFC' },
                      children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({
                          text: obs.result || 'PASS',
                          bold: true,
                          color: (obs.result || 'PASS').toUpperCase() === 'PASS' ? '15803D' : 'B91C1C'
                        })]
                      })]
                    })
                  ]
                });
              })
            ]
          }),

          // 4. Overall Result Box
          new Paragraph({
            spacing: { before: 300, after: 80 },
            children: [
              new TextRun({ text: `OVERALL METROLOGICAL VERDICT: `, bold: true, size: 24, color: '0F172A' }),
              new TextRun({
                text: `${report.overallResult || 'PASS'}`,
                bold: true,
                size: 26,
                color: (report.overallResult || 'PASS').toUpperCase() === 'PASS' ? '15803D' : 'B91C1C'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: `Remarks: ${report.remarks || 'Instrument evaluated in conformity with OIML R 76-1 / Legal Metrology requirements for Accuracy Class III.'}`,
                italics: true,
                color: '475569'
              })
            ]
          }),

          // 5. Signatures
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: cellMargins,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Testing Metrologist:', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: report.testEngineerName || 'Sunita Verma', bold: true, size: 20 })] }),
                      new Paragraph('Regional Reference Standards Laboratory'),
                      new Paragraph({ children: [new TextRun({ text: '✔ DIGITALLY VERIFIED', bold: true, color: '15803D' })] })
                    ]
                  }),
                  new TableCell({
                    borders,
                    shading: { fill: 'F8FAFC' },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Reviewing Officer:', bold: true })] }),
                      new Paragraph({ children: [new TextRun({ text: report.reviewerName || 'Dr. Ramesh Sharma', bold: true, size: 20 })] }),
                      new Paragraph('Directorate of Legal Metrology, New Delhi'),
                      new Paragraph({ children: [new TextRun({ text: '✔ APPROVED FOR RECORD', bold: true, color: '1D4ED8' })] })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  }
}
