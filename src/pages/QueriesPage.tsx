import React, { useState } from 'react';
import {
  MessageSquareWarning,
  AlertCircle,
  CheckCircle2,
  Clock,
  Upload,
  Send,
  FileText,
  CornerDownRight,
  Shield,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QueryItem } from '../types';

export const QueriesPage: React.FC = () => {
  const { queries, respondQuery, resolveQuery, raiseQuery, approvals, currentUser } = useApp();

  const [activeQuery, setActiveQuery] = useState<QueryItem | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responseDocName, setResponseDocName] = useState('');
  const [responseDocsList, setResponseDocsList] = useState<string[]>([]);

  // Officer Raise Query Modal state
  const [raiseModalOpen, setRaiseModalOpen] = useState(false);
  const [selectedApprId, setSelectedApprId] = useState(approvals[2]?.id || '');
  const [querySubject, setQuerySubject] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [queryRequiredDocs, setQueryRequiredDocs] = useState('');
  const [queryDueDate, setQueryDueDate] = useState('');

  const handleAddResponseDoc = () => {
    if (responseDocName.trim()) {
      setResponseDocsList((prev) => [...prev, responseDocName.trim()]);
      setResponseDocName('');
    }
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuery || !responseText.trim()) return;
    respondQuery(activeQuery.id, responseText, responseDocsList);
    setResponseText('');
    setResponseDocsList([]);
    setActiveQuery(null);
  };

  const handleRaiseQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appr = approvals.find((a) => a.id === selectedApprId);
    if (!appr || !querySubject.trim()) return;

    raiseQuery({
      approvalId: appr.id,
      approvalName: appr.name,
      department: appr.department,
      subject: querySubject,
      description: queryDescription,
      requiredDocuments: queryRequiredDocs.split(',').map((s) => s.trim()).filter(Boolean),
      dueDate: queryDueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    setQuerySubject('');
    setQueryDescription('');
    setQueryRequiredDocs('');
    setRaiseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Queries & Department Scrutiny
            </h1>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Interactive Scrutiny Channel
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Two-way statutory communication between departmental scrutiny officers and the industrial promoter
          </p>
        </div>

        <button
          onClick={() => setRaiseModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Raise Department Query</span>
        </button>
      </div>

      {/* Query List */}
      <div className="space-y-4">
        {queries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No queries currently raised. All applications are proceeding smoothly.
          </div>
        ) : (
          queries.map((q) => {
            const isPending = q.status === 'PENDING_RESPONSE';
            const isResponded = q.status === 'RESPONDED';
            const isResolved = q.status === 'RESOLVED';

            return (
              <div
                key={q.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                  isPending
                    ? 'border-amber-300 dark:border-amber-800 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Query Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {q.department}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {q.approvalName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse'
                          : isResponded
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {q.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {new Date(q.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  {q.subject}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {q.description}
                </p>

                {/* Required Documents Strip */}
                {q.requiredDocuments && q.requiredDocuments.length > 0 && (
                  <div className="mt-3 text-xs space-y-1">
                    <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                      Required Evidentiary Documents:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {q.requiredDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-teal-600" />
                          <span>{doc}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entrepreneur Response Thread (if responded) */}
                {q.responseText && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-blue-50/40 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                      <span>Submitted Entrepreneur Clarification:</span>
                      <span className="text-[10px] text-blue-600 font-normal">
                        {q.respondedAt ? new Date(q.respondedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {q.responseText}
                    </p>
                    {q.responseDocuments && q.responseDocuments.length > 0 && (
                      <div className="pt-2 text-xs">
                        <span className="font-semibold text-slate-500 text-[11px]">Attached Files:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {q.responseDocuments.map((rd, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[11px] border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono"
                            >
                              📎 {rd}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Department Acceptance Remarks */}
                {q.officerRemarks && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Scrutiny Officer Conclusion: </span>
                      <span>{q.officerRemarks}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Docket ID: {q.id}
                  </span>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <button
                        onClick={() => {
                          setActiveQuery(q);
                          setResponseText('');
                          setResponseDocsList([]);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Formulate Response & Upload</span>
                      </button>
                    )}

                    {isResponded && (
                      <button
                        onClick={() => resolveQuery(q.id, 'Response verified and endorsed by scrutiny cell. Proceeding to site verification.')}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Close Query</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Response Modal */}
      {activeQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">
                  STATUTORY QUERY RESPONSE
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {activeQuery.subject}
                </h3>
              </div>
              <button onClick={() => setActiveQuery(null)} className="text-xs text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Promoter's Formal Clarification
                </label>
                <textarea
                  required
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Detail your compliance justification, technical formula adherence, or vendor certificates provided..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Supporting Evidence Documents
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={responseDocName}
                    onChange={(e) => setResponseDocName(e.target.value)}
                    placeholder="e.g. Chartered_Engineer_Form_CE1.pdf"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddResponseDoc}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    + Add
                  </button>
                </div>
                {responseDocsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {responseDocsList.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 text-[11px] font-mono border border-teal-200 dark:border-teal-800"
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveQuery(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Response to Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officer Raise Query Modal */}
      {raiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Raise Departmental Scrutiny Query
              </h3>
              <button onClick={() => setRaiseModalOpen(false)} className="text-xs text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseQuerySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Approval Application
                </label>
                <select
                  value={selectedApprId}
                  onChange={(e) => setSelectedApprId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {approvals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Statutory Defect
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Requirement of Secondary Acoustic Data Sheet"
                  value={querySubject}
                  onChange={(e) => setQuerySubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Scrutiny Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the exact statutory rule violation or missing verification..."
                  value={queryDescription}
                  onChange={(e) => setQueryDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mandatory Documents Requested (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acoustic_Enclosure_Report.pdf, Form_CE2.pdf"
                  value={queryRequiredDocs}
                  onChange={(e) => setQueryRequiredDocs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setRaiseModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold"
                >
                  Issue Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
