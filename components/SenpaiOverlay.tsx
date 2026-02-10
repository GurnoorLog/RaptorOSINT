
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface SenpaiOverlayProps {
  onClose: () => void;
  isActive: boolean;
}

const KiritoAvatar = () => (
  <div className="relative w-72 h-72 mx-auto mb-8 link-start-anim">
    {/* Aggressive Cyber-Rex HUD Elements */}
    <div className="absolute inset-0 border-4 border-purple-500/20 sao-card-hex animate-[spin_20s_linear_infinite]"></div>
    <div className="absolute -inset-4 border-2 border-pink-500/30 sao-card-hex animate-[spin_15s_linear_infinite_reverse]"></div>
    
    {/* Inner Radar Pulses */}
    <div className="absolute inset-0 flex items-center justify-center opacity-30">
       <div className="w-full h-full border border-cyan-400/20 rounded-full animate-ping"></div>
    </div>

    <div className="absolute inset-8 border-4 border-purple-400 sao-card-hex bg-black/90 shadow-[0_0_60px_rgba(189,0,255,0.4)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-pink-900/20"></div>
        {/* The Cyber-Rex Core Symbol */}
        <div className="relative group">
           <i className="fas fa-dragon text-8xl text-purple-400 drop-shadow-[0_0_20px_rgba(189,0,255,1)] animate-pulse"></i>
           <div className="absolute -top-4 -right-4 w-6 h-6 bg-pink-500 sao-card-hex shadow-[0_0_15px_rgba(255,0,255,0.8)]"></div>
        </div>
    </div>
    
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="bg-pink-600 text-white px-10 py-2 text-[11px] font-black uppercase tracking-[5px] shadow-[0_0_30px_rgba(255,0,255,0.6)] sao-btn border-t-2 border-white/20">
            SENTINEL_MODE
        </div>
        <div className="text-[10px] text-cyan-400 font-mono tracking-widest font-black uppercase italic">KIRITO_UNIT_REXX</div>
    </div>
  </div>
);

const SenpaiOverlay: React.FC<SenpaiOverlayProps> = ({ onClose, isActive }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const isSpeakingRef = useRef(false);

  const updateSpeakingState = (val: boolean) => {
    setIsSpeaking(val);
    isSpeakingRef.current = val;
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  const downsampleBuffer = (buffer: Float32Array, inputSR: number, outputSR: number) => {
    if (inputSR === outputSR) return buffer;
    const ratio = inputSR / outputSR;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) result[i] = buffer[Math.round(i * ratio)];
    return result;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = Math.max(-1, Math.min(1, data[i])) * 32767;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  useEffect(() => {
    if (!isActive) return;

    const initializeSession = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
        });
        const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const outputNode = audioContextRef.current.createGain();
        outputNode.connect(audioContextRef.current.destination);

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('connected');
              const inputCtx = inputContextRef.current!;
              const source = inputCtx.createMediaStreamSource(stream);
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              const hardwareSR = inputCtx.sampleRate;
              scriptProcessor.onaudioprocess = (e) => {
                if (isSpeakingRef.current) { setIsListening(false); return; }
                const inputData = e.inputBuffer.getChannelData(0);
                const downsampled = downsampleBuffer(inputData, hardwareSR, 16000);
                sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(downsampled) }));
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += Math.abs(inputData[i]);
                setIsListening(sum / inputData.length > 0.01);
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioBase64) {
                updateSpeakingState(true);
                const ctx = audioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                source.onended = () => { sourcesRef.current.delete(source); if (sourcesRef.current.size === 0) updateSpeakingState(false); };
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                updateSpeakingState(false);
              }
            },
            onerror: () => setStatus('error'),
            onclose: () => onClose(),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } },
            systemInstruction: "You are Kirito-Sentinel, a peak cyber-security AI entity. You are analytical, tactical, and protective. You use technical jargon and provide pedagogical CTF guidance with aggressive precision. Address the user as 'Operator'.",
          },
        });
        sessionRef.current = await sessionPromise;
      } catch (err) { setStatus('error'); }
    };

    initializeSession();
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (inputContextRef.current) inputContextRef.current.close();
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-[40px] z-[60] flex flex-col items-center justify-center p-8 link-start-anim">
      {/* HUD Decorations */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="absolute top-12 right-12 flex gap-4">
        <div className="text-right">
           <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sentinel_Protocol</div>
           <div className="text-xs font-mono text-pink-500 font-black tracking-widest">ACTIVE_ENGAGEMENT</div>
        </div>
        <button onClick={onClose} className="w-16 h-16 sao-card-hex bg-pink-600/20 border-2 border-pink-500 text-pink-500 hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center group shadow-[0_0_30px_rgba(255,0,255,0.3)]">
          <i className="fas fa-times text-xl group-hover:rotate-180 transition-transform duration-500"></i>
        </button>
      </div>

      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white sao-header tracking-[12px] uppercase italic">Neural Uplink</h2>
          <div className="flex justify-center items-center gap-6">
             <div className="h-[2px] w-32 bg-gradient-to-r from-transparent to-purple-500"></div>
             <div className="flex items-center gap-3">
                <div className={`w-4 h-4 sao-card-hex ${status === 'connected' ? 'bg-pink-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm font-black text-pink-500 uppercase tracking-[4px] font-mono">
                  {status === 'connecting' ? 'SYNCING_NEURALS...' : status === 'connected' ? 'UPLINK_STABLE' : 'UPLINK_TERMINATED'}
                </span>
             </div>
             <div className="h-[2px] w-32 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
        </div>

        <KiritoAvatar />

        <div className="bg-black/60 border-2 border-purple-500/30 p-12 sao-panel rounded-sm shadow-2xl relative">
          <div className="absolute -top-4 left-10 bg-purple-600 text-white px-6 py-1 text-[11px] font-black tracking-[4px] uppercase">COMM_STREAM_V9</div>
          
          {/* Visual Equalizer */}
          <div className="flex items-end justify-center h-20 gap-2 mb-8 px-6">
            {[...Array(32)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 rounded-sm transition-all duration-75 ${isSpeaking ? 'bg-pink-500' : isListening ? 'bg-cyan-500' : 'bg-slate-800'}`}
                style={{ 
                  height: `${isSpeaking ? Math.random() * 100 : isListening ? Math.random() * 50 : 15}%`,
                  opacity: isSpeaking || isListening ? 1 : 0.4,
                  boxShadow: isSpeaking ? '0 0 10px var(--sao-pink)' : isListening ? '0 0 10px var(--sao-cyan)' : 'none'
                }}
              />
            ))}
          </div>
          
          <p className="text-lg text-white font-bold sao-header uppercase tracking-wider italic">
            {isSpeaking 
              ? "Transmitting Tactical Pedagogical Intelligence..." 
              : isListening 
                ? "Calibrating Neural Sensors for Operator Input..." 
                : "Sentinel Standing By. Operator, Initiate Protocol."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <StatBox label="Sync Level" value="99.98%" color="pink" />
          <StatBox label="System Class" value="S_RANK" color="purple" />
          <StatBox label="Neural Lag" value="0.04ms" color="cyan" />
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; color: 'cyan' | 'purple' | 'pink' }> = ({ label, value, color }) => {
  const colors = {
    cyan: 'text-cyan-400 border-cyan-500/20',
    purple: 'text-purple-400 border-purple-500/20',
    pink: 'text-pink-400 border-pink-500/20 shadow-[0_0_15px_rgba(255,0,255,0.1)]',
  };
  return (
    <div className={`bg-slate-900/60 border-2 p-4 flex flex-col items-center rounded-sm ${colors[color]}`}>
      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-mono font-black">{value}</div>
    </div>
  );
};

export default SenpaiOverlay;
