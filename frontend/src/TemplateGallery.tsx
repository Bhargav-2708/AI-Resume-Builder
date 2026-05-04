import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import type { ResumeData, TemplateId } from './resume-types';
import { ResumePreview } from './ResumePreview';
import { saveResume } from './api';

const TEMPLATES: { id: TemplateId; name: string; description: string; accentColor: string; tag: string }[] = [
  { id: 'modern-pro',       name: 'Modern Pro',       description: 'Bold sidebar layout with vibrant accent color. Perfect for tech & creative roles.',        accentColor: '#4F46E5', tag: 'Most Popular' },
  { id: 'minimal-ats',      name: 'Minimal ATS',      description: 'Clean, keyword-rich format designed to pass Applicant Tracking Systems.',                   accentColor: '#0f172a', tag: 'ATS Friendly' },
  { id: 'corporate-elite',  name: 'Corporate Elite',  description: 'Formal serif layout centered for executive, legal, or finance professionals.',              accentColor: '#1e3a8a', tag: 'Executive' },
  { id: 'creative-edge',    name: 'Creative Edge',    description: 'Bold left-border accent with strong typography — great for designers & marketers.',         accentColor: '#0891b2', tag: 'Creative' },
  { id: 'compact-one-page', name: 'Compact One-Page', description: 'Dense two-column format that fits everything on one page. Ideal for early-career.',        accentColor: '#7c3aed', tag: 'One Page' },
  { id: 'executive-premium',name: 'Executive Premium','description': 'Spacious, elegant, and minimal — built for senior leaders and C-suite professionals.',  accentColor: '#0f766e', tag: 'Premium' },
];

function makeSampleResume(templateId: TemplateId, accentColor: string): ResumeData {
  const samplesByTemplate: Record<TemplateId, Partial<ResumeData>> = {
    'modern-pro': {
      personal: { fullName: 'Alex Morgan', title: 'Senior Product Designer', email: 'alex@design.co', phone: '+1 555 100 2000', location: 'San Francisco, CA', website: 'alexmorgan.design', summary: 'Award-winning designer with 8+ years crafting digital products used by millions. Passionate about systems thinking and pixel-perfect execution.' },
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'React', 'CSS', 'Leadership'],
    },
    'minimal-ats': {
      personal: { fullName: 'Jordan Lee', title: 'Software Engineer', email: 'jordan.lee@dev.io', phone: '+1 555 200 3000', location: 'Austin, TX', website: 'github.com/jordanlee', summary: 'Full-stack engineer specializing in scalable web applications. Strong focus on performance, code quality, and developer experience.' },
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'CI/CD'],
    },
    'corporate-elite': {
      personal: { fullName: 'Victoria Chen', title: 'Investment Banking Analyst', email: 'v.chen@capitalgroup.com', phone: '+1 555 300 4000', location: 'New York, NY', website: 'linkedin.com/in/victoriachen', summary: 'Detail-oriented finance professional with expertise in M&A transactions, financial modeling, and strategic advisory for Fortune 500 clients.' },
      skills: ['Financial Modeling', 'Valuation', 'M&A', 'Bloomberg', 'Excel', 'PowerPoint', 'Due Diligence', 'DCF Analysis'],
    },
    'creative-edge': {
      personal: { fullName: 'Sam Rivera', title: 'Brand & Marketing Director', email: 'sam@brandstudio.co', phone: '+1 555 400 5000', location: 'Los Angeles, CA', website: 'samrivera.co', summary: 'Creative director with a decade of experience building memorable brands. Led campaigns reaching 50M+ users across global markets.' },
      skills: ['Brand Strategy', 'Adobe Creative Suite', 'Copywriting', 'Campaign Management', 'Social Media', 'Analytics', 'Team Leadership'],
    },
    'compact-one-page': {
      personal: { fullName: 'Priya Patel', title: 'Data Analyst', email: 'priya.patel@analytics.io', phone: '+1 555 500 6000', location: 'Chicago, IL', website: 'linkedin.com/in/priyapatel', summary: 'Data analyst with expertise in transforming raw data into actionable insights. Proficient in Python, SQL, and data visualization tools.' },
      skills: ['Python', 'SQL', 'Tableau', 'Power BI', 'Pandas', 'Excel', 'Statistics', 'Machine Learning'],
    },
    'executive-premium': {
      personal: { fullName: 'Michael Hartmann', title: 'Chief Technology Officer', email: 'm.hartmann@techcorp.com', phone: '+1 555 600 7000', location: 'Seattle, WA', website: 'linkedin.com/in/mhartmann', summary: 'Visionary technology executive with 20+ years leading engineering organizations. Scaled teams from 10 to 500+ engineers across 3 successful IPOs.' },
      skills: ['Executive Leadership', 'Strategic Planning', 'Cloud Architecture', 'Team Building', 'M&A Integration', 'Board Communication'],
    },
  };

  const commonExperience: ResumeData['experience'] = [
    { id: '1', role: 'Senior Position', company: 'Top Company Inc.', startDate: 'Jan 2021', endDate: 'Present', location: 'Remote', bullets: ['Led cross-functional team of 12 to deliver $2M product initiative on time', 'Increased key metric by 40% through strategic initiatives and process improvements', 'Mentored 5 junior team members, 3 of whom received promotions'] },
    { id: '2', role: 'Mid-Level Role', company: 'Growth Startup', startDate: 'Mar 2018', endDate: 'Dec 2020', location: 'New York, NY', bullets: ['Built and shipped core product features used by 500K+ users', 'Collaborated with stakeholders to define roadmap and KPIs', 'Reduced operational costs by 25% through automation'] },
  ];

  const commonEducation: ResumeData['education'] = [
    { id: '1', school: 'University of California, Berkeley', degree: 'B.S. Computer Science', startDate: '2014', endDate: '2018', details: 'GPA: 3.8 / 4.0 · Dean\'s List · CS Honor Society' },
  ];

  const commonProjects: ResumeData['projects'] = [
    { id: '1', name: 'Open Source Tool', link: 'github.com/project', description: 'Built and maintained an open-source developer tool with 2,000+ GitHub stars and active community.', tech: 'TypeScript, React, Node.js' },
  ];

  const specific = samplesByTemplate[templateId];

  return {
    id: crypto.randomUUID(),
    name: `${specific.personal?.fullName?.split(' ')[0]}'s Resume`,
    updatedAt: new Date().toISOString(),
    template: templateId,
    accentColor,
    font: templateId === 'corporate-elite' ? 'serif' : 'inter',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
    personal: { fullName: '', title: '', email: '', phone: '', location: '', website: '', summary: '', ...specific.personal },
    experience: commonExperience,
    education: commonEducation,
    skills: specific.skills || [],
    projects: commonProjects,
  };
}

export function TemplateGallery() {
  const [selected, setSelected] = useState<TemplateId | null>(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleUseTemplate = async (t: typeof TEMPLATES[0]) => {
    setCreating(true);
    const resume = makeSampleResume(t.id, t.accentColor);
    await saveResume(resume);
    navigate(`/builder/${resume.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Choose a Template</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">6 professional templates · Fully customizable</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Pick your perfect template</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Each template is professionally designed and fully customizable. Change colors, fonts, and content in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {TEMPLATES.map((t) => {
            const sampleData = makeSampleResume(t.id, t.accentColor);
            const isSelected = selected === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`group cursor-pointer rounded-3xl border-2 overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/10'
                } bg-white dark:bg-slate-900`}
              >
                {/* Template Preview */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700">
                      {t.tag}
                    </span>
                  </div>
                  {/* Check mark if selected */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {/* Live mini preview */}
                  <div
                    className="absolute inset-0 origin-top-left pointer-events-none"
                    style={{ transform: 'scale(0.38)', width: '210mm', height: '297mm' }}
                  >
                    <ResumePreview data={sampleData} />
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t.name}</h3>
                    <div className="h-5 w-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ background: t.accentColor }} />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.description}</p>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleUseTemplate(t); }}
                    disabled={creating}
                    className={`mt-4 w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {creating ? 'Creating...' : isSelected ? <>Use this template <ArrowRight className="h-4 w-4" /></> : 'Select template'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
