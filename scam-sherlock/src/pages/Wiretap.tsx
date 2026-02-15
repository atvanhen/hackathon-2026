
import { useState, useEffect } from 'react';
import { Copy, FileText, Check, Trash2 } from 'lucide-react';
import { useAgentProgress } from '../hooks/useAgentProgress';

export default function Wiretap() {
  const { addXP, incrementStat } = useAgentProgress();
  // ...
  // Lazy state initialization from localStorage
  const [rawText, setRawText] = useState(() => {
    return localStorage.getItem('wiretap_text') || '';
  });
  
  const [extractedUrls, setExtractedUrls] = useState<string[]>(() => {
    const saved = localStorage.getItem('wiretap_urls');
    return saved ? JSON.parse(saved) : [];
  });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [xpNotification, setXpNotification] = useState<string | null>(null);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('wiretap_text', rawText);
    localStorage.setItem('wiretap_urls', JSON.stringify(extractedUrls));
  }, [rawText, extractedUrls]);

  const handleExtract = () => {
    if (!rawText.trim()) {
      setExtractedUrls([]);
      return;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = rawText.match(urlRegex);
    const results = matches ? Array.from(new Set(matches)) : [];
    
    setExtractedUrls(results); // Deduplicate results

    if (results.length > 0) {
        addXP(50);
        incrementStat('totalCharsProcessed', rawText.length);
        setXpNotification(`+50 XP: ${results.length} Links Found`);
        setTimeout(() => setXpNotification(null), 3000);
    }
  };

  const handleClear = () => {
    setRawText('');
    setExtractedUrls([]);
    localStorage.removeItem('wiretap_text');
    localStorage.removeItem('wiretap_urls');
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up relative">
      {/* XP Notification */}
      {xpNotification && (
         <div className="fixed top-24 right-8 z-50 animate-bounce-in">
            <div className="bg-trenchcoat text-noir-bg font-bold font-mono px-4 py-2 rounded shadow-[0_0_15px_rgba(255,184,0,0.6)] flex items-center gap-2">
                <span>{xpNotification}</span>
                <span className="text-xl">✨</span>
            </div>
         </div>
      )}
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-sherlock font-bold tracking-tight">
          The Wiretap: <span className="text-trenchcoat">Link Interceptor</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Paste any raw text, email headers, or chat logs below. Our system will isolate
          suspicious URLs for further analysis.
        </p>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-trenchcoat/20 to-siren/20 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw data stream here for analysis..."
          spellCheck={false}
          className="relative block w-full h-64 bg-noir-bg/50 backdrop-blur-md border border-white/10 text-text-primary p-6 rounded-xl focus:border-trenchcoat/50 focus:ring-1 focus:ring-trenchcoat/50 focus:outline-none transition-all duration-300 font-mono text-sm resize-none placeholder:text-text-muted"
        />
        <div className="absolute bottom-4 right-4 text-xs font-mono text-text-muted opacity-50">
          Authorization: {rawText.length > 0 ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <button
          onClick={handleClear}
          className="px-6 py-3 text-text-muted hover:text-white border border-white/10 hover:bg-white/5 rounded-lg font-mono text-sm transition-all duration-200 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Dossier
        </button>
        
        <button
          onClick={handleExtract}
          disabled={!rawText.trim()}
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-trenchcoat text-noir-bg font-bold font-mono uppercase tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,184,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          <span className="relative z-10 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Intercept Links
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      {/* Extracted URLs Output */}
      <div className="border-t border-white/5 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-sherlock font-bold flex items-center gap-3">
            <span className={`w-1.5 h-1.5 rounded-full ${extractedUrls.length > 0 ? 'bg-siren animate-pulse' : 'bg-white/20'}`} />
            Intercepted Signals ({extractedUrls.length})
          </h2>
        </div>

        {extractedUrls.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-text-muted font-mono">No signals intercepted. Awaiting input stream.</p>
          </div>
        ) : (
          <div className="grid gap-3 animate-fade-in-up">
            {extractedUrls.map((url, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-noir-panel border border-white/5 rounded-lg hover:border-trenchcoat/30 transition-all duration-300"
              >
                <code className="text-trenchcoat font-mono text-sm break-all pr-4 select-all">
                  {url}
                </code>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(url, index)}
                    className="flex-shrink-0 p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-accent-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
