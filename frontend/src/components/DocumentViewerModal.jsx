import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Printer,
  ExternalLink,
  X,
  Scale,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  FileCode
} from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { reportService } from '../services/reportService.js';

export default function DocumentViewerModal({
  isOpen,
  onClose,
  report,
  initialDocType = 'pdf' // 'pdf' | 'docx'
}) {
  const [docType, setDocType] = useState(initialDocType);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Keep docType in sync when opened with a specific type
  React.useEffect(() => {
    if (initialDocType) {
      setDocType(initialDocType);
    }
    setDownloadError('');
  }, [initialDocType, isOpen]);

  if (!isOpen || !report) return null;

  const inst = report.instrument || {};
  const lab = report.laboratoryConditions || {};
  const observations = report.observations || [];
  const reportId = report.reportNumber || report.id;
  const pdfViewUrl = reportService.getPdfViewUrl(report.id);

  const handleDownload = async (type) => {
    try {
      setDownloading(true);
      setDownloadError('');
      if (type === 'pdf') {
        await reportService.downloadPdf(report.id, reportId);
      } else {
        await reportService.downloadDocx(report.id, reportId);
      }
    } catch (err) {
      console.error('Download error:', err);
      setDownloadError(`Failed to download ${type.toUpperCase()} file. Please try again.`);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenExternal = () => {
    window.open(pdfViewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${docType === 'pdf' ? 'bg-red-600' : 'bg-blue-600'}`}>
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white m-0 tracking-tight">
                  {docType === 'pdf' ? 'Test Certificate PDF Viewer' : 'Word Document (DOCX) Preview'}
                </h3>
                <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {reportId}
                </span>
                <StatusBadge status={report.overallResult || report.status} />
              </div>
              <p className="text-[11px] text-slate-400 m-0 mt-0.5">
                {inst.instrumentType || 'Weighing Instrument'} • {inst.manufacturer || 'Metrology Lab'} ({inst.model || 'Standard'})
              </p>
            </div>
          </div>

          {/* Document Switcher & Close */}
          <div className="flex items-center gap-3">
            {/* Format toggle pills */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setDocType('pdf')}
                className={`px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                  docType === 'pdf'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>PDF Format</span>
              </button>
              <button
                type="button"
                onClick={() => setDocType('docx')}
                className={`px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                  docType === 'docx'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Word (.docx)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              title="Close Viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              {docType === 'pdf' ? 'Official PDF Certificate' : 'Editable Microsoft Word (.docx) Format'}
            </span>
            <span className="text-slate-300">•</span>
            <span>Date: <strong>{report.testDate || 'N/A'}</strong></span>
            <span className="text-slate-300">•</span>
            <span>Class: <strong>Class {inst.accuracyClass || 'III'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {docType === 'pdf' && (
              <button
                type="button"
                onClick={handleOpenExternal}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Open PDF in new tab"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print document"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>

            {docType === 'pdf' ? (
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleDownload('pdf')}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <FileDown size={14} />
                <span>{downloading ? 'Preparing PDF...' : 'Download PDF'}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleDownload('docx')}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Download size={14} />
                <span>{downloading ? 'Preparing DOCX...' : 'Download DOCX'}</span>
              </button>
            )}
          </div>
        </div>

        {downloadError && (
          <div className="px-5 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 font-medium">
            {downloadError}
          </div>
        )}

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70">
          {docType === 'pdf' ? (
            /* PDF Viewer Frame */
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
                <iframe
                  src={pdfViewUrl}
                  title={`PDF Preview: ${reportId}`}
                  className="w-full h-[620px] border-0"
                />
              </div>
              <div className="mt-3 text-center text-xs text-slate-500">
                <span>Can&apos;t view the embedded PDF? </span>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="text-red-700 font-bold hover:underline"
                >
                  Click here to download the PDF file directly
                </button>
                <span> or </span>
                <button
                  onClick={handleOpenExternal}
                  className="text-blue-700 font-bold hover:underline"
                >
                  open in a new browser tab
                </button>.
              </div>
            </div>
          ) : (
            /* Word (DOCX) Document View Page */
            <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-300 p-8 sm:p-12 text-slate-900 font-sans relative">
              {/* Word Header Watermark / Title */}
              <div className="text-center pb-6 border-b-2 border-slate-900">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Government of India • Department of Consumer Affairs
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Directorate of Legal Metrology • Regional Reference Standards Laboratory
                </div>

                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight m-0 uppercase">
                  Non-Automatic Weighing Instrument (NAWI)
                </h1>
                <h2 className="text-sm font-bold text-blue-700 m-0 uppercase tracking-wider mt-1">
                  Type Evaluation & Pattern Verification Test Report (DOCX Preview)
                </h2>
                <div className="text-xs text-slate-500 mt-1 italic">
                  In accordance with OIML Recommendation R 76-1 (2006) & Legal Metrology (General) Rules, 2011
                </div>

                {/* Demonstration Notice */}
                <div className="mt-3 p-2 bg-amber-50 border border-amber-300 rounded text-xs font-bold text-amber-800">
                  ★ PROTOTYPE / DEMONSTRATION RECORD — OIML R 76 WORD (.DOCX) SPECIFICATION ★
                </div>
              </div>

              {/* Administrative Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Report Number</span>
                  <span className="font-mono font-bold text-slate-900">{reportId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Test Date</span>
                  <span className="font-bold text-slate-900">{report.testDate || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Compliance Verdict</span>
                  <StatusBadge status={report.overallResult || report.status} />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Testing Officer</span>
                  <span className="font-bold text-slate-800">{report.testEngineerName || 'Sunita Verma'}</span>
                </div>
              </div>

              {/* Instrument & Applicant Information Table */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Scale size={14} />
                  <span>1. Instrument Technical Specification</span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-700 w-1/4">Manufacturer</td>
                        <td className="p-2.5 text-slate-900 w-1/4">{inst.manufacturer || 'Apex Weighing Systems'}</td>
                        <td className="p-2.5 font-bold text-slate-700 w-1/4">Model</td>
                        <td className="p-2.5 text-slate-900 w-1/4">{inst.model || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2.5 font-bold text-slate-700">Serial Number</td>
                        <td className="p-2.5 font-mono text-slate-900">{inst.serialNumber || 'N/A'}</td>
                        <td className="p-2.5 font-bold text-slate-700">Accuracy Class</td>
                        <td className="p-2.5 font-bold text-blue-800">Class {inst.accuracyClass || 'III'}</td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-700">Max Capacity (Max)</td>
                        <td className="p-2.5 text-slate-900">{inst.maxCapacity} {inst.unit || 'kg'}</td>
                        <td className="p-2.5 font-bold text-slate-700">Min Capacity (Min)</td>
                        <td className="p-2.5 text-slate-900">{inst.minCapacity} {inst.unit || 'kg'}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2.5 font-bold text-slate-700">Verification Interval (e)</td>
                        <td className="p-2.5 text-slate-900">{inst.verificationScaleInterval} {inst.unit || 'kg'}</td>
                        <td className="p-2.5 font-bold text-slate-700">Scale Interval (d)</td>
                        <td className="p-2.5 text-slate-900">{inst.actualScaleInterval} {inst.unit || 'kg'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                  2. Environmental & Test Conditions
                </h3>
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Ambient Temperature:</span>
                    <span className="font-bold text-slate-800">{lab.temperature || '22.4'} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Relative Humidity:</span>
                    <span className="font-bold text-slate-800">{lab.humidity || '54.0'} %</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Barometric Pressure:</span>
                    <span className="font-bold text-slate-800">{lab.pressure || '1013.25'} hPa</span>
                  </div>
                </div>
              </div>

              {/* Test Observations Table */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>3. Examination Records & Verification Observations</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {observations.length} verification steps recorded
                  </span>
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="p-2 font-bold">Test Name</th>
                        <th className="p-2 font-bold">Load ({inst.unit || 'kg'})</th>
                        <th className="p-2 font-bold">Indication ({inst.unit || 'kg'})</th>
                        <th className="p-2 font-bold">Error (E)</th>
                        <th className="p-2 font-bold">MPE (±)</th>
                        <th className="p-2 font-bold text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {observations.length > 0 ? (
                        observations.map((obs, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-medium text-slate-900">
                              {obs.testName || `Test Step ${idx + 1}`}
                            </td>
                            <td className="p-2 font-mono text-slate-700">
                              {obs.appliedLoad !== undefined ? obs.appliedLoad : '—'}
                            </td>
                            <td className="p-2 font-mono text-slate-700">
                              {obs.indicatedValue !== undefined ? obs.indicatedValue : '—'}
                            </td>
                            <td className="p-2 font-mono text-slate-800 font-semibold">
                              {obs.error !== undefined ? obs.error : '—'}
                            </td>
                            <td className="p-2 font-mono text-slate-500">
                              {obs.mpe !== undefined ? `±${obs.mpe}` : '—'}
                            </td>
                            <td className="p-2 text-right">
                              <StatusBadge status={obs.result || 'PASS'} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-400">
                            No observation rows recorded for this instrument.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital Signature & Approval Notice */}
              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-medium">Testing Metrologist:</div>
                  <div className="font-bold text-slate-900 mt-1 text-sm">
                    {report.testEngineerName || 'Sunita Verma'}
                  </div>
                  <div className="text-[11px] text-slate-500">Regional Reference Standards Laboratory</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle size={12} />
                    <span>Digitally Verified & Validated</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-medium">Reviewing Authority / Directorate:</div>
                  <div className="font-bold text-slate-900 mt-1 text-sm">
                    {report.reviewerName || 'Dr. Ramesh Sharma'}
                  </div>
                  <div className="text-[11px] text-slate-500">Directorate of Legal Metrology, New Delhi</div>
                  <div className="text-[11px] text-blue-700 font-semibold mt-2 flex items-center gap-1">
                    <CheckCircle size={12} />
                    <span>Approved for Evaluation Record</span>
                  </div>
                </div>
              </div>

              {/* Bottom Download Helper Bar */}
              <div className="mt-8 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="text-xs text-blue-900">
                  <strong>Need the editable Word (.docx) file?</strong> Click &quot;Download DOCX&quot; above or right here:
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload('docx')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1"
                >
                  <Download size={13} />
                  <span>Download .docx</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
