import { useState } from 'react';
import HeroSection from './components/HeroSection';
import ScanFeed from './components/ScanFeed';
import LoadingSpinner from './components/LoadingSpinner';
import type { ScanResult } from './types';

function App() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Scan failed: ${response.statusText}`);
      }

      const data: ScanResult = await response.json();
      setResults((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir-bg relative selection:bg-trenchcoat selection:text-noir-bg">
      <div className="bg-grain"></div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-trenchcoat-dim">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-trenchcoat/10 border border-trenchcoat/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-trenchcoat">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span className="text-lg font-bold font-sherlock tracking-widest uppercase text-text-primary">
              Scam<span className="text-trenchcoat drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]">Sherlock</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-trenchcoat/80">
              <span className="w-1.5 h-1.5 rounded-full bg-trenchcoat animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content (below fixed navbar) */}
      <main className="relative pt-24 pb-12 z-10">
        <HeroSection onScan={handleScan} isLoading={isLoading} />

        {/* Error banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded bg-siren-dim border border-siren/30 text-siren font-mono text-sm animate-flicker">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="uppercase tracking-wide">ERROR: {error}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Results Feed */}
        {!isLoading && <ScanFeed results={results} />}
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-trenchcoat-dim py-8 text-center text-xs font-mono text-text-muted relative z-10">
        <span className="opacity-50">EST. 2026 &middot; DECENTRALIZED THREAT INTELLIGENCE</span>
      </footer>
    </div>
  );
}

export default App;
