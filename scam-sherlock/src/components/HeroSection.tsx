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
        <section className="relative pt-12 pb-12 px-4 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-trenchcoat/20 to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">


                {/* Hero headline */}
                <h1 className="text-5xl md:text-7xl font-bold font-sherlock tracking-tight mb-6 leading-none text-text-primary uppercase">
                    Expose <span className="text-trenchcoat glow-trenchcoat text-glitch" data-text="Scam Links">Scam Links</span>
                    <br />
                    <span className="text-text-muted text-4xl md:text-6xl">Before They Strike.</span>
                </h1>

                <p className="text-lg font-mono text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed opacity-80">
                    Paste the suspect URL. Our agents will infiltrate the site, capture evidence, and deliver a verdict.
                </p>

                {/* Scan input card */}
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                    <div className="glass rounded p-1.5 flex items-center gap-2 transition-all duration-300 focus-within:border-trenchcoat/50 focus-within:shadow-[0_0_30px_rgba(255,184,0,0.1)]">
                        {/* Icon */}
                        <div className="pl-4 text-text-muted">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>

                        <input
                            id="url-input"
                            type="url"
                            placeholder="Ent3r suspic1ous URL..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted/50 py-3 px-2 text-sm font-mono tracking-wide"
                        />

                        <button
                            id="scan-button"
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="flex items-center gap-2 px-6 py-3 rounded font-bold font-sherlock text-sm transition-all duration-300 cursor-pointer uppercase tracking-wider
                bg-trenchcoat text-noir-bg
                hover:shadow-[0_0_20px_rgba(255,184,0,0.4)] hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:grayscale"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Scanning
                                </>
                            ) : (
                                "Investigate"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
