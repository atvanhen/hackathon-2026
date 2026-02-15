
import { ShieldAlert, Globe, Type, GraduationCap, MousePointer, Smartphone, BadgeCheck, ExternalLink, Headphones, BookOpen } from 'lucide-react';

export default function TrainingDossier() {
  const strategies = [
    {
      title: "Typosquatting (The Clone)",
      icon: Type,
      description: "Scammers register common misspellings of popular domains to catch users who type too fast or don't look closely. This relies on visual similarity and muscle memory.",
      examples: [
        { label: "Safe", text: "https://www.paypal.com" },
        { label: "Scam", text: "https://www.paypa1.com", highlight: "1" }
      ]
    },
    {
      title: "Subdomain Masking (The Trojan Horse)",
      icon: Globe,
      description: "Attackers use a long subdomain to hide the actual malicious root domain. On mobile devices, the address bar often truncates the URL, showing only the 'safe' part.",
      examples: [
        { label: "Safe", text: "https://support.apple.com" },
        { label: "Scam", text: "https://apple.customer-support-update.com", highlight: "customer-support-update.com" }
      ]
    },
    {
      title: "Homograph Attacks (The Illusion)",
      icon: ShieldAlert,
      description: "Advanced attackers use characters from different alphabets (like Cyrillic or Greek) that look visually identical to Latin letters. Your browser sees a different website entirely.",
      examples: [
        { label: "Safe", text: "apple.com" },
        { label: "Scam", text: "аpple.com", highlight: "а" } // Using Cyrillic 'a'
      ]
    }
  ];

  const podcasts = [
    { title: "Darknet Diaries", host: "Jack Rhysider", link: "https://darknetdiaries.com" },
    { title: "Hacking Humans", host: "CyberWire", link: "https://thecyberwire.com/podcasts/hacking-humans" },
    { title: "The Perfect Scam", host: "AARP", link: "https://www.aarp.org/podcasts/the-perfect-scam/" }
  ];

  const articles = [
    { title: "The Anatomy of a Phish", source: "Krebs on Security", link: "https://krebsonsecurity.com" },
    { title: "2026 Threat Landscape", source: "FTC Consumer Alerts", link: "https://consumer.ftc.gov/scams" }
  ];

  const renderUrl = (text: string, highlight?: string) => {
    if (!highlight) return text;
    const parts = text.split(highlight);
    return (
      <span>
        {parts[0]}
        <span className="text-siren font-bold bg-siren/10 px-0.5 rounded">{highlight}</span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-trenchcoat/10 rounded-xl border border-trenchcoat/20">
                <GraduationCap className="w-8 h-8 text-trenchcoat" />
            </div>
            <h1 className="text-4xl md:text-5xl font-sherlock font-bold tracking-tight text-white">
            The Training <span className="text-trenchcoat">Dossier</span>
            </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-3xl leading-relaxed ml-1">
          Identifying threat signatures is the first line of defense. 
          Use this dossier to recognize the subtle signatures of digital deception before they compromise your perimeter.
        </p>
      </div>

      {/* Section 1: Threat Tactics */}
      <section className="space-y-8">
        <h2 className="text-2xl font-sherlock font-bold text-white border-b border-white/10 pb-4">
          Tactical Profiles: Deception Patterns
        </h2>
        <div className="grid gap-8">
          {strategies.map((strategy, idx) => (
            <div 
              key={idx}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-trenchcoat/30 hover:bg-white/[0.07]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-trenchcoat/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-trenchcoat/10 transition-all duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-noir-bg border border-white/10 flex items-center justify-center text-trenchcoat shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <strategy.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary mb-2 font-sherlock tracking-wide">
                      {strategy.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>
                  <div className="bg-noir-bg rounded-lg border border-white/5 p-4 font-mono text-sm space-y-3 shadow-inner">
                    {strategy.examples.map((ex, i) => (
                      <div key={i} className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                        <span className={`w-12 text-xs uppercase tracking-wider font-bold shrink-0 ${ex.label === 'Safe' ? 'text-accent-green' : 'text-siren'}`}>
                          {ex.label}
                        </span>
                        <span className="text-text-primary/80 break-all border-b border-transparent hover:border-white/20 transition-colors">
                          {renderUrl(ex.text, ex.highlight)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Hover & Intercept */}
      <section className="space-y-8">
        <h2 className="text-2xl font-sherlock font-bold text-white border-b border-white/10 pb-4">
          Technique: Peeking Behind the Hyperlink
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
            {/* Desktop Technique */}
            <div className="bg-noir-panel border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4 text-trenchcoat">
                    <MousePointer className="w-6 h-6" />
                    <h3 className="text-lg font-bold font-sherlock">Desktop: The Hover Trick</h3>
                </div>
                <p className="text-text-secondary mb-6 text-sm leading-relaxed">
                    Move your cursor over a link <span className="text-white font-bold">without clicking</span>. 
                    Inspect the bottom-left corner of your browser. This reveals the true destination URL, often hidden behind deceptive text.
                </p>
                <div className="bg-noir-bg border border-white/5 rounded-lg p-4 font-mono text-xs space-y-2">
                    <div className="text-text-muted">Link Text: <span className="text-accent-blue underline decoration-dotted">Update Bank Info</span></div>
                    <div className="flex items-center gap-2 text-siren">
                        <span>↳</span>
                        <span>Actual URL: http://scam-site.ru/login</span>
                    </div>
                </div>
            </div>

            {/* Mobile Technique */}
            <div className="bg-noir-panel border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4 text-trenchcoat">
                    <Smartphone className="w-6 h-6" />
                    <h3 className="text-lg font-bold font-sherlock">Mobile: The Long Press</h3>
                </div>
                <p className="text-text-secondary mb-6 text-sm leading-relaxed">
                    Tap and <span className="text-white font-bold">hold</span> the link for 2 seconds. 
                    A preview menu will appear showing the full URL at the top. Never tap and release quickly on unknown links.
                </p>
                <div className="bg-noir-bg border border-white/5 rounded-lg p-4 font-mono text-xs space-y-2">
                   <div className="text-text-muted">Link Text: <span className="text-accent-blue underline decoration-dotted">Verify Account</span></div>
                   <div className="flex items-center gap-2 text-siren">
                        <span>↳</span>
                        <span>Preview: www.secure-verify-update.net</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Section 3: Domain Verification */}
      <section className="space-y-8">
        <h2 className="text-2xl font-sherlock font-bold text-white border-b border-white/10 pb-4">
          Identifying Official Clearance (Domains)
        </h2>
        <div className="bg-gradient-to-br from-trenchcoat/10 to-transparent border border-trenchcoat/20 rounded-xl p-8 relative">
            <div className="absolute top-6 right-6 opacity-20">
                <BadgeCheck className="w-24 h-24 text-trenchcoat" />
            </div>
            
            <h3 className="text-xl font-bold text-trenchcoat font-sherlock mb-4 flex items-center gap-2">
                <BadgeCheck className="w-6 h-6" />
                The Domain Authority Rule
            </h3>
            <p className="text-text-primary text-lg mb-6 leading-relaxed max-w-2xl">
                Legitimate organizations send emails from dedicated, professional domains. 
                If an "official" notice comes from a public provider or a scrambled address, 
                it is <span className="text-siren font-bold">unauthorized</span>.
            </p>

            <div className="space-y-4 font-mono text-sm max-w-2xl">
                <div className="flex items-center gap-4 bg-noir-bg/50 p-3 rounded-lg border border-white/5">
                    <div className="text-siren font-bold w-12 text-right">FAKE</div>
                    <div className="text-text-secondary">support-amazon-verify@gmail.com</div>
                </div>
                <div className="flex items-center gap-4 bg-noir-bg/50 p-3 rounded-lg border border-white/5">
                    <div className="text-accent-green font-bold w-12 text-right">REAL</div>
                    <div className="text-text-secondary">support@amazon.com</div>
                </div>
                <div className="mt-6 pt-4 border-t border-trenchcoat/20">
                    <p className="text-trenchcoat font-sans font-bold mb-2">University Protocol (NCSU)</p>
                    <p className="text-text-secondary mb-2">
                        Official university business will ALWAYS originate from a verified <span className="text-white bg-white/10 px-1 rounded">.edu</span> domain.
                    </p>
                    <div className="flex items-center gap-4 bg-noir-bg/80 p-3 rounded-lg border border-trenchcoat/30 text-trenchcoat">
                        <div className="font-bold w-12 text-right">SAFE</div>
                        <div>noreply@ncsu.edu</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Section 4: Intelligence Library */}
      <section className="space-y-8">
        <h2 className="text-2xl font-sherlock font-bold text-white border-b border-white/10 pb-4">
          Intelligence Library
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
            {/* Articles */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-primary font-bold font-sherlock mb-2">
                    <BookOpen className="w-5 h-5 text-trenchcoat" />
                    <span>Field Reports (Articles)</span>
                </div>
                <div className="grid gap-3">
                    {articles.map((art, i) => (
                        <a key={i} href={art.link} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-text-primary font-medium group-hover:text-trenchcoat transition-colors">{art.title}</h4>
                                        <p className="text-text-muted text-xs mt-1">{art.source}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-trenchcoat" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Podcasts */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-primary font-bold font-sherlock mb-2">
                    <Headphones className="w-5 h-5 text-trenchcoat" />
                    <span>Audio Surveillance (Podcasts)</span>
                </div>
                <div className="grid gap-3">
                    {podcasts.map((pod, i) => (
                        <a key={i} href={pod.link} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all duration-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-text-primary font-medium group-hover:text-trenchcoat transition-colors">{pod.title}</h4>
                                        <p className="text-text-muted text-xs mt-1">Host: {pod.host}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-trenchcoat" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="text-center pt-8 border-t border-white/5">
        <p className="text-text-muted text-sm font-mono opacity-60">
          // END OF DOSSIER // KNOWLEDGE IS SECURITY
        </p>
      </div>
    </div>
  );
}
