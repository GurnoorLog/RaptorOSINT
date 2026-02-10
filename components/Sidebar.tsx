
import React from 'react';

interface SidebarProps {
  onReset: () => void;
  onViewKB: () => void;
  currentView: 'chat' | 'knowledge' | 'form';
}

const Sidebar: React.FC<SidebarProps> = ({ onReset, onViewKB, currentView }) => {
  return (
    <div className="w-72 bg-slate-950/90 backdrop-blur-3xl border-r border-cyan-500/30 flex flex-col h-full overflow-hidden shrink-0 z-20 shadow-[0_0_40px_rgba(0,0,0,1)]">
      <div className="p-10 border-b border-white/5 flex flex-col items-center gap-6 bg-gradient-to-b from-cyan-500/10 to-transparent">
        <div className="relative group radar-pulse">
          <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative w-24 h-24 bg-slate-900 border-2 border-cyan-400 raptor-hex flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-transform group-hover:scale-105">
            <i className="fas fa-dragon text-cyan-400 text-5xl drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]"></i>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-3 py-0.5 text-[8px] font-black uppercase tracking-[2px] rounded-sm">
            ONLINE
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-sm font-black text-white sao-header tracking-[3px] italic glitch-text">RAPTOROSINT</h1>
          <p className="text-[9px] text-cyan-500 font-mono tracking-widest mt-1 opacity-60">CYBER_PREDATOR_V1</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 space-y-4 px-6">
        <div className="px-2">
          <button 
            onClick={onReset}
            className={`w-full raptor-btn flex items-center gap-4 px-6 py-5 text-[10px] font-black transition-all ${
              currentView === 'form' 
                ? 'bg-cyan-600 text-black shadow-[0_0_30px_rgba(0,242,255,0.6)] border-l-4 border-white' 
                : 'bg-slate-900/50 text-cyan-100 hover:bg-cyan-500/20 border-l-4 border-transparent hover:border-cyan-500'
            }`}
          >
            <i className="fas fa-satellite-dish text-sm"></i>
            NEW_VECTOR
          </button>
        </div>

        <div className="px-2">
           <button 
            onClick={onViewKB}
            className={`w-full raptor-btn flex items-center gap-4 px-6 py-5 text-[10px] font-black transition-all ${
              currentView === 'knowledge' 
                ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(189,0,255,0.5)]' 
                : 'bg-slate-900/50 text-purple-100 hover:bg-purple-500/20'
            }`}
          >
            <i className="fas fa-dna text-sm"></i>
            HUNTING_GENES
          </button>
        </div>

        <div className="mt-12">
          <div className="px-4 py-1 flex items-center justify-between opacity-40">
            <h2 className="text-[8px] font-black text-white uppercase tracking-[5px]">Subsystems</h2>
          </div>
          <div className="space-y-1 mt-4">
            <ToolLink icon="fa-microchip" label="CORE_ANALYTIC" url="https://gchq.github.io/CyberChef/" color="cyan" />
            <ToolLink icon="fa-skull" label="VULN_TRACKER" url="https://github.com/swisskyrepo/PayloadsAllTheThings" color="purple" />
            <ToolLink icon="fa-shield-virus" label="THREAT_MAP" url="https://owasp.org/www-project-top-ten/" color="pink" />
          </div>
        </div>
      </div>

      <div className="p-8 bg-black/60 border-t border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="flex items-center gap-5">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-30"></div>
             <div className="w-14 h-14 raptor-hex bg-slate-800 border-2 border-cyan-500 flex items-center justify-center">
               <span className="text-cyan-400 font-black text-sm">REX</span>
             </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Handler</p>
              <span className="text-[7px] text-cyan-400 font-mono animate-pulse font-bold tracking-tighter">PREDATOR_LINK: ACTIVE</span>
            </div>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 w-[85%] shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolLink: React.FC<{ icon: string; label: string; url: string; color: 'cyan' | 'purple' | 'pink' }> = ({ icon, label, url, color }) => {
  const colors = {
    cyan: 'text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10 border-cyan-400/20',
    purple: 'text-purple-400/60 hover:text-purple-400 hover:bg-purple-400/10 border-purple-400/20',
    pink: 'text-pink-400/60 hover:text-pink-400 hover:bg-pink-400/10 border-pink-400/20',
  };
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center gap-4 px-6 py-3.5 text-[8px] font-black border-l-2 transition-all ${colors[color]}`}
    >
      <i className={`fas ${icon} text-[11px]`}></i>
      {label}
    </a>
  );
};

export default Sidebar;
