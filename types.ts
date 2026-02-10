
export interface GroundingLink {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingLinks?: GroundingLink[];
  isThinking?: boolean;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme' | 'Unknown';

export interface Challenge {
  name: string;
  description: string;
  url: string;
  hints: string;
  sourceCode: string;
  category: string;
  difficulty?: Difficulty;
  pcapData?: string; // Base64 encoded file data
  pcapFileName?: string;
  pcapMimeType?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  examples: string[];
  mitigation: string;
}

export interface ScanResult {
  vulnerability: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  toolSuggestion: string;
}
