import type { ScanResult } from '../types';
import ScanResultCard from './ScanResultCard';

interface ScanFeedProps {
    results: ScanResult[];
}

export default function ScanFeed({ results }: ScanFeedProps) {
    if (results.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-secondary mb-2">No scans yet</h3>
                <p className="text-sm text-text-muted">
                    Paste a suspicious URL above to start scanning for threats.
                </p>
            </div>
        );
    }

    return (
        <section className="px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-bold text-text-primary">Scan Results</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-green/10 text-accent-green border border-accent-green/20">
                        {results.length}
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
