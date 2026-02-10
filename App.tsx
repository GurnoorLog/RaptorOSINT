
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChallengeForm from './components/ChallengeForm';
import ChatInterface from './components/ChatInterface';
import KnowledgeBase from './components/KnowledgeBase';
import VulnerabilityReport from './components/VulnerabilityReport';
import { Challenge, Message, ScanResult, Difficulty } from './types';
import { gemini } from './services/geminiService';

type View = 'form' | 'chat' | 'knowledge';

const App: React.FC = () => {
  const [view, setView] = useState<View>('form');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[] | null>(null);

  const handleStartAnalysis = async (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setView('chat');
    setIsThinking(true);
    
    setMessages([{
      id: 'init',
      role: 'assistant',
      content: `RAPTOR_CORE_ONLINE. Vector locked: **${challenge.name}**. Initializing deep tissue scan... 🦖⚡`,
      timestamp: Date.now(),
    }]);

    try {
      const result = await gemini.analyzeChallenge(challenge, []);
      
      setActiveChallenge(prev => prev ? ({
        ...prev,
        category: result.category,
        difficulty: result.difficulty as Difficulty
      }) : null);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        groundingLinks: result.links
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        content: "CRITICAL_SYSTEM_FAILURE: Uplink severed. Predator is blind. Restore API_KEY immediately. 💀",
        timestamp: Date.now()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChallenge) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await gemini.sendMessage(text, messages, activeChallenge);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        groundingLinks: response.links
      }]);
    } catch (error) {
       setMessages(prev => [...prev, { id: 'err2', role: 'assistant', content: "DATA_LOSS_DETECTED: Signal interference. Retransmit command.", timestamp: Date.now() }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRunScan = async () => {
    if (!activeChallenge) return;
    setIsThinking(true);
    try {
      const results = await gemini.runScanner(activeChallenge);
      setScanResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleReset = () => {
    setActiveChallenge(null);
    setMessages([]);
    setView('form');
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-inter">
      <Sidebar 
        onReset={handleReset} 
        onViewKB={() => setView('knowledge')} 
        currentView={view} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {view === 'form' && (
          <div className="h-full overflow-y-auto">
            <ChallengeForm onSubmit={handleStartAnalysis} />
          </div>
        )}
        
        {view === 'chat' && activeChallenge && (
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            onRunScan={handleRunScan}
            isThinking={isThinking}
            challenge={activeChallenge}
          />
        )}

        {view === 'knowledge' && (
          <div className="h-full overflow-y-auto">
            <KnowledgeBase />
          </div>
        )}

        {scanResults && (
          <VulnerabilityReport results={scanResults} onClose={() => setScanResults(null)} />
        )}

        {/* Tactical HUD Overlays inspired by the image */}
        <div className="absolute top-10 right-10 pointer-events-none flex flex-col items-end gap-2 opacity-40 z-50">
           <div className="flex items-center gap-2">
              <div className="text-[8px] font-black text-cyan-400 uppercase tracking-[4px]">HUNT_STATUS: ACTIVE</div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_var(--raptor-cyan)]"></div>
           </div>
           <div className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest">NEURAL_SYNC: 99.8%</div>
           <div className="h-0.5 w-32 bg-slate-800 relative mt-1">
              <div className="absolute inset-0 bg-cyan-500 w-[85%]"></div>
           </div>
        </div>

        <div className="absolute bottom-4 left-10 pointer-events-none opacity-10 z-0">
           <i className="fas fa-dragon text-[300px] text-cyan-500 translate-y-20 -translate-x-20 rotate-12"></i>
        </div>
      </main>
    </div>
  );
};

export default App;
