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
    <div className="min-h-screen bg-bg-primary">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-bg-primary">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">
              Scam<span className="gradient-text">Sherlock</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              Scanner Online
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content (below fixed navbar) */}
      <main className="pt-16">
        <HeroSection onScan={handleScan} isLoading={isLoading} />

        {/* Error banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-accent-red/30 bg-accent-red/5 text-accent-red text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Results Feed */}
        {!isLoading && <ScanFeed results={results} />}
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border-subtle py-6 text-center text-xs text-text-muted">
        Built for <span className="text-text-secondary font-medium">The Big Score</span> hackathon &middot; Scam Sherlock &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
