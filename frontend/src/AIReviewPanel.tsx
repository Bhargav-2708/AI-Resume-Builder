import { useState } from "react";
import { Sparkles, Loader2, X, CheckCircle2, AlertTriangle, AlertCircle, Lightbulb, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import type { ResumeData } from "./resume-types";
import { reviewResume, type ReviewResult } from "./aiReviewer";

interface Props {
  data: ResumeData;
  onClose: () => void;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-slate-900 dark:text-white">{score}</span>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center">{label}</span>
    </div>
  );
}

function IssueCard({ issue }: { issue: ReviewResult["issues"][0] }) {
  const [open, setOpen] = useState(false);
  const cfg = {
    error:   { icon: AlertCircle,   bg: "bg-red-50 dark:bg-red-900/20",     border: "border-red-200 dark:border-red-800",     text: "text-red-600 dark:text-red-400",     badge: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",     label: "Error"   },
    warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400", label: "Warning" },
    tip:     { icon: Lightbulb,     bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-800",   text: "text-blue-600 dark:text-blue-400",   badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",   label: "Tip"     },
  }[issue.type];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border ${cfg.bg} ${cfg.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-3 text-left"
      >
        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cfg.badge}`}>{cfg.label}</span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{issue.section}</span>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1 leading-snug">{issue.message}</p>
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0 border-t border-current/10">
          <div className="flex items-start gap-2 mt-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{issue.fix}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function AIReviewPanel({ data, onClose }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "error" | "warning" | "tip">("all");

  const handleAnalyze = async () => {
    setStatus("loading");
    const r = await reviewResume(data);
    setResult(r);
    setStatus("done");
  };

  const scoreColor = (s: number) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  const filteredIssues = result?.issues.filter(i => activeFilter === "all" || i.type === activeFilter) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">AI CV Review</div>
              <div className="text-[11px] text-slate-400">Powered by SmartCV AI</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-6 py-16">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Analyze your CV</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our AI will scan your resume for errors, missing content, weak language, and ATS compatibility — giving you a full score and specific fix suggestions.
                </p>
              </div>
              <div className="space-y-2 text-left w-full">
                {["ATS compatibility score", "Section-by-section analysis", "Weak language detection", "Quantification suggestions", "Specific fix recommendations"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAnalyze}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Analyze My CV
              </button>
            </div>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16">
              <div className="relative">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <Loader2 className="absolute -bottom-2 -right-2 h-7 w-7 text-indigo-500 animate-spin bg-white dark:bg-slate-900 rounded-full p-1" />
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900 dark:text-white">Analyzing your CV…</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Checking content, ATS keywords, and impact language</p>
              </div>
              <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[progress_1.8s_ease-in-out_forwards]" style={{ animation: "width 1.8s ease forwards", width: "100%" }} />
              </div>
            </div>
          )}

          {status === "done" && result && (
            <div className="p-5 space-y-6">
              {/* Overall Score */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {(() => {
                      const r2 = 34;
                      const c = 2 * Math.PI * r2;
                      const off = c - (result.overallScore / 100) * c;
                      const color = scoreColor(result.overallScore);
                      return (
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r={r2} fill="none" stroke="#e2e8f0" strokeWidth="7" />
                          <circle cx="40" cy="40" r={r2} fill="none" stroke={color} strokeWidth="7" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
                        </svg>
                      );
                    })()}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-900 dark:text-white">{result.overallScore}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Overall Score</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{result.summary}</p>
                  </div>
                </div>
                <div className="flex justify-around mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <ScoreRing score={result.atsScore} label="ATS" color={scoreColor(result.atsScore)} />
                  <ScoreRing score={result.impactScore} label="Impact" color={scoreColor(result.impactScore)} />
                  <ScoreRing score={result.completenessScore} label="Complete" color={scoreColor(result.completenessScore)} />
                </div>
              </div>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">✅ Strengths</h4>
                  <div className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                    🔍 Issues ({result.issues.length})
                  </h4>
                  <div className="flex gap-1">
                    {(["all", "error", "warning", "tip"] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition capitalize ${
                          activeFilter === f
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {f === "all" ? `All (${result.issues.length})` : f === "error" ? `Errors (${result.issues.filter(i => i.type === "error").length})` : f === "warning" ? `Warnings (${result.issues.filter(i => i.type === "warning").length})` : `Tips (${result.issues.filter(i => i.type === "tip").length})`}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredIssues.length === 0 ? (
                  <div className="text-center py-6 text-sm text-slate-400">No {activeFilter === "all" ? "" : activeFilter} issues found!</div>
                ) : (
                  <div className="space-y-2">
                    {filteredIssues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
                  </div>
                )}
              </div>

              {/* Re-analyze button */}
              <button
                onClick={handleAnalyze}
                className="w-full py-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
              >
                <Sparkles className="h-4 w-4" />
                Re-analyze CV
              </button>

              <p className="text-center text-[10px] text-slate-400 pb-2">
                🔒 Gemini AI integration active — professional CV analysis enabled
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
