import { useState, useEffect } from 'react';
import { FileText, AlertTriangle, ChevronDown, CheckCircle } from 'lucide-react';
import type { ScanResult } from '../types';

// Helper to categorize scams (replicated logic for consistency)
const getScamCategory = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("sms") || t.includes("text")) return "SMISHING";
    if (t.includes("call") || t.includes("voice")) return "VISHING";
    if (t.includes("support") || t.includes("microsoft")) return "TECH SUPPORT";
    if (t.includes("crypto") || t.includes("invest")) return "INVESTMENT";
    if (t.includes("login") || t.includes("bank")) return "PHISHING";
    return "OTHER";
};

export default function ThreatLedger() {
    const [history, setHistory] = useState<ScanResult[]>([]);
    const [visibleCount, setVisibleCount] = useState(10);

    // Load history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('scan_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Data is already stored as Newest -> Oldest in Scanner.tsx
                setHistory(parsed);
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const displayedHistory = history.slice(0, visibleCount);

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-50 animate-fade-in-up">
                <FileText className="w-16 h-16 text-text-muted mb-4" />
                <h2 className="text-2xl font-sherlock text-text-secondary uppercase">No Records Found</h2>
                <p className="text-text-muted font-mono mt-2">Start a scan to populate the ledger.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-sherlock font-bold text-white tracking-tight">
                        The Threat <span className="text-trenchcoat glow-trenchcoat">Ledger</span>
                    </h1>
                    <p className="text-text-secondary text-sm font-mono mt-2 uppercase tracking-widest opacity-80">
                        Classified Scan History & Case Logs
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-xs text-text-muted font-mono uppercase">Total Records</div>
                    <div className="text-2xl font-bold text-white font-sherlock">{history.length}</div>
                </div>
            </div>

            {/* Ledger Table Container */}
            <div className="bg-noir-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-text-muted font-mono text-xs uppercase tracking-wider">
                                <th className="p-4 w-48">Timestamp</th>
                                <th className="p-4">Target Input / URL</th>
                                <th className="p-4 w-40">Category</th>
                                <th className="p-4 w-32">Verdict</th>
                                <th className="p-4 w-24 text-right">Risk</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm font-mono">
                            {displayedHistory.map((entry, i) => {
                                const category = getScamCategory((entry.verdict + " " + entry.findings.join(" ")));
                                const isMalicious = entry.threat_level === 'dangerous';
                                const isSupicious = entry.threat_level === 'suspicious';
                                
                                return (
                                    <tr 
                                        key={entry.id || i} 
                                        className={`group hover:bg-white/5 transition-colors duration-200 ${isMalicious ? 'hover:bg-siren/5' : ''}`}
                                    >
                                        <td className="p-4 text-text-secondary whitespace-nowrap">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 max-w-xs md:max-w-md truncate text-white group-hover:text-trenchcoat transition-colors">
                                            {entry.url}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                                isMalicious ? 'border-siren text-siren bg-siren/10' : 
                                                'border-white/10 text-text-muted bg-white/5'
                                            }`}>
                                                {category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {isMalicious ? (
                                                    <AlertTriangle className="w-4 h-4 text-siren" />
                                                ) : isSupicious ? (
                                                    <AlertTriangle className="w-4 h-4 text-trenchcoat" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-neon-cyan" />
                                                )}
                                                <span className={`font-bold ${
                                                    isMalicious ? 'text-siren' : 
                                                    isSupicious ? 'text-trenchcoat' : 
                                                    'text-neon-cyan'
                                                }`}>
                                                    {entry.threat_level.toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-white">
                                            {entry.risk_score}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Load More */}
                {visibleCount < history.length && (
                    <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                        <button 
                            onClick={handleLoadMore}
                            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-colors uppercase tracking-widest group"
                        >
                            Load Previous Files
                            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
