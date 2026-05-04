import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { login, register } from './api';
import { Toaster, toast } from 'sonner';



export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    if (!isLogin && password !== confirmPassword) return toast.error("Passwords do not match");
    if (!isLogin && password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back!");
      } else {
        await register(email, password);
        toast.success("Account created! Welcome to SmartCV 🎉");
      }
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "6 premium resume templates",
    "AI-powered writing assistant",
    "ATS optimization tools",
    "Pixel-perfect PDF export",
    "Real-time preview",
    "Saved securely to your account",
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      <Toaster richColors position="top-center" />

      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex-col justify-between overflow-hidden">
        {/* Abstract circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SmartCV</span>
        </Link>

        <div className="relative">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            {isLogin ? 'Welcome back!' : 'Build a resume that gets you hired.'}
          </h2>
          <p className="text-white/80 text-lg mb-10">
            {isLogin
              ? 'Sign in to continue building your dream resume.'
              : 'Join thousands of professionals who landed their dream jobs with SmartCV.'}
          </p>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-white/50 text-sm">
          © 2026 SmartCV. All rights reserved.
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-16 lg:px-20 xl:px-32">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg dark:text-white">SmartCV</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {isLogin ? 'Sign in' : 'Create your account'}
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </button>
            </p>
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field – only for signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password – only for signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Repeat your password"
                  />
                </div>
              </div>
            )}

            {/* Terms – only for signup */}
            {!isLogin && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                By creating an account, you agree to our{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">Terms of Service</span>{' '}
                and{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {loading
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : (
                  <>
                    {isLogin ? 'Sign in to SmartCV' : 'Create free account'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )
              }
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
