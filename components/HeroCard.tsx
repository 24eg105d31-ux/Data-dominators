
import React from 'react';
import { Sparkles, ShieldCheck, Activity, Compass, ArrowRight, FileSearch, Mic } from 'lucide-react';

interface HeroCardProps {
  onNavigateGrowth: () => void;
  onNavigateAudit: () => void;
  onNavigateVoice: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ onNavigateGrowth, onNavigateAudit, onNavigateVoice }) => {
  return (
    <div className="relative group w-full">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      
      <div className="relative gradient-hero rounded-[2rem] p-8 lg:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between neon-glow border border-white/5">
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[10%] w-[30%] h-[30%] bg-indigo-400/10 blur-[80px] rounded-full"></div>

        {/* Left Content */}
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 transition-transform hover:scale-105 duration-300 cursor-default">
            <Activity size={14} className="text-indigo-300 animate-pulse" />
            <span className="text-[11px] font-bold text-indigo-100 uppercase tracking-[0.2em]">Live Optimization Active</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Level up your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">Career DNA</span>
          </h1>

          <p className="text-lg text-indigo-100/70 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
            VidyaGuide AI decodes industry trends and analyzes your professional markers to craft 
            a personalized growth roadmap. Secure, intelligent, and optimized for your success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onNavigateVoice}
              className="group relative px-8 py-4 bg-white text-indigo-900 font-bold rounded-2xl flex items-center space-x-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/40 w-full sm:w-auto"
            >
              <Mic size={20} className="text-indigo-600" />
              <span>Voice Mentor</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={onNavigateAudit}
              className="group px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center space-x-3 transition-all hover:bg-white/5 hover:border-white/40 active:scale-95 w-full sm:w-auto"
            >
              <FileSearch size={20} className="text-indigo-200" />
              <span>Resume Audit</span>
            </button>

            <button 
              onClick={onNavigateGrowth}
              className="group px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center space-x-3 transition-all hover:bg-white/5 hover:border-white/40 active:scale-95 w-full sm:w-auto"
            >
              <Compass size={20} className="text-indigo-200" />
              <span>Growth Path</span>
            </button>
          </div>
        </div>

        {/* Right Glass Panel (Decorative) */}
        <div className="relative z-10 mt-12 lg:mt-0 w-full lg:w-auto">
          <div className="animate-float">
            <div className="glass-card p-8 rounded-3xl w-full sm:w-80 lg:w-96 shadow-2xl relative overflow-hidden group/card border-white/20">
              {/* Inner Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 group-hover/card:scale-110 transition-transform duration-500">
                  <ShieldCheck size={40} className="text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Neural Guard™</h3>
                <p className="text-sm text-indigo-100/60 mb-6 leading-relaxed">
                  Your career data is encrypted and anonymized using enterprise-grade LLM security protocols.
                </p>

                <div className="w-full space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <div className="w-20 h-2 bg-white/10 rounded-full"></div>
                      </div>
                      <div className="w-8 h-2 bg-indigo-400/20 rounded-full"></div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center space-x-2 text-[10px] text-indigo-300 font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  <Sparkles size={12} />
                  <span>Privacy First AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroCard;
