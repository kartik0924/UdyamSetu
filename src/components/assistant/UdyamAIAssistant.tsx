import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldAlert,
  BookOpen,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiService, AIChatResult } from '../../services/aiService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  confidence?: number;
  disclaimer?: string;
  timestamp: string;
}

interface UdyamAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UdyamAIAssistant: React.FC<UdyamAIAssistantProps> = ({ isOpen, onClose }) => {
  const { currentProject, approvals, documents, queries, compliance } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: `Hello! I am **Udyam AI**, your regulation-to-action orchestration assistant. I am analyzing **${currentProject.name}** (₹${currentProject.investmentCr} Cr Food Processing unit in ${currentProject.district}, ${currentProject.state}).\n\nHow can I assist your regulatory journey today?`,
      sources: ['State Industrial Policy (Bihar)', 'National Single Window System (NSWS) Framework'],
      confidence: 0.98,
      disclaimer: 'AI-assisted statutory guidance — verify statutory requirements with the competent authority.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What should I do next for this project?',
    'Why might Pollution Control approval be required?',
    'What documents are missing?',
    'What government support may be relevant?',
    'What compliance is due next?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const projectContext = {
        name: currentProject.name,
        investmentCr: currentProject.investmentCr,
        sector: currentProject.sector,
        state: currentProject.state,
        district: currentProject.district,
        pollutionCategory: currentProject.pollutionCategory,
        submissionReadiness: currentProject.submissionReadiness,
        activeApprovals: approvals.map((a) => ({ name: a.name, status: a.status, dept: a.department })),
        openQueries: queries.filter((q) => q.status === 'PENDING_RESPONSE').map((q) => q.subject),
        missingDocs: documents.filter((d) => d.status === 'MISSING').map((d) => d.name),
        complianceObligations: compliance.map((c) => ({ name: c.obligationName, due: c.nextDueDate })),
      };

      const result: AIChatResult = await aiService.sendAssistantMessage(query, projectContext);

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: result.reply,
        sources: result.sources,
        confidence: result.confidence,
        disclaimer: result.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered a temporary communication glitch with the AI gateway. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        style={{
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-teal-900 text-white flex items-center justify-between border-b border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Udyam AI Assistant</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-400/20 text-teal-300 font-semibold uppercase">
                  Context Aware
                </span>
              </div>
              <div className="text-[11px] text-teal-200/80 truncate max-w-[280px]">
                {currentProject.name} · Readiness {currentProject.submissionReadiness}%
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick prompt strip */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-2 text-[11px] no-scrollbar">
          <span className="text-slate-400 font-medium flex-shrink-0">Suggestions:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 whitespace-nowrap transition-colors flex-shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white dark:bg-teal-600 dark:text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>

                {/* Sources & Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] space-y-1">
                    <div className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      Statutory Sources Cited:
                    </div>
                    {m.sources.map((s, idx) => (
                      <div key={idx} className="font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <span>·</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Disclaimer */}
                {m.disclaimer && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1 flex items-start gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{m.disclaimer}</span>
                  </div>
                )}

                <div
                  className={`text-[9px] text-right mt-1 ${
                    m.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="h-7 w-7 rounded-lg bg-teal-500 flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-3.5 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Udyam AI analyzing regulatory rules...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about approvals, missing documents, schemes, rules..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-1.5 text-center text-[10px] text-slate-400">
            Official statutory approvals are governed by authorized department officers.
          </div>
        </div>
      </div>
    </div>
  );
};
