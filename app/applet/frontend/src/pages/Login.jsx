import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import heroBg from '../assets/images/metrology_login_hero.jpg';
import emblemLogo from '../assets/images/india_emblem_logo.jpg';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
  Scale,
  ShieldCheck,
  FileText,
  Users,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('engineer@example.com');
  const [password, setPassword] = useState('test123');
  const [role, setRole] = useState('TEST_ENGINEER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center lg:justify-between px-4 sm:px-10 md:px-16 lg:px-24 py-8 bg-slate-900 overflow-hidden select-none">
      {/* Background Image: Precision Weighing Scale & Weights */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          filter: 'brightness(0.96)'
        }}
      />

      {/* Soft White Luminous Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.88) 45%, rgba(240, 246, 255, 0.80) 100%)'
        }}
      />

      {/* Subtle India Tricolor Diagonal Wave in Bottom-Right */}
      <div className="absolute -bottom-8 -right-8 pointer-events-none opacity-50 lg:opacity-70 z-10">
        <svg width="420" height="260" viewBox="0 0 420 260" fill="none">
          <path
            d="M20 240 C140 170, 270 260, 420 120"
            stroke="#ff9933"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 250 C160 180, 290 270, 420 140"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M60 260 C180 190, 310 280, 420 160"
            stroke="#138808"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* ========================================================= */}
      {/* LEFT SIDE — LOGIN CARD                                    */}
      {/* ========================================================= */}
      <div className="w-full max-w-[410px] bg-white rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.12)] p-7 sm:p-8 border border-slate-200/90 z-20 my-auto">
        {/* Government Emblem Area */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-2">
            <img
              src={emblemLogo}
              alt="Government of India Emblem"
              className="h-16 w-auto object-contain mix-blend-multiply drop-shadow-sm select-none"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Department Hierarchy */}
          <h2 className="text-[12px] font-bold text-[#0f2444] tracking-wide uppercase m-0 leading-tight">
            Government of India
          </h2>
          <p className="text-[11px] font-semibold text-slate-700 m-0 mt-0.5">
            Department of Consumer Affairs
          </p>
          <p className="text-[11px] font-semibold text-slate-600 m-0">
            Legal Metrology
          </p>

          {/* Title */}
          <div className="mt-3.5">
            <h1 className="text-xl sm:text-[22px] font-black text-[#0f2444] tracking-tight m-0">
              NAWI Test Report System
            </h1>
            <p className="text-xs font-semibold text-slate-700 mt-1 m-0">
              Non-Automatic Weighing Instruments
            </p>
            <p className="text-[11px] font-medium text-slate-500 m-0 mt-0.5">
              Type Evaluation & Test Report
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* FIELD 1: Email / Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={17} />
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email / Username"
              required
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          {/* FIELD 2: Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={17} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* ROLE: Select Role */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Select Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={17} />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none appearance-none transition cursor-pointer font-medium"
              >
                <option value="TEST_ENGINEER">Test Engineer</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="LABORATORY_OFFICER">Laboratory Officer</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            <span>{loading ? 'Logging in...' : 'Login'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* FORGOT PASSWORD */}
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => setForgotMsg(true)}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition font-medium cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {forgotMsg && (
          <div className="mt-2.5 p-2 bg-blue-50 border border-blue-200 rounded-lg text-center text-[11px] text-blue-800 animate-in fade-in">
            For credential recovery, contact your Laboratory Administrator or email <span className="font-mono font-medium">admin@example.com</span>.
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck size={14} className="text-slate-600 flex-shrink-0" />
          <span>Secure Access</span>
          <span className="text-slate-300">|</span>
          <span>Role Based Permissions</span>
          <span className="text-slate-400 text-[11px] font-semibold ml-1">v1.0.0</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE                                                */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-col justify-center pl-10 xl:pl-20 pr-4 max-w-xl z-20">
        {/* Motto Headline */}
        <h1 className="text-4xl xl:text-5xl font-black text-[#0f2444] tracking-tight leading-tight m-0 font-serif">
          “Accurate Weights
          <br />
          for a Fair Tomorrow”
        </h1>

        {/* Tricolor Accent: ORANGE - WHITE - GREEN */}
        <div className="flex items-center gap-2 my-6">
          <div className="h-1.5 w-10 rounded-full bg-[#ff9933] shadow-xs" />
          <div className="h-1.5 w-10 rounded-full bg-white border border-slate-300 shadow-xs" />
          <div className="h-1.5 w-10 rounded-full bg-[#138808] shadow-xs" />
        </div>

        {/* FOUR ICONS */}
        <div className="grid grid-cols-4 gap-4 xl:gap-6 mt-1">
          {/* Accuracy */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#e3f2fd] border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
              <Scale size={26} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-bold text-[#0f2444] mt-2.5">
              Accuracy
            </span>
          </div>

          {/* Compliance */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#e3f2fd] border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
              <ShieldCheck size={26} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-bold text-[#0f2444] mt-2.5">
              Compliance
            </span>
          </div>

          {/* Transparency */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#e3f2fd] border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
              <FileText size={26} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-bold text-[#0f2444] mt-2.5">
              Transparency
            </span>
          </div>

          {/* Consumer Protection */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#e3f2fd] border border-blue-200 text-[#1976d2] flex items-center justify-center shadow-xs">
              <Users size={26} strokeWidth={1.8} />
            </div>
            <span className="text-xs font-bold text-[#0f2444] mt-2.5">
              Consumer Protection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
