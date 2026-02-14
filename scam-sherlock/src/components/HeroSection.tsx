import { useState } from 'react';

interface HeroSectionProps {
    onScan: (url: string) => void;
    isLoading: boolean;
}

export default function HeroSection({ onScan, isLoading }: HeroSectionProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim() && !isLoading) {
            onScan(url.trim());
            setUrl('');
        }
    };

    return (
        <section className="relative pt-20 pb-16 px-4 overflow-hidden">
            {/* Background glow orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-green/5 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-cyan/5 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-text-secondary mb-8">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-glow" />
                    Real-time threat detection powered by AI
                </div>

                {/* Hero headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                    <span className="text-text-primary">Expose Scam Links</span>
                    <br />
                    <span className="gradient-text">Instantly.</span>
                </h1>

                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
                    Paste any suspicious URL below. Our AI-powered scanner captures a live screenshot,
                    analyzes the page, and delivers a threat verdict in seconds.
                </p>

                {/* Scan input card */}
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                    <div className="glass rounded-2xl p-2 flex items-center gap-2 glow-green transition-all duration-300 focus-within:border-accent-green/40">
                        {/* Shield icon */}
                        <div className="pl-4 text-accent-green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>

                        <input
                            id="url-input"
                            type="url"
                            placeholder="Paste suspicious URL here... (e.g. https://...)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted py-3 px-2 text-base"
                        />

                        <button
                            id="scan-button"
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer
                bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary
                hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-[1.02]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="15" />
                                    </svg>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    Scan Threat
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
