
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Brain, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your VidyaGuide AI mentor. Ready to map out your next career move? What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Simulate real thinking time or use API
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are VidyaGuide AI, a professional career mentor dashboard. You provide concise, insightful, and motivating career advice. Use a modern, slightly futuristic tone.",
        }
      });
      
      const aiText = response.text || "I'm having trouble processing that right now. Could you rephrase?";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      // Fallback for demo if API fails
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "That's an excellent question. Based on current market trends, focusing on cross-functional AI integration and strategic leadership would be your highest-leverage path forward." 
        }]);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-lg flex flex-col bg-slate-950 border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Mentorship</h3>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Expert Session Live</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[85%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} className="text-indigo-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30' 
                  : 'bg-white/5 text-slate-300 border border-white/10'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-xs text-slate-500 italic">VidyaGuide is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 bg-slate-950 border-t border-white/5">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about roadmaps, skills, or interview prep..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
              input.trim() && !isLoading ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-600'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-4 text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest">
          AI guidance is probabilistic. Review roadmap suggestions.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
