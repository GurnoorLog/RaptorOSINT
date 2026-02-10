
import React, { useState } from 'react';
import { Challenge } from '../types';

interface ChallengeFormProps {
  onSubmit: (challenge: Challenge) => void;
}

const ChallengeForm: React.FC<ChallengeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Challenge>({
    name: '',
    description: '',
    url: '',
    hints: '',
    sourceCode: '',
    category: 'Web'
  });
  const [fileLoading, setFileLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFormData(prev => ({
        ...prev,
        pcapData: base64,
        pcapFileName: file.name,
        pcapMimeType: file.type || 'application/octet-stream'
      }));
      setFileLoading(false);
    };
    reader.onerror = () => {
      alert("SIGNAL ERROR: Unable to parse binary data.");
      setFileLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-10 relative">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-black text-white mb-4 sao-header italic glitch-text tracking-[10px]">INTELLIGENCE_INJECTION</h2>
        <p className="text-cyan-500 font-mono text-[10px] tracking-[4px] opacity-60">TARGET_PARAMETERS_REQUIRED_FOR_PREDATION</p>
      </div>

      <form onSubmit={handleSubmit} className="raptor-panel rounded-sm p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <i className="fas fa-dragon text-9xl text-cyan-400"></i>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400"></div>
              TARGET_ID
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ASSIGN_CODENAME..."
              className="w-full bg-black/60 border border-cyan-500/20 raptor-btn px-6 py-4 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-all uppercase placeholder:opacity-20"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400"></div>
              HUNTING_GROUND
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-black/60 border border-purple-500/20 raptor-btn px-6 py-4 text-purple-100 font-bold text-sm focus:outline-none focus:border-purple-500 transition-all uppercase"
            >
              <option value="Web">WEB_STALKING</option>
              <option value="Network">NETWORK_SNIFFING</option>
              <option value="Reverse Engineering">REVERSE_ENGINEERING</option>
              <option value="Crypto">SIGNAL_INTELLIGENCE</option>
              <option value="Pwn">BINARY_CONSUMPTION</option>
              <option value="Forensics">DIGITAL_BIOPSY</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-400"></div>
            VECTOR_ENDPOINT
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="HTTP://TARGET.HOST.INTERNAL"
            className="w-full bg-black/60 border border-cyan-500/20 raptor-btn px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:opacity-20"
          />
        </div>

        {formData.category === 'Network' && (
          <div className="space-y-3 mb-8 p-6 bg-cyan-500/5 border border-cyan-500/20">
            <label className="text-[10px] font-black text-cyan-300 block mb-2 tracking-widest">BIOMETRIC_PACKET_STREAM (.PCAP)</label>
            <div className="flex items-center gap-6">
              <label className="flex-1 cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-cyan-500/20 hover:border-cyan-400 transition-all bg-black/40 group">
                <i className={`fas ${fileLoading ? 'fa-dna fa-spin' : (formData.pcapFileName ? 'fa-check-double text-emerald-400' : 'fa-upload')} text-4xl mb-4 text-cyan-500/40 group-hover:scale-110 transition-transform`}></i>
                <span className="text-[10px] font-black text-cyan-500 tracking-widest uppercase">
                  {formData.pcapFileName ? `UPLOAD_SYNCED: ${formData.pcapFileName}` : "INIT_DATA_UPLINK"}
                </span>
                <input type="file" className="hidden" accept=".pcap,.pcapng,.cap" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-8">
          <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-400"></div>
            MISSION_INTEL
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="ANALYZE_OBJECTIVE_AND_INTEL_GAPS..."
            className="w-full bg-black/60 border border-cyan-500/20 raptor-btn px-6 py-4 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none placeholder:opacity-20"
            required
          />
        </div>

        <div className="space-y-3 mb-10">
          <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-pink-400"></div>
            CODE_GENOME_STREAM
          </label>
          <textarea
            name="sourceCode"
            value={formData.sourceCode}
            onChange={handleChange}
            rows={10}
            placeholder="INJECT_SOURCE_OR_HEX_DUMPS_FOR_MUTATION_ANALYSIS..."
            className="w-full bg-black/90 border border-pink-500/20 raptor-btn px-6 py-4 font-mono text-[12px] text-pink-100 focus:outline-none focus:border-pink-500 transition-all resize-none shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={fileLoading}
          className="w-full py-6 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-white disabled:from-slate-800 disabled:to-slate-900 text-black font-black uppercase tracking-[8px] raptor-btn shadow-[0_0_50px_rgba(0,242,255,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
        >
          <i className={`fas ${fileLoading ? 'fa-spinner fa-spin' : 'fa-skull-crossbones'}`}></i>
          {fileLoading ? "EXTRACTING_DATA..." : "INITIATE_PREDATION"}
        </button>
      </form>
    </div>
  );
};

export default ChallengeForm;
