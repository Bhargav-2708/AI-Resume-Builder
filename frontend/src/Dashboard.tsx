import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, Trash2, Pencil, Sparkles, ArrowLeft, Layout, LogOut } from "lucide-react";
import { fetchResumes, deleteResume, logout } from "./api";
import type { ResumeData } from "./resume-types";
import { ResumePreview } from "./ResumePreview";

export function Dashboard() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes().then(setResumes);
  }, []);

  const handleCreate = () => navigate('/templates');

  const handleDelete = async (id: string) => {
    await deleteResume(id);
    setResumes(await fetchResumes());
  };

  const userEmail = localStorage.getItem('user_email') || '';

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg dark:text-white">SmartCV</span>
        </Link>
        <nav className="space-y-1 text-sm font-medium flex-1">
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-2.5 font-semibold">
            <FileText className="h-4 w-4" /> My Resumes
          </div>
          <button onClick={handleCreate} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Layout className="h-4 w-4" /> Template Gallery
          </button>
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </nav>
        {userEmail && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="text-xs text-slate-400 dark:text-slate-500 truncate mb-2 px-1">{userEmail}</div>
            <button onClick={logout} className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">My Resumes</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and edit your saved resumes.</p>
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all">
            <Plus className="h-4 w-4" /> New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No resumes yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Pick a template and create your first professional resume.</p>
            <button onClick={handleCreate} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              Browse Templates
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all overflow-hidden flex flex-col">
                <div
                  className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/builder/${r.id}`)}
                >
                  {/* Live mini preview */}
                  <div className="absolute inset-0 origin-top-left pointer-events-none" style={{ transform: 'scale(0.36)', width: '210mm', height: '297mm' }}>
                    <ResumePreview data={r} />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition bg-white dark:bg-slate-900 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Pencil className="h-3.5 w-3.5" /> Edit Resume
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-[140px]">{r.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{r.template.replace(/-/g, ' ')} · {new Date(r.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
