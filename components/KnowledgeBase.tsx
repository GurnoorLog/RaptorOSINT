
import React, { useState } from 'react';
import { KnowledgeEntry } from '../types';

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'xss',
    title: 'Cross-Site Scripting (XSS)',
    description: 'Injecting malicious scripts into web pages viewed by other users.',
    examples: ['<script>alert(document.cookie)</script>', '<img src=x onerror=alert(1)>'],
    mitigation: 'Context-aware output encoding, Content Security Policy (CSP), and input validation.'
  },
  {
    id: 'sqli',
    title: 'SQL Injection',
    description: 'Inserting malicious SQL statements into entry fields for execution.',
    examples: ["' OR 1=1 --", "admin' #", "UNION SELECT password FROM users"],
    mitigation: 'Use of Prepared Statements (Parameterized Queries) and ORMs.'
  },
  {
    id: 'ssrf',
    title: 'Server-Side Request Forgery (SSRF)',
    description: 'Tricking the server into making requests to an unintended location, often internal systems.',
    examples: ['http://169.254.169.254/latest/meta-data/', 'http://localhost:8080/admin'],
    mitigation: 'Allow-listing URLs, disabling unnecessary protocols, and network segmentation.'
  },
  {
    id: 'idor',
    title: 'Insecure Direct Object Reference (IDOR)',
    description: 'Accessing objects directly using user-supplied input without proper authorization.',
    examples: ['/api/users/100 -> change to /api/users/1', '/download/invoice_99.pdf'],
    mitigation: 'Object-level access control checks for every request.'
  },
  {
    id: 'csrf',
    title: 'Cross-Site Request Forgery (CSRF)',
    description: 'Forcing an authenticated user to execute unwanted actions on a web application.',
    examples: ['<img src="http://bank.com/transfer?amount=1000&to=attacker">'],
    mitigation: 'Anti-CSRF tokens (Synchronizer Token Pattern) and SameSite cookie attributes.'
  }
];

const KnowledgeBase: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = KNOWLEDGE_BASE.filter(entry => 
    entry.title.toLowerCase().includes(search.toLowerCase()) || 
    entry.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white">Security Knowledge Base</h2>
          <p className="text-slate-400">Core intelligence for web vulnerability exploitation.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search vulnerabilities..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500/50 outline-none w-64"
          />
          <i className="fas fa-search absolute right-3 top-2.5 text-slate-500"></i>
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.map(entry => (
          <div key={entry.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">{entry.title}</h3>
            <p className="text-slate-300 mb-4">{entry.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Common Payloads</h4>
                <div className="space-y-2">
                  {entry.examples.map((ex, i) => (
                    <code key={i} className="block p-2 bg-slate-950 rounded border border-slate-800 text-xs text-emerald-400 break-all font-mono">
                      {ex}
                    </code>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Defensive Measures</h4>
                <p className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  {entry.mitigation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
