import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, Fingerprint, Smartphone, ExternalLink } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const [gstin, setGstin] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login logic - Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      
      {/* Left Side: Brand & Mission */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-white to-blue-50 items-center justify-center relative p-12 overflow-hidden">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 opacity-40 -z-10" 
             style={{ backgroundImage: 'radial-gradient(#2D5BFF 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>

        <div className="max-w-md text-center space-y-8 animate-in slide-in-from-left duration-1000">
           <div className="flex items-center justify-center mb-6">
             <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
               <Zap className="text-white fill-current" size={32} />
             </div>
           </div>
           
           <h1 className="text-4xl font-black text-primary leading-tight">
             Empowering 64 Million <br />
             <span className="text-slate-800">Indian MSMEs</span>
           </h1>
           <p className="text-slate-500 font-medium leading-relaxed">
             Securely connect 1000+ data points for instant credit intelligence and zero-friction lender bidding.
           </p>

           <div className="pt-12 grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
                 <ShieldCheck className="text-status-low mb-2" size={20} />
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Fraud Free</p>
                 <p className="text-xs font-bold text-slate-700">Bank-Grade Security</p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-blue-100">
                 <Fingerprint className="text-primary mb-2" size={20} />
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Auth Level</p>
                 <p className="text-xs font-bold text-slate-700">GSTIN Biometric Link</p>
              </div>
           </div>
        </div>
      </div>

      {/* Right Side: Simple Login Card */}
      <div className="flex-1 md:w-1/2 bg-[#f8faff] flex items-center justify-center p-6 relative">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-sm animate-in slide-in-from-bottom duration-700 [animation-delay:200ms]">
          <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10">
             <div className="mb-8">
               <h2 className="text-2xl font-black text-slate-800">Consent Access</h2>
               <p className="text-sm text-slate-500">Sign in to your Credit X-Ray Dashboard</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-6">
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Tax ID (GSTIN)</label>
                   <div className="relative group">
                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="27AABCU1234F1Z5"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 uppercase"
                        required
                      />
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Mobile OTP</label>
                   <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="┬╖┬╖┬╖┬╖┬╖┬╖"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 tracking-[0.5em] placeholder:tracking-normal"
                        required
                      />
                   </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                   <input type="checkbox" id="consent" className="rounded-md border-slate-300 text-primary focus:ring-primary" required />
                   <label htmlFor="consent" className="text-[10px] font-semibold text-slate-500 cursor-pointer">
                      I consent to Data Sharing for Credit Analysis
                   </label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Secure Login
                </button>
             </form>

             <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Support ID: 0042</span>
                <a href="#" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                   View Trust Center <ExternalLink size={10} />
                </a>
             </div>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-slate-400 font-medium">New MSME? <span className="text-primary font-bold cursor-pointer hover:underline">Register Profile</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
