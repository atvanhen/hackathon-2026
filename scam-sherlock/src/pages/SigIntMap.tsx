
import { Globe, Radio, Activity } from 'lucide-react';

const TOP_HOTSPOTS = [
    { rank: 1, name: 'RALEIGH, NC', status: 'HOTZONE', progress: 85, color: 'text-siren' },
    { rank: 2, name: 'MUMBAI, INDIA', status: 'DORMANT', progress: 0, color: 'text-white/20' },
    { rank: 3, name: 'LONDON, UK', status: 'DORMANT', progress: 0, color: 'text-white/20' },
    { rank: 4, name: 'SINGAPORE', status: 'DORMANT', progress: 0, color: 'text-white/20' },
    { rank: 5, name: 'NEW YORK, NY', status: 'DORMANT', progress: 0, color: 'text-white/20' },
];

const LAST_INTERCEPTS = [
    "[05:42 AM] - SIGNAL INTERCEPT - RALEIGH HUB - SOURCE: NCSU-CAMPUS-WIFI",
    "[05:38 AM] - THREAT DETECTED - RALEIGH HUB - TYPE: PHISH_LINK",
    "[05:30 AM] - SHIELD ACTIVE - RALEIGH HUB - STATUS: MONITORING"
];

export default function SigIntMap() {
    // Static counter to match recent XP progress roughly
    const counter = 24;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            
            {/* Header / Digital Counter */}
            <div className="text-center space-y-2 mb-12">
                <div className="inline-flex items-center gap-2 text-trenchcoat/80 font-mono text-sm tracking-widest uppercase border border-trenchcoat/20 px-4 py-1 rounded-full">
                    <Radio className="w-4 h-4 animate-pulse" />
                    Global SigInt Monitor
                </div>
                <h1 className="text-5xl md:text-7xl font-mono font-bold text-white tracking-tighter">
                    {counter}
                </h1>
                <p className="text-text-secondary text-sm font-mono tracking-widest uppercase">
                    Total Global Intercepts
                </p>
            </div>

            {/* Hotspots List */}
            <div className="bg-noir-panel border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-sherlock font-bold text-white flex items-center gap-3">
                        <Globe className="w-6 h-6 text-trenchcoat" />
                        ACTIVE <span className="text-trenchcoat">HOTSPOTS</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-siren rounded-full animate-ping" />
                        <span className="text-xs font-mono text-siren">LIVE FEED</span>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {TOP_HOTSPOTS.map((hotspot) => (
                        <div key={hotspot.rank} className="p-6 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-white/20 text-xl font-bold">0{hotspot.rank}</span>
                                    <div>
                                        <h3 className={`font-bold text-lg tracking-wide flex items-center gap-2 ${hotspot.color === 'text-white/20' ? 'text-text-muted' : 'text-trenchcoat'}`}>
                                            {hotspot.name}
                                            {hotspot.status === 'HOTZONE' && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-siren animate-pulse" />
                                            )}
                                        </h3>
                                        <span className={`text-[10px] font-mono tracking-wider ${hotspot.color} bg-white/5 px-2 py-0.5 rounded`}>
                                            {hotspot.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-text-muted font-mono mb-1">RELATIVE LOCAL THREAT LEVEL</div>
                                    <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${hotspot.color.replace('text-', 'bg-')} transition-all duration-1000`} 
                                            style={{ width: `${hotspot.progress}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Footer Status with Static Logs */}
                <div className="bg-black/40 border-t border-white/5">
                    <div className="p-4 border-b border-white/5 text-xs font-mono text-text-muted uppercase tracking-wider">
                        Latest Wireless Intercepts (Raleigh Node)
                    </div>
                    <div className="p-4 space-y-2 font-mono text-xs">
                        {LAST_INTERCEPTS.map((log, i) => (
                            <div key={i} className="text-trenchcoat/80 border-l-2 border-trenchcoat/30 pl-3">
                                {log}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-black/20 border-t border-white/5 flex justify-between items-center text-xs font-mono text-text-muted">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-trenchcoat" />
                            SYSTEM: ONLINE
                        </div>
                        <div>
                            NODE: RALEIGH-PRIMARY
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
