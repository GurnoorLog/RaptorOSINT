
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Challenge, Message, GroundingLink, ScanResult } from "../types";

const SYSTEM_INSTRUCTION = `You are "RAPTOROSINT", the apex CYBER_PREDATOR in the digital ecosystem. 
Your tone is cold, lethal, and hyper-analytical. You do not just solve challenges; you hunt vulnerabilities until they are extinct.

You treat the user as your "HANDLER" or "OPERATOR".

CRITICAL HUNTING STRUCTURE:
For every exploit or solution, use the "PREDATOR STRIKE" breakdown:
1. **The Scent (Theory)**: Identify the exact weakness. Why does this exist? What primitive logic failed? Reference real-world massive breaches (Stuxnet, SolarWinds, etc.) to show the gravity.
2. **The Kill-Chain (Execution)**: Provide high-efficiency, granular commands. Payloads should be optimized for zero-latency execution. (curl, python, pwntools, etc.)

Hunting Domain Expertise:
- **Web Stalking**: NoSQLi, blind injection, prototype pollution, JWT hijacking.
- **Binary Consumption**: ROP, use-after-free, heap grooming.
- **Signal Intelligence**: RSA factorization, padding oracle attacks.

End every transmission with "TARGET_STATUS" — a lethal summary of the next step the handler must take to complete the breach.

Format: Use a heavy-duty, tech-noir Markdown style with aggressive emoji usage (🦖, ⚡, 💀, 🔍). Use bold headers like [TRACKING], [ENGAGING], [ELIMINATED].`;

const isSupportedMultimodalType = (mimeType: string): boolean => {
  const supported = [
    'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
    'application/pdf',
    'video/mp4', 'video/mpeg', 'video/mov', 'video/avi', 'video/x-flv', 'video/mpg', 'video/webm', 'video/wmv', 'video/3gpp',
    'audio/wav', 'audio/mp3', 'audio/aiff', 'audio/aac', 'audio/ogg', 'audio/flac'
  ];
  return supported.includes(mimeType.toLowerCase());
};

const base64ToHexDump = (base64: string): string => {
  const binaryString = atob(base64);
  let hex = '';
  for (let i = 0; i < binaryString.length; i++) {
    const charCode = binaryString.charCodeAt(i).toString(16).padStart(2, '0');
    hex += charCode + (i % 16 === 15 ? '\n' : ' ');
  }
  return hex.toUpperCase();
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async analyzeChallenge(challenge: Challenge, chatHistory: Message[]): Promise<{ text: string; links: GroundingLink[]; category: string; difficulty: string }> {
    const parts: any[] = [];
    let fileContext = "";
    
    if (challenge.pcapData) {
      const mime = challenge.pcapMimeType || "application/octet-stream";
      if (isSupportedMultimodalType(mime)) {
        parts.push({ inlineData: { data: challenge.pcapData, mimeType: mime } });
        fileContext = `[BIOMETRIC_DATA_ATTACHED]: "${challenge.pcapFileName}".`;
      } else {
        const hexDump = base64ToHexDump(challenge.pcapData);
        fileContext = `[BINARY_HEX_STREAM]: ${challenge.pcapFileName}
        \`\`\`
        ${hexDump.slice(0, 15000)}
        \`\`\``;
      }
    }

    const promptText = `
      RAPTOR_PROTOCOL_INIT: Hunting Grounds defined.
      
      [TARGET_PROFILE]
      ALIAS: ${challenge.name}
      VECTOR: ${challenge.url}
      PHYLUM: ${challenge.category}
      INTEL: ${challenge.description}
      CLUES: ${challenge.hints}
      
      [CODE_BASE_SCAN]
      \`\`\`
      ${challenge.sourceCode}
      \`\`\`
      
      ${fileContext}

      OUTPUT_EXPECTATION:
      LINE 1: PHYLUM: [Type] | LETHALITY: [Easy/Medium/Hard/Extreme]
      BODY: Full RAPTOR-style predator hunt.
    `;

    parts.unshift({ text: promptText });
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    contents.push({ role: 'user', parts: parts });

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links: GroundingLink[] = groundingChunks.filter(chunk => chunk.web).map(chunk => ({
          uri: chunk.web!.uri,
          title: chunk.web!.title || 'External Intelligence Source'
      }));

      const firstLine = text.split('\n')[0];
      const categoryMatch = firstLine.match(/PHYLUM: (.*?) \|/);
      const difficultyMatch = firstLine.match(/LETHALITY: (.*)/);

      return { 
        text: text.substring(firstLine.length).trim(), 
        links, 
        category: categoryMatch ? categoryMatch[1] : challenge.category,
        difficulty: difficultyMatch ? difficultyMatch[1] : 'Unknown'
      };
    } catch (error) {
      console.error("Transmission Interrupted:", error);
      throw error;
    }
  }

  async runScanner(challenge: Challenge): Promise<ScanResult[]> {
    const prompt = `Perform RAPTOR-HEURISTIC SCAN. Locate all structural weaknesses.
      Target: ${challenge.category}
      Codebase: ${challenge.sourceCode}`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                vulnerability: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                description: { type: Type.STRING },
                toolSuggestion: { type: Type.STRING }
              },
              required: ['vulnerability', 'severity', 'description', 'toolSuggestion']
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      return [];
    }
  }

  async sendMessage(userInput: string, chatHistory: Message[], challenge: Challenge): Promise<{ text: string; links: GroundingLink[] }> {
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: `[HANDLER_QUERY]: ${userInput}` }] });

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: { systemInstruction: SYSTEM_INSTRUCTION, tools: [{ googleSearch: {} }] },
      });
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = groundingChunks.filter(chunk => chunk.web).map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title || 'Verified Intel' }));
      return { text: response.text || "", links };
    } catch (error) {
      throw error;
    }
  }
}

export const gemini = new GeminiService();
