import type { ScanResult } from '../types';

interface ScanResultCardProps {
    result: ScanResult;
    index: number;
}

const threatConfig = {
    safe: {
        label: 'SAFE',
        color: 'text-accent-green',
        bg: 'bg-accent-green/10',
        border: 'border-accent-green/30',
        glow: 'glow-green',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    suspicious: {
        label: 'SUSPICIOUS',
        color: 'text-accent-amber',
        bg: 'bg-accent-amber/10',
        border: 'border-accent-amber/30',
        glow: 'glow-amber',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    dangerous: {
        label: 'DANGEROUS',
        color: 'text-accent-red',
        bg: 'bg-accent-red/10',
        border: 'border-accent-red/30',
        glow: 'glow-red',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
};

export default function ScanResultCard({ result, index }: ScanResultCardProps) {
    const config = threatConfig[result.threat_level];
    const formattedDate = new Date(result.timestamp).toLocaleString();

    return (
        <div
            className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Screenshot */}
                {result.screenshot_base64 && (
                    <div className="md:w-72 h-48 md:h-auto flex-shrink-0 relative overflow-hidden bg-bg-secondary">
                        <img
                            src={`data:image/png;base64,${result.screenshot_base64}`}
                            alt={`Screenshot of ${result.url}`}
                            className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />
                    </div>
                )}

                {/* Details */}
                <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        {/* Threat badge */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color} ${config.bg} ${config.border}`}>
                            {config.icon}
                            {config.label}
                        </div>

                        {/* Risk score */}
                        <div className="text-right">
                            <div className={`text-2xl font-bold ${config.color}`}>
                                {result.risk_score}
                                <span className="text-sm font-normal text-text-muted">/100</span>
                            </div>
                            <div className="text-xs text-text-muted">Risk Score</div>
                        </div>
                    </div>

                    {/* URL */}
                    <div className="mb-3">
                        <p className="text-xs text-text-muted mb-1">Scanned URL</p>
                        <p className="text-sm text-text-primary font-mono break-all bg-bg-secondary/50 p-2 rounded-lg">
                            {result.url}
                        </p>
                    </div>

                    {/* Verdict */}
                    <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                        {result.verdict}
                    </p>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formattedDate}
                    </div>
                </div>
            </div>
        </div>
    );
}
