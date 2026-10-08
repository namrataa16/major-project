import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Truck, ShieldCheck, Route, ArrowRight, Lock, Mail, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, organization } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('rajesh@rajeshtransport.in');
  const [password, setPassword] = useState('fleetpass123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(email, password);
      showToast(`Welcome back, Rajesh Sharma! (${organization.name})`, 'success');
      navigate('/dashboard');
      setLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Product Intro & Key Differentiator */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Operating System for Fleets</span>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-950/60">
              O
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">ONGO</h1>
              <p className="text-xs text-emerald-400 font-medium">Road Transport Enterprise ERP</p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            "Not just the shortest route.<br />
            <span className="text-emerald-400">The right route for your vehicle."</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
            One centralized platform for fleet dispatch, RTO compliance, expense auditing, and vehicle-aware route intelligence for road transport operators.
          </p>

          <div className="space-y-2.5 text-xs text-slate-300 max-w-md mx-auto lg:mx-0 pt-2 text-left">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>Vehicle-Aware Route Scoring:</strong> Evaluates grade, payload & fuel.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>24 Indian Vehicles Loaded:</strong> Ashok Leyland, Tata Motors & BharatBenz.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>End-to-End Workflows:</strong> Loads, trips, FASTag tolls & GST billing.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Modern Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#0e172e]/90 backdrop-blur-xl p-7 sm:p-9 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Demo Environment
              </span>
              <h3 className="text-lg font-bold text-white">Sign In to Rajesh Transport</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-configured with full operational data for instant evaluation
              </p>
            </div>

            {/* Quick 1-Click Demo Login Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                    RS
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Rajesh Sharma</span>
                    <span className="text-[10px] text-slate-300">Fleet Operations Manager</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60">
                  Ready
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSignIn()}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{loading ? 'Opening Dashboard...' : '1-Click Instant Demo Access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Or Sign In with Credentials
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/30 bg-slate-950"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-emerald-400 text-[11px]">Any password works</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In Normally</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
