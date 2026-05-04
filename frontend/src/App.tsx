import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Builder } from './Builder';
import { Auth } from './Auth';
import { TemplateGallery } from './TemplateGallery';
import { logout } from './api';
import { Sparkles, FileText, ArrowRight, Wand2, Shield, Zap, Layers, CheckCircle2, Moon, Sun, LogOut } from 'lucide-react';

function Nav() {
  const [isDark, setIsDark] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-hero shadow-elegant flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight dark:text-white">SmartCV</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">Features</a>
          <a href="#templates" className="hover:text-slate-900 dark:hover:text-white transition">Templates</a>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={toggleDark} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {token ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm transition">
                Dashboard
              </Link>
              <button onClick={logout} className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 transition rounded-full hover:bg-red-50 dark:hover:bg-red-500/10">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth" className="text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium text-sm px-4 py-2">
                Log In
              </Link>
              <Link to="/auth" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-5 py-2 rounded-xl text-sm font-medium shadow-sm transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MiniMock({ variant }: { variant: number }) {
  const colors = ["#4F46E5", "#0f172a", "#0891b2"];
  const c = colors[variant];
  return (
    <div className="h-full w-full p-4 text-[6px] flex gap-2">
      {variant === 0 && (
        <>
          <div className="w-1/3 h-full rounded-md" style={{ background: c }}>
            <div className="p-2 text-white">
              <div className="font-bold text-[8px]">Alex Morgan</div>
              <div className="opacity-80 mt-1">Designer</div>
              <div className="mt-3 space-y-1">
                <div className="h-1 bg-white/30 rounded" />
                <div className="h-1 bg-white/30 rounded w-3/4" />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-2 rounded" style={{ background: c }} />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-5/6" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-4/6" />
            <div className="h-2 mt-2 rounded" style={{ background: c }} />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-5/6" />
          </div>
        </>
      )}
      {variant === 1 && (
        <div className="w-full">
          <div className="text-center pb-2 border-b-2 border-slate-900 dark:border-slate-700">
            <div className="font-bold text-[10px] text-slate-900 dark:text-white">JORDAN LEE</div>
            <div className="text-[6px] text-slate-600 dark:text-slate-400">Software Engineer</div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-1/3 bg-slate-900 dark:bg-slate-700 rounded" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-5/6" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-4/6" />
            <div className="h-1.5 w-1/3 bg-slate-900 dark:bg-slate-700 rounded mt-2" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-5/6" />
          </div>
        </div>
      )}
      {variant === 2 && (
        <div className="w-full">
          <div className="border-l-4 pl-2" style={{ borderColor: c }}>
            <div className="font-bold text-[10px] text-slate-900 dark:text-white">SAM CHEN</div>
            <div className="text-[6px]" style={{ color: c }}>Product Manager</div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-1/4 rounded" style={{ background: c }} />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-5/6" />
            <div className="flex gap-1 mt-2">
              {[1,2,3].map(i => <div key={i} className="h-2 w-6 rounded" style={{ background: `${c}30` }} />)}
            </div>
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded mt-2" />
            <div className="h-1 bg-slate-200 dark:bg-slate-300 rounded w-5/6" />
          </div>
        </div>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 text-center bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 dark:from-indigo-950/20 via-white dark:via-slate-950 to-white dark:to-slate-950" />
      <div className="container mx-auto px-6">
        <h1 className="mt-8 text-6xl md:text-8xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] dark:text-white">
          Build a resume that gets you <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">hired.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Premium templates, AI writing assistant, ATS optimization, and pixel-perfect PDF export — all in one beautiful workspace.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard" className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3.5 rounded-2xl text-base font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
            Start Building Resume <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#templates" className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-2xl text-base font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            View templates
          </a>
        </div>

        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 sm:gap-8 perspective-[2000px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300"
                style={{
                  transform: i === 1 ? "translateY(-24px) scale(1.05)" : `rotate(${i === 0 ? -2 : 2}deg)`,
                }}
              >
                <MiniMock variant={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Wand2, t: "AI Writing Assistant", d: "Generate impactful bullet points and rewrite your experience to sound professional in one click." },
    { icon: Layers, t: "6 Premium Templates", d: "Hand-crafted, recruiter-approved designs for every industry — from creative to corporate." },
    { icon: Shield, t: "ATS Optimization", d: "Built-in ATS scoring and keyword suggestions so you pass automated screens." },
    { icon: FileText, t: "Pixel-Perfect PDF", d: "What you see is what you get. Export in crisp high-resolution PDF that matches the preview exactly." },
    { icon: Zap, t: "Real-Time Preview", d: "Edit and watch your resume update instantly. No re-renders, no surprises." },
    { icon: Sparkles, t: "Drag & Drop", d: "Reorder sections, change fonts, accent colors, and layouts with zero friction." },
  ];
  return (
    <section id="features" className="container mx-auto px-6 py-24 bg-slate-50/30 dark:bg-slate-900 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Features</div>
        <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Everything you need, nothing you don't</h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg font-medium">A focused toolkit to ship a resume you're proud of.</p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.t} className="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <it.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{it.t}</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Templates() {
  const tpls = [
    { n: "Modern Pro", c: "#4F46E5" },
    { n: "Minimal ATS", c: "#0f172a" },
    { n: "Corporate Elite", c: "#1e3a8a" },
    { n: "Creative Edge", c: "#0891b2" },
    { n: "Compact One-Page", c: "#7c3aed" },
    { n: "Executive Premium", c: "#0f766e" },
  ];
  return (
    <section id="templates" className="container mx-auto px-6 py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Templates</div>
        <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">6 premium designs</h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400 text-lg font-medium">Pixel-perfect, recruiter-tested, fully customizable.</p>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-8">
        {tpls.map((t, i) => (
          <div key={t.n} className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
            <div className="aspect-[3/4] bg-slate-50 dark:bg-slate-800 p-6 overflow-hidden flex items-center justify-center">
              <div className="h-full w-full rounded-xl bg-white dark:bg-slate-100 shadow-lg p-4 text-[7px] pointer-events-none">
                <MiniMock variant={i % 3} />
              </div>
            </div>
            <div className="p-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="font-bold text-lg text-slate-900 dark:text-white">{t.n}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Premium · ATS friendly</div>
              </div>
              <div className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ background: t.c }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  const token = localStorage.getItem('token');
  return (
    <section className="container mx-auto px-6 py-24 dark:bg-slate-950 transition-colors duration-300">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-500 p-12 md:p-20 text-center shadow-2xl shadow-indigo-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_50%)]" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ready to land your dream job?</h2>
          <p className="mt-4 text-white/90 text-lg max-w-xl mx-auto font-medium">Build your premium resume in minutes — no signup required.</p>
          {token ? (
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 mt-8 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-2xl text-base font-bold shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link to="/auth" className="inline-flex items-center justify-center gap-2 mt-8 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-2xl text-base font-bold shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Start Building — It's Free <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <div className="mt-8 flex items-center justify-center gap-6 text-white/90 text-sm font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No signup</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> 6 templates</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> AI-powered</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-xl bg-gradient-hero shadow-sm flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">SmartCV</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>© 2026</span>
        </div>
        <div>Crafted with care for your next career move.</div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Nav />
      <Hero />
      <Features />
      <Templates />
      <CTA />
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/builder/:id?" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}
