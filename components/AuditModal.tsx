
import React, { useState, useEffect } from 'react';
import { X, Upload, Brain, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Neural Engine...');

  useEffect(() => {
    if (!isOpen) {
      setStep('upload');
      setProgress(0);
    }
  }, [isOpen]);

  const startAnalysis = () => {
    setStep('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep('result'), 500);
      }
      setProgress(p);

      // Status text updates
      if (p > 10) setStatusText('Parsing career markers...');
      if (p > 30) setStatusText('Benchmarking against industry DNA...');
      if (p > 50) setStatusText('Simulating growth trajectories...');
      if (p > 75) setStatusText('Synthesizing optimization roadmap...');
      if (p > 90) setStatusText('Generating final Intelligence report...');
    }, 200);
  };

  const handleFinish = () => {
    const finalScore = 95 + Math.floor(Math.random() * 5); // Realistic range
    onComplete(finalScore);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-xl glass-card rounded-[2rem] overflow-hidden border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10">
          {step === 'upload' && (
            <div className="text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Resume Audit</h2>
                <p className="text-slate-400">Upload your professional DNA for AI decoding.</p>
              </div>

              <div 
                onClick={startAnalysis}
                className="group border-2 border-dashed border-white/10 rounded-3xl p-12 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">Click to upload or drag & drop</p>
                  <p className="text-sm text-slate-500">PDF, DOCX (Max 10MB)</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 text-xs text-slate-500">
                <Brain size={14} className="text-indigo-400" />
                <span>Powered by VidyaGuide Quantum LLM Engine</span>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-10 py-10">
              <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 text-indigo-500 animate-spin opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain size={40} className="text-indigo-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{statusText}</h3>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{Math.round(progress)}% Optimized</p>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="text-center space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                <CheckCircle size={40} />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Audit Complete</h2>
                <p className="text-slate-400">Our AI has successfully mapped your growth trajectory.</p>
              </div>

              <div className="bg-indigo-500/5 rounded-2xl p-6 border border-indigo-500/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold">New Score</p>
                    <p className="text-2xl font-bold text-white">96%</p>
                  </div>
                  <div className="text-left space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold">Improvement</p>
                    <p className="text-2xl font-bold text-emerald-400">+2.4%</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                <span>Apply Optimization</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;
