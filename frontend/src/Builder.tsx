import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchResumes, saveResume } from "./api";
import type { ResumeData } from "./resume-types";
import { ResumePreview } from "./ResumePreview";
import { AIReviewPanel } from "./AIReviewPanel";
import { ArrowLeft, Download, Loader2, Save, Plus, Trash2, Wand2, Sparkles } from "lucide-react";
import html2pdf from "html2pdf.js";

export function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeData | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchResumes().then(resumes => {
      const r = resumes.find(x => x.id === id);
      if (r) setData(r);
      else navigate("/dashboard");
    });
  }, [id, navigate]);

  // Auto-save
  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => saveResume(data), 1000);
    return () => clearTimeout(t);
  }, [data]);

  const update = (fn: (d: ResumeData) => ResumeData) => setData((prev) => prev ? fn({ ...prev }) : prev);

  const handleExport = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const element = previewRef.current.querySelector(".resume-page") as HTMLElement;
      if (!element) throw new Error("Resume element not found");
      await html2pdf()
        .set({
          margin: 0,
          filename: `${data?.name || "resume"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {showReview && <AIReviewPanel data={data} onClose={() => setShowReview(false)} />}

      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-14 flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <input
            value={data.name}
            onChange={(e) => update(d => ({ ...d, name: e.target.value }))}
            className="font-bold text-slate-900 dark:text-white outline-none bg-transparent text-sm w-48 truncate"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReview(true)}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="h-4 w-4" /> AI Review
          </button>
          <button onClick={() => saveResume(data)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">
            <Save className="h-4 w-4" /> Save
          </button>
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Export PDF
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[450px] overflow-y-auto border-r bg-card/50 p-6 space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4 text-slate-900">Personal Info</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label><input className="w-full p-2 border rounded-lg text-sm" value={data.personal.fullName} onChange={e => update(d => ({ ...d, personal: { ...d.personal, fullName: e.target.value } }))} /></div>
              <div><label className="text-xs font-medium text-slate-500 mb-1 block">Job Title</label><input className="w-full p-2 border rounded-lg text-sm" value={data.personal.title} onChange={e => update(d => ({ ...d, personal: { ...d.personal, title: e.target.value } }))} /></div>
              <div><label className="text-xs font-medium text-slate-500 mb-1 block">Email</label><input className="w-full p-2 border rounded-lg text-sm" value={data.personal.email} onChange={e => update(d => ({ ...d, personal: { ...d.personal, email: e.target.value } }))} /></div>
              <div><label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label><input className="w-full p-2 border rounded-lg text-sm" value={data.personal.phone} onChange={e => update(d => ({ ...d, personal: { ...d.personal, phone: e.target.value } }))} /></div>
              <div className="col-span-2"><label className="text-xs font-medium text-slate-500 mb-1 block">Summary</label><textarea rows={3} className="w-full p-2 border rounded-lg text-sm" value={data.personal.summary} onChange={e => update(d => ({ ...d, personal: { ...d.personal, summary: e.target.value } }))} /></div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Design</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Template</label>
                <select className="w-full p-2.5 border rounded-lg text-sm font-medium bg-card" value={data.template} onChange={e => update(d => ({ ...d, template: e.target.value as any }))}>
                  <option value="modern-pro">Modern Pro</option>
                  <option value="minimal-ats">Minimal ATS</option>
                  <option value="corporate-elite">Corporate Elite</option>
                  <option value="creative-edge">Creative Edge</option>
                  <option value="compact-one-page">Compact One-Page</option>
                  <option value="executive-premium">Executive Premium</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-medium text-slate-500 mb-2 block">Accent Color</label>
                   <input type="color" value={data.accentColor} onChange={e => update(d => ({ ...d, accentColor: e.target.value }))} className="w-full h-10 rounded-lg cursor-pointer" />
                 </div>
                 <div>
                   <label className="text-xs font-medium text-slate-500 mb-2 block">Typography</label>
                   <select className="w-full p-2 border rounded-lg text-sm bg-card h-10" value={data.font} onChange={e => update(d => ({ ...d, font: e.target.value as any }))}>
                     <option value="inter">Modern Sans (Inter)</option>
                     <option value="poppins">Friendly Sans (Poppins)</option>
                     <option value="serif">Classic (Serif)</option>
                   </select>
                 </div>
              </div>
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
              <button onClick={() => update(d => ({ ...d, experience: [...d.experience, { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", location: "", bullets: [""] }] }))} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-xl bg-card space-y-3 relative group">
                  <button onClick={() => update(d => ({ ...d, experience: d.experience.filter(e => e.id !== exp.id) }))} className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-4 w-4" /></button>
                  <input className="w-full p-2 border rounded-lg text-sm font-medium" placeholder="Role / Job Title" value={exp.role} onChange={e => update(d => ({ ...d, experience: d.experience.map(x => x.id === exp.id ? { ...x, role: e.target.value } : x) }))} />
                  <input className="w-full p-2 border rounded-lg text-sm" placeholder="Company Name" value={exp.company} onChange={e => update(d => ({ ...d, experience: d.experience.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x) }))} />
                  <div className="flex gap-2">
                     <input className="w-full p-2 border rounded-lg text-sm" placeholder="Start Date" value={exp.startDate} onChange={e => update(d => ({ ...d, experience: d.experience.map(x => x.id === exp.id ? { ...x, startDate: e.target.value } : x) }))} />
                     <input className="w-full p-2 border rounded-lg text-sm" placeholder="End Date" value={exp.endDate} onChange={e => update(d => ({ ...d, experience: d.experience.map(x => x.id === exp.id ? { ...x, endDate: e.target.value } : x) }))} />
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-500 block">Responsibilities / Achievements</label>
                      <button onClick={() => alert("AI Improvement simulated!")} className="text-xs text-primary font-medium flex items-center border border-primary/20 bg-primary/5 px-2 py-1 rounded-md hover:bg-primary/10 transition">
                        <Wand2 className="h-3 w-3 mr-1.5" /> Improve with AI
                      </button>
                    </div>
                    {exp.bullets.map((b, bi) => (
                      <input key={bi} className="w-full p-2 border rounded-lg text-sm" placeholder="Added a new feature..." value={b} onChange={e => update(d => ({ ...d, experience: d.experience.map(x => x.id === exp.id ? { ...x, bullets: x.bullets.map((bx, bxi) => bxi === bi ? e.target.value : bx) } : x) }))} />
                    ))}
                    <button onClick={() => update(d => ({ ...d, experience: d.experience.map(x => x.id === exp.id ? { ...x, bullets: [...x.bullets, ""] } : x) }))} className="text-xs text-primary font-medium flex items-center mt-1"><Plus className="h-3 w-3 mr-1" /> Add Bullet</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Education</h2>
              <button onClick={() => update(d => ({ ...d, education: [...d.education, { id: crypto.randomUUID(), school: "", degree: "", startDate: "", endDate: "", details: "" }] }))} className="text-primary hover:bg-primary/10 p-1.5 rounded-lg"><Plus className="h-4 w-4" /></button>
            </div>
             <div className="space-y-4">
               {data.education.map((edu) => (
                 <div key={edu.id} className="p-4 border rounded-xl bg-card space-y-3 relative group">
                    <button onClick={() => update(d => ({ ...d, education: d.education.filter(e => e.id !== edu.id) }))} className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-4 w-4" /></button>
                    <input className="w-full p-2 border rounded-lg text-sm font-medium" placeholder="School Name" value={edu.school} onChange={e => update(d => ({ ...d, education: d.education.map(x => x.id === edu.id ? { ...x, school: e.target.value } : x) }))} />
                    <input className="w-full p-2 border rounded-lg text-sm" placeholder="Degree / Major" value={edu.degree} onChange={e => update(d => ({ ...d, education: d.education.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x) }))} />
                    <div className="flex gap-2">
                     <input className="w-full p-2 border rounded-lg text-sm" placeholder="Start" value={edu.startDate} onChange={e => update(d => ({ ...d, education: d.education.map(x => x.id === edu.id ? { ...x, startDate: e.target.value } : x) }))} />
                     <input className="w-full p-2 border rounded-lg text-sm" placeholder="End" value={edu.endDate} onChange={e => update(d => ({ ...d, education: d.education.map(x => x.id === edu.id ? { ...x, endDate: e.target.value } : x) }))} />
                  </div>
                 </div>
               ))}
             </div>
          </section>

          <section>
             <h2 className="text-lg font-semibold mb-4 text-slate-900">Skills</h2>
             <textarea className="w-full p-3 border rounded-xl text-sm" rows={4} placeholder="Comma separated skills (e.g. React, Node.js, Python)" value={data.skills.join(", ")} onChange={e => update(d => ({ ...d, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
          </section>
        </aside>
        <main className="flex-1 bg-slate-100/50 p-8 overflow-y-auto flex justify-center items-start">
           <div ref={previewRef} className="origin-top transform scale-[0.9] lg:scale-100 transition-transform">
             <ResumePreview data={data} />
           </div>
        </main>
      </div>
    </div>
  );
}
