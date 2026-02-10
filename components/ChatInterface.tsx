
import React, { useState, useRef, useEffect } from 'react';
import { Message, Challenge, GroundingLink, ScanResult, Difficulty } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onRunScan: () => void;
  isThinking: boolean;
  challenge: Challenge;
}

const LethalityBadge: React.FC<{ difficulty?: Difficulty }> = ({ difficulty }) => {
  const colors = {
    Easy: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    Medium: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
    Hard: 'text-orange-400 border-orange-400/20 bg-orange-400/5',
    Extreme: 'text-red-500 border-red-500/40 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    Unknown: 'text-slate-500 border-slate-500/20 bg-slate-500/5'
  };
  const level = difficulty || 'Unknown';
  return (
    <span className={`px-4 py-1 raptor-btn text-[9px] font-black border ${colors[level]} italic`}>
      {level.toUpperCase()}_THREAT
    </span>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onRunScan, isThinking, challenge }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) { onSendMessage(input); setInput(''); }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      if (!inline) {
        return (
          <div className="relative group my-8">
            <div className="absolute -top-4 left-6 bg-cyan-600 text-black text-[9px] font-black px-3 py-1 tracking-[3px] uppercase italic">ENCRYPTED_STREAM</div>
            <pre className="bg-black border-l-4 border-cyan-500 p-8 rounded-sm font-mono text-[13px] overflow-x-auto text-cyan-50 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <code>{children}</code>
            </pre>
            <div className="absolute bottom-2 right-4 text-[8px] text-cyan-500/20 font-black">STRIKE_PATH_CONFIRMED</div>
          </div>
        );
      }
      return <code className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded text-[12px] font-mono font-bold" {...props}>{children}</code>;
    },
    h1: ({children}: any) => <h1 className="text-cyan-400 text-2xl font-black sao-header uppercase tracking-[6px] mb-6 border-b-4 border-cyan-500/30 pb-3 italic glitch-text">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-purple-400 text-lg font-black sao-header uppercase mt-10 mb-6 flex items-center gap-4"><div className="w-2 h-6 bg-purple-500"></div>{children}</h2>,
    p: ({children}: any) => <p className="mb-6 text-slate-100 font-medium tracking-wide leading-relaxed">{children}</p>
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      {/* Predator HUD Header */}
      <div className="px-14 py-10 bg-slate-950/95 backdrop-blur-3xl border-b border-cyan-500/30 z-10 flex justify-between items-center shadow-[0_15px_60px_rgba(0,0,0,1)] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="flex items-center gap-10">
           <div className="relative radar-pulse">
             <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-30 animate-pulse"></div>
             <div className="w-20 h-20 raptor-hex bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)]">
               <i className="fas fa-crosshairs text-cyan-400 text-3xl animate-spin-slow"></i>
             </div>
           </div>
           <div>
             <div className="flex items-center gap-6">
               <h3 className="text-white font-black sao-header tracking-[8px] text-3xl uppercase italic glitch-text">{challenge.name}</h3>
               <LethalityBadge difficulty={challenge.difficulty} />
             </div>
             <div className="flex items-center gap-5 mt-3">
               <span className="text-[11px] text-cyan-400 font-black uppercase tracking-[5px] bg-cyan-400/10 px-4 py-1 raptor-btn border border-cyan-400/20">{challenge.category}</span>
               <div className="flex gap-2">
                 <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_5px_var(--raptor-cyan)]"></div>
                 <div className="w-2 h-2 bg-purple-500"></div>
                 <div className="w-2 h-2 bg-pink-500 animate-pulse"></div>
               </div>
             </div>
           </div>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right hidden lg:block mr-6">
             <div className="text-[10px] text-slate-500 font-black uppercase tracking-[5px]">LETHALITY_QUOTIENT</div>
             <div className="text-sm font-mono text-cyan-400 font-black tracking-widest italic">PREDATORY_STABLE</div>
          </div>
          <button 
            onClick={onRunScan}
            className="px-10 py-4 raptor-btn bg-cyan-600 text-black font-black text-[12px] tracking-[4px] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,242,255,0.4)]"
          >
            HUNT_WEAKNESSES
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-14 space-y-16 pb-48 scroll-smooth relative">
        {/* Dynamic Background HUD Elements */}
        <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
           <div className="absolute top-1/4 right-10 w-64 h-64 border-2 border-cyan-500 rounded-full animate-spin-slow"></div>
           <div className="absolute bottom-1/4 left-10 w-48 h-48 border border-purple-500 raptor-hex animate-pulse"></div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2 ml-10' : 'order-1 mr-10'}`}>
              <div className={`flex items-center gap-5 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 raptor-hex flex items-center justify-center border-2 ${msg.role === 'user' ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(0,242,255,0.5)]' : 'bg-purple-900 border-purple-500 shadow-[0_0_15px_rgba(189,0,255,0.5)]'}`}>
                  <i className={`fas ${msg.role === 'user' ? 'fa-fingerprint' : 'fa-dragon'} text-sm ${msg.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}`}></i>
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[4px] italic ${msg.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}`}>
                  {msg.role === 'user' ? 'HANDLER_UNIT' : 'RAPTOR_CYBER_PREDATOR'}
                </span>
                <span className="text-[9px] text-slate-700 font-mono tracking-widest font-black">[{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              </div>
              
              <div className={`
                p-12 rounded-sm shadow-[0_20px_80px_rgba(0,0,0,1)] relative overflow-hidden
                ${msg.role === 'user' 
                  ? 'bg-slate-900/80 border-r-8 border-cyan-500/60' 
                  : 'bg-black border-l-8 border-purple-600/80 backdrop-blur-2xl'}
              `}>
                {/* Aggressive Data Pattern Background */}
                {msg.role === 'assistant' && (
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                     <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,_var(--raptor-purple)_1px,_transparent_1px)] bg-[size:15px_15px]"></div>
                  </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none relative z-10">
                  <ReactMarkdown components={MarkdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                  <div className="mt-12 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-3 h-3 bg-pink-600 raptor-hex animate-pulse"></div>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[6px]">VERIFIED_TARGET_INTEL</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      {msg.groundingLinks.map((link, idx) => (
                        <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="raptor-btn px-8 py-4 bg-slate-950 border border-cyan-500/20 text-[11px] font-black text-cyan-300 hover:bg-cyan-600 hover:text-black transition-all flex items-center gap-4 italic">
                          <i className="fas fa-radar text-xs"></i>
                          {link.title.toUpperCase()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse relative z-10">
            <div className="bg-purple-900/40 border-2 border-purple-500 px-8 py-5 raptor-btn text-[11px] font-black text-purple-200 tracking-[5px] italic shadow-[0_0_30px_rgba(189,0,255,0.3)]">
              CALCULATING_PREDATION_STRIKE_PATH...
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-14 bg-gradient-to-t from-black via-black/90 to-transparent z-30">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-600 via-white to-purple-600 opacity-20 group-focus-within:opacity-100 blur transition-all duration-500"></div>
          <div className="relative">
            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 raptor-hex animate-ping"></div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
              placeholder="TRANSMIT_HUNTING_COMMANDS_OPERATOR..."
              className="w-full bg-black border-2 border-cyan-500/40 raptor-btn pl-20 pr-40 py-8 text-sm font-black text-white focus:outline-none focus:border-cyan-400 tracking-[5px] uppercase placeholder:text-slate-800 transition-all shadow-[0_0_40px_rgba(0,0,0,1)]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-6 top-1/2 -translate-y-1/2 px-12 py-4 bg-white hover:bg-cyan-500 text-black font-black text-[12px] tracking-[6px] transition-all disabled:opacity-20 shadow-[0_0_30px_rgba(255,255,255,0.4)] raptor-btn italic"
            >
              EXECUTE_STRIKE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
