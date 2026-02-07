
import React, { useState } from 'react';
import { Brain, Sparkles, Loader2, Send, ChevronRight, FileText, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ResumeReviewer: React.FC = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<string | null>(null);

  const performAudit = async () => {
    if (!resume.trim() || loading) return;
    setLoading(true);
    setReview(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Resume Content: ${resume}\nTarget Job Description (Optional): ${jobDescription}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are a world-class Hiring Consultant and Resume Reviewer.
Analyze the provided resume as if evaluating a real candidate for a competitive role.
Your goals:
Identify strengths
Identify weaknesses
Evaluate clarity and impact
Assess relevance for the target role
Suggest specific improvements

Output format in Markdown:
# Resume Intelligence Report

## 1. Overall Assessment
[2–3 sentences summarizing the candidate's profile and overall readiness]

## 2. Key Strengths
[List 3-5 specific strengths found in the resume]

## 3. Critical Weaknesses
[List 3-5 specific areas for improvement]

## 4. Missing Elements
[Identify key skills or certifications typically expected for this level/role that are absent]

## 5. Suggested Bullet Point Rewrites
### Current:
- [Original bullet point]
### Optimized:
- [Stronger, impact-focused rewrite using metrics]

## 6. ATS & Market Optimization Tips
[Advice on keywords, formatting, and industry alignment]

## 7. Professional Score
### **Score: [X]/10**
**Justification:** [Brief reasoning for the score]

Rules:
Be direct but professional. Give actionable feedback, not generic advice. Focus on measurable impact and results. Prefer concrete language over vague praise. Do not invent experience that isn’t present. If a job description is provided, compare the resume against it specifically.`,
        }
      });

      setReview(response.text || "Audit failed. Please try again.");
    } catch (error) {
      console.error("Error performing audit:", error);
      setReview("An error occurred during the neural audit. Ensure your API key is valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Resume Reviewer</h2>
          <p className="text-slate-400 mt-1">Hiring Consultant Grade Analysis & Optimization.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-violet-500/10 px-4 py-2 rounded-xl border border-violet-500/20 text-violet-400 text-sm font-bold uppercase tracking-widest">
          <Brain size={16} />
          <span>Consultant Mode Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-[2rem] border-white/10 shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-400">
                <FileText size={18} />
                <label className="text-sm font-bold uppercase tracking-wider">Your Resume</label>
              </div>
              <textarea 
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume content here (plain text)..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 min-h-[250px] resize-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-violet-400">
                <Target size={18} />
                <label className="text-sm font-bold uppercase tracking-wider">Job Description (Optional)</label>
              </div>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description to check for gaps..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 min-h-[150px] resize-none transition-all"
              />
            </div>

            <button 
              onClick={performAudit}
              disabled={!resume.trim() || loading}
              className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 font-bold transition-all shadow-lg active:scale-95 ${
                resume.trim() && !loading 
                  ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-violet-600/20' 
                  : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Analyzing DNA...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Analyze Resume</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
             <div className="flex items-center space-x-3 text-xs text-slate-500">
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Confidential Career Assessment</span>
             </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 min-h-[600px]">
          {!review && !loading && (
            <div className="h-full glass-card rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white/[0.01]">
              <div className="w-24 h-24 bg-violet-500/5 rounded-full flex items-center justify-center text-slate-700 border border-white/5">
                <FileText size={48} />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-white mb-2">Awaiting Intelligence</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Upload your resume content to receive a deep-dive audit from our AI Hiring Consultant. We evaluate your profile against current industry standards and ATS algorithms.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full glass-card rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center p-12 space-y-8 bg-violet-500/[0.02]">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-20 animate-pulse"></div>
                <Loader2 size={64} className="text-violet-500 animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Consultant Review in Progress</h3>
                <p className="text-violet-300/60 text-sm animate-pulse">Running semantic analysis on professional markers...</p>
              </div>
              <div className="w-72 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          )}

          {review && !loading && (
            <div className="glass-card rounded-[2.5rem] border-white/10 p-10 bg-slate-900/30 shadow-2xl animate-in slide-in-from-right-4 duration-700">
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: formatMarkdown(review) 
                }} />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle size={18} />
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Analysis Validated</span>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-xs font-bold uppercase tracking-widest"
                >
                  Download PDF Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Markdown helper (extended for resume specific styles)
function formatMarkdown(text: string) {
  return text
    .replace(/^# (.*$)/gim, '<h1 class="text-white font-extrabold text-3xl mb-8 border-b border-white/10 pb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-violet-400 font-bold text-xl mt-10 mb-4 flex items-center">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-indigo-300 font-bold text-lg mt-6 mb-2">$1</h3>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2 text-slate-300">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white bg-white/5 px-1 rounded">$1</strong>')
    .replace(/\n/g, '<br />');
}

export default ResumeReviewer;
