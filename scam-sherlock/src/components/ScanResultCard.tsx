import type { ScanResult } from '../types';

interface ScanResultCardProps {
    result: ScanResult;
    index: number;
}

const threatConfig = {
    safe: {
        label: 'CLEARED',
        color: 'text-neon-cyan',
        bg: 'bg-neon-cyan/5',
        border: 'border-neon-cyan/20',
        glow: 'shadow-[0_0_15px_rgba(0,212,255,0.1)]',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    suspicious: {
        label: 'SUSPICIOUS',
        color: 'text-trenchcoat',
        bg: 'bg-trenchcoat/5',
        border: 'border-trenchcoat/20',
        glow: 'glow-trenchcoat',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    dangerous: {
        label: 'MALICIOUS',
        color: 'text-siren',
        bg: 'bg-siren/5',
        border: 'border-siren/30',
        glow: 'glow-siren',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
};

const getScamCategory = (result: ScanResult) => {
    const text = (result.verdict + " " + result.findings.join(" ")).toLowerCase();
    
    if (text.includes("sms") || text.includes("text message") || text.includes("delivery")) {
        return { label: "SMISHING", reason: "SMS-based lure detected" };
    }
    if (text.includes("call") || text.includes("voice") || text.includes("helpline") || text.includes("toll-free")) {
        return { label: "VISHING", reason: "Voice/Phone scam indicators found" };
    }
    if (text.includes("support") || text.includes("microsoft") || text.includes("virus") || text.includes("infected")) {
        return { label: "TECH SUPPORT", reason: "Suspicious remote access patterns detected" };
    }
    if (text.includes("crypto") || text.includes("bitcoin") || text.includes("invest") || text.includes("profit")) {
        return { label: "INVESTMENT", reason: "Unrealistic financial promises identified" };
    }
    if (text.includes("login") || text.includes("bank") || text.includes("account") || text.includes("verify") || text.includes("credential")) {
        return { label: "PHISHING", reason: "Credential harvesting attempt detected" };
    }
    
    return { label: "OTHER", reason: "General malicious activity detected" };
};

export default function ScanResultCard({ result, index }: ScanResultCardProps) {
    const config = threatConfig[result.threat_level];
    const formattedDate = new Date(result.timestamp).toLocaleString();
    const category = getScamCategory(result);
    const isSafe = result.threat_level === 'safe';

    return (
        <div
            className={`glass rounded overflow-hidden transition-all duration-500 hover:scale-[1.01] animate-fade-in-up group ${config.glow}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Screenshot */}
                <div className="md:w-72 h-48 md:h-auto flex-shrink-0 relative overflow-hidden bg-noir-panel flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                    {result.screenshot_base64 ? (
                        <>
                            <img
                                src={`data:image/png;base64,${result.screenshot_base64}`}
                                alt={`Screenshot of ${result.url}`}
                                className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-noir-bg/90 via-transparent to-transparent" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-noir-panel flex items-center justify-center relative">
                            <img
                                src="/site-unreachable.png"
                                alt="Site Unreachable"
                                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<div class="p-4 text-center"><div class="text-text-muted text-xs font-mono mb-1">CONNECTION FAILED</div><div class="text-text-secondary text-[10px] font-mono">Preview unavailable</div></div>';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        {/* Threat badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-bold font-mono tracking-wider uppercase border ${config.color} ${config.bg} ${config.border}`}>
                            {config.icon}
                            {config.label}
                        </div>

                        {/* Risk score & Category */}
                        <div className="text-right flex flex-col items-end gap-2">
                            <div>
                                <div className={`text-3xl font-bold font-sherlock ${config.color}`}>
                                    {result.risk_score}
                                    <span className="text-sm font-normal text-text-muted ml-0.5">/100</span>
                                </div>
                                <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Risk Score</div>
                            </div>
                            
                            {/* Threat Category Badge */}
                            {!isSafe && (
                                <div className="mt-1 flex flex-col items-end">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border animate-pulse ${
                                        isSafe 
                                        ? 'border-trenchcoat text-trenchcoat bg-white/5' 
                                        : 'border-siren text-siren bg-siren/10'
                                    }`}>
                                        {category.label}
                                    </span>
                                    <span className="text-[9px] text-text-secondary font-mono mt-0.5 max-w-[150px] leading-tight text-right">
                                        {category.reason}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* URL */}
                    <div className="mb-4">
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Target URL</p>
                        <p className="text-sm text-text-primary font-mono break-all bg-black/20 p-2 rounded border border-white/5 selection:bg-white/20">
                            {result.url}
                        </p>
                    </div>

                    {/* Verdict */}
                    <p className="text-sm text-text-secondary mb-5 leading-relaxed border-l-2 border-white/10 pl-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {result.verdict}
                    </p>

                    {/* Findings */}
                    {result.findings && result.findings.length > 0 && (
                        <div className="mb-4">
                            <p className="text-[10px] font-mono font-bold text-text-muted mb-2 uppercase tracking-widest">Forensic Analysis</p>
                            <ul className="space-y-2">
                                {result.findings.map((finding, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary font-mono leading-relaxed animate-fade-in-right" style={{ animationDelay: `${300 + (i * 100)}ms` }}>
                                        <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${result.threat_level === 'dangerous' ? 'bg-siren' :
                                            result.threat_level === 'suspicious' ? 'bg-trenchcoat' : 'bg-neon-cyan'
                                            }`} />
                                        {finding}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted pt-4 border-t border-white/5">
                        <span className="uppercase tracking-widest">Logged:</span>
                        {formattedDate}
                    </div>
                </div>
            </div>
        </div>
    );
}
