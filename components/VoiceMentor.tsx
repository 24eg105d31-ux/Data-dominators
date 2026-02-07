
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Brain, Sparkles, Loader2, Volume2, ShieldCheck, Zap } from 'lucide-react';

const VoiceMentor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);

  // Manual encode/decode implementation as per rules
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (!audioContextsRef.current) {
        audioContextsRef.current = {
          input: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 }),
          output: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 }),
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = audioContextsRef.current!.input.createMediaStreamSource(stream);
            const scriptProcessor = audioContextsRef.current!.input.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextsRef.current!.input.destination);
            (sessionRef.current as any) = { scriptProcessor, source };
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = audioContextsRef.current!.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outCtx,
                24000,
                1
              );
              
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Voice session error:', e);
            setError('Connection error. Please try again.');
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
            stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a friendly career mentor. Respond in short, conversational sentences suitable for audio playback. Avoid long paragraphs. Be concise, fast, and natural sounding. Always prioritize listening and guiding the user verbally without visual aids.',
        },
      });

    } catch (err) {
      console.error('Failed to start session:', err);
      setError('Could not access microphone or start AI session.');
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current?.scriptProcessor) {
      sessionRef.current.scriptProcessor.disconnect();
      sessionRef.current.source.disconnect();
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">AI Voice Mentor</h2>
          <p className="text-slate-400 mt-1">Real-time conversational intelligence.</p>
        </div>
        <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${
          isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-white/5 text-slate-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isActive ? 'Live Interaction' : 'Neural Idle'}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          {/* Animated Glow Backdrop */}
          <div className={`absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-violet-600/20 rounded-[3rem] blur-2xl transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="relative glass-card rounded-[3rem] p-12 lg:p-20 overflow-hidden flex flex-col items-center justify-center space-y-12 border-white/10 shadow-2xl bg-slate-900/40">
            
            {/* Visualizer Orb */}
            <div className="relative">
              <div className={`absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full transition-transform duration-1000 ${isActive ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`} />
              
              <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 relative overflow-hidden ${
                isActive ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_60px_rgba(99,102,241,0.4)]' : 'bg-slate-800 border border-white/5'
              }`}>
                {isActive ? (
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-white/80 rounded-full animate-pulse" 
                        style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                ) : isConnecting ? (
                  <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
                ) : (
                  <Mic className="w-16 h-16 text-slate-600" />
                )}
                
                {/* Surface Shine */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="text-center space-y-4 max-w-lg">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {isActive ? "I'm Listening..." : "VidyaGuide Voice"}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                {isActive 
                  ? "Speak naturally. I'm ready to discuss your career, roadmaps, or interview prep in real-time." 
                  : "Experience hands-free guidance. Our AI mentor is optimized for natural spoken conversation."
                }
              </p>
            </div>

            <div className="flex items-center space-x-6">
              {!isActive ? (
                <button 
                  onClick={startSession}
                  disabled={isConnecting}
                  className="group relative px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center space-x-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic size={24} />
                  <span>{isConnecting ? "Establishing Neural Link..." : "Start Voice Session"}</span>
                </button>
              ) : (
                <button 
                  onClick={stopSession}
                  className="px-10 py-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-2xl flex items-center space-x-3 transition-all active:scale-95"
                >
                  <MicOff size={24} />
                  <span>End Session</span>
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-xl border border-red-500/20 text-sm font-medium animate-in slide-in-from-top-2">
                <Volume2 size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-card p-6 rounded-2xl border-white/5 bg-white/[0.01] flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Secure Stream</h4>
              <p className="text-slate-500 text-xs mt-1">Audio is processed in real-time with enterprise encryption.</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border-white/5 bg-white/[0.01] flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">Ultra-Low Latency</h4>
              <p className="text-slate-500 text-xs mt-1">Experience human-like response times through native audio API.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMentor;
