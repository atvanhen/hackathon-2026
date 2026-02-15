import type { ScanResult } from '../types';
import ScanResultCard from './ScanResultCard';

interface ScanFeedProps {
    results: ScanResult[];
}

export default function ScanFeed({ results }: ScanFeedProps) {
    if (results.length === 0) {
        return (
            <div className="text-center py-20 opacity-50 hover:opacity-100 transition-opacity duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded glass mb-6 border border-white/5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold font-sherlock text-text-secondary mb-2 tracking-wide uppercase">No Active Investigations</h3>
                <p className="text-sm font-mono text-text-muted">
                    Waiting for input stream...
                </p>
            </div>
        );
    }

    return (
        <section className="px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold font-sherlock text-text-primary tracking-widest uppercase">
                        Case Files
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-text-secondary border border-white/10">
                        {results.length.toString().padStart(2, '0')}
                    </span>
                </div>

                <div className="space-y-4">
                    {results.map((result, index) => (
                        <ScanResultCard key={result.id} result={result} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
