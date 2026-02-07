
import React, { useState } from 'react';
import { Brain, Sparkles, Loader2, Send, ChevronRight, Target, Briefcase, Award } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const GrowthPath: React.FC = () => {
  const [profile, setProfile] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  const generateStrategy = async () => {
    if (!profile.trim() || loading) return;
    setLoading(true);
    setStrategy(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `User Profile: ${profile}\nCareer Goals: ${goals}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are a career strategist and professional development advisor.
Your task is to design a clear, step-by-step growth path based on a user’s current role, skills, and goals.
Analyze the provided profile and produce a realistic progression plan that balances skill development, experience, and career positioning.
Output format in Markdown:
# Career DNA Strategy

## 1. Current Position Assessment
[Brief analysis of strengths and current market standing]

## 2. Target Career Trajectory
[Short explanation of possible end states and long-term vision]

## 3. 6–12 Month Growth Plan
[Specific milestones and actions for the immediate future]

## 4. 1–3 Year Growth Roadmap
[Mid-term strategic moves and positioning]

## 5. Skills to Develop
### Technical Skills
- [Skill 1]
- [Skill 2]
### Soft Skills
- [Skill 1]
- [Skill 2]

## 6. Experience Milestones
[Projects, roles, or responsibilities to pursue]

## 7. Learning & Resources
[Training focus areas, certifications, or resources]

## 8. Risks & Gaps
[Market factors or personal skill gaps to mitigate]

## 9. Practical Next Actions
- [Immediate step 1]
- [Immediate step 2]

Rules:
Be realistic, not motivational fluff. Tie advice to marketable skills. Prioritize measurable progress. Avoid vague suggestions. Consider industry competitiveness. Do not assume unlimited time or money. If the user provides a resume or job description, align the growth path to it.`,
        }
      });

      setStrategy(response.text || "Strategy generation failed. Please try again.");
    } catch (error) {
      console.error("Error generating strategy:", error);
      setStrategy("An error occurred while synthesizing your roadmap. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Career Strategist</h2>
          <p className="text-slate-400 mt-1">AI-powered professional roadmap synthesis.</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 text-indigo-400 text-sm font-bold uppercase tracking-widest">
          <Sparkles size={16} />
          <span>Quantum Synthesis Engaged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-[2rem] border-white/10 shadow-xl space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Briefcase size={18} />
                <label className="text-sm font-bold uppercase tracking-wider">Current Profile</label>
              </div>
              <textarea 
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                placeholder="Current role, key skills, and brief background..."
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 min-h-[160px] resize-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-violet-400">
                <Target size={18} />
                <label className="text-sm font-bold uppercase tracking-wider">Career Goals</label>
              </div>
              <textarea 
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Where do you want to be in 2-5 years?"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 min-h-[120px] resize-none transition-all"
              />
            </div>

            <button 
              onClick={generateStrategy}
              disabled={!profile.trim() || loading}
              className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-3 font-bold transition-all shadow-lg active:scale-95 ${
                profile.trim() && !loading 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20' 
                  : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Brain size={20} />
                  <span>Generate Growth Path</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl border-white/5 bg-white/[0.02]">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">AI Engine Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Model: Gemini 3 Flash</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1">
                <div className="bg-indigo-500 w-full h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8 min-h-[500px]">
          {!strategy && !loading && (
            <div className="h-full glass-card rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white/[0.01]">
              <div className="w-20 h-20 bg-indigo-500/5 rounded-3xl flex items-center justify-center text-slate-700 border border-white/5">
                <Award size={40} />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-white mb-2">Ready for Analysis</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Provide your profile markers on the left to begin the quantum career synthesis. Our strategist will map your trajectory based on real-time market data.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full glass-card rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center p-12 space-y-8 bg-indigo-500/[0.02]">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                <Loader2 size={64} className="text-indigo-500 animate-spin relative" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-white">Synthesizing DNA Roadmap</h3>
                <p className="text-indigo-300/60 text-sm animate-pulse">Accessing market benchmarks...</p>
              </div>
              <div className="w-64 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-2/3 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          )}

          {strategy && !loading && (
            <div className="glass-card rounded-[2.5rem] border-white/10 p-10 bg-slate-900/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
              <div className="prose prose-invert max-w-none prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mb-8 prose-h2:text-indigo-400 prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-indigo-500/20 prose-h2:pb-2 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
                <div dangerouslySetInnerHTML={{ 
                  __html: formatMarkdown(strategy) 
                }} />
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 uppercase font-bold tracking-[0.2em]">
                <span>Strategy v2.4 Fixed-State Output</span>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                >
                  Export Roadmap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple markdown formatter helper
function formatMarkdown(text: string) {
  return text
    .replace(/^# (.*$)/gim, '<h1 class="text-white font-extrabold text-3xl mb-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-indigo-400 font-bold text-xl mt-8 mb-4 border-b border-indigo-500/20 pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-violet-300 font-bold text-lg mt-6 mb-2">$1</h3>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2 text-slate-300">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-200">$1</strong>')
    .replace(/\n/g, '<br />');
}

export default GrowthPath;
