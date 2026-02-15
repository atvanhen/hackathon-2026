
import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import ScanFeed from '../components/ScanFeed';
import LoadingSpinner from '../components/LoadingSpinner';
import type { ScanResult } from '../types';
import { useAgentProgress } from '../hooks/useAgentProgress';

export default function Scanner() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpNotification, setXpNotification] = useState<string | null>(null);
  const { addXP, incrementStat } = useAgentProgress();

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
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          // response wasn't JSON, keep statusText
        }
        throw new Error(`Scan failed: ${errorMessage}`);
      }

      const data: ScanResult = await response.json();
      setResults((prev) => [data, ...prev]);
      
      // Award XP & Stat
      addXP(50);
      incrementStat('totalScans', 1);
      
      setXpNotification('+50 XP');
      setTimeout(() => setXpNotification(null), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 relative">
      {/* XP Notification */}
      {xpNotification && (
         <div className="fixed top-24 right-8 z-50 animate-bounce-in">
            <div className="bg-trenchcoat text-noir-bg font-bold font-mono px-4 py-2 rounded shadow-[0_0_15px_rgba(255,184,0,0.6)] flex items-center gap-2">
                <span>{xpNotification}</span>
                <span className="text-xl">✨</span>
            </div>
         </div>
      )}

      <HeroSection onScan={handleScan} isLoading={isLoading} />

      {/* Error banner */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 mb-8 animate-fade-in-up">
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
    </div>
  );
}
