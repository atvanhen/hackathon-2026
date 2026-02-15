
import { User, Target, Award, Star, Lock } from 'lucide-react';
import { BADGES, RANKS } from '../utils/gamification';
import { useAgentProgress, ACHIEVEMENT_REQUIREMENTS } from '../hooks/useAgentProgress';

export default function AgentProfile() {
  const { xp, rank, progress, stats } = useAgentProgress();
  
  // Custom theme colors for high ranks
  const isSenior = rank.name === 'Senior Detective' || rank.name === 'Director of Intelligence';
  const accentColor = isSenior ? 'text-accent-cyan' : 'text-trenchcoat';
  const barColor = isSenior ? 'from-accent-cyan/60 to-accent-cyan' : 'from-trenchcoat/60 to-trenchcoat';
  const bgAccent = isSenior ? 'bg-accent-cyan/10' : 'bg-trenchcoat/10';
  const borderAccent = isSenior ? 'border-accent-cyan/20' : 'border-trenchcoat/20';

  // Helper to check badge status
  const getBadgeStatus = (id: string) => {
    // @ts-ignore
    const req = ACHIEVEMENT_REQUIREMENTS[id];
    if (!req) return { unlocked: false, progress: 0, target: 100 };
    
    // @ts-ignore
    const currentVal = stats[req.type] || 0;
    const unlocked = currentVal >= req.target;
    // @ts-ignore
    const cap = Math.min(currentVal, req.target);
    const progressPercent = (cap / req.target) * 100;
    
    return { unlocked, progress: progressPercent, current: currentVal, target: req.target };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-24">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2">
            <div className={`p-3 ${bgAccent} rounded-xl border ${borderAccent}`}>
                <User className={`w-8 h-8 ${accentColor}`} />
            </div>
            <h1 className="text-4xl md:text-5xl font-sherlock font-bold tracking-tight text-white">
            Agent <span className={accentColor}>Profile</span>
            </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-3xl leading-relaxed ml-1">
            Official Service Record & Clearance Level
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* IDENTITY CARD (Larger, Left Column) */}
        <div className="md:col-span-1 space-y-6">
            <div className={`bg-noir-panel border ${isSenior ? 'border-accent-cyan/30' : 'border-trenchcoat/30'} rounded-xl p-6 relative overflow-hidden group`}>
                {/* Holographic animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isSenior ? 'from-accent-cyan/5' : 'from-trenchcoat/5'} to-transparent opacity-50 transition-opacity group-hover:opacity-80`}></div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Avatar Placeholder */}
                    <div className={`w-24 h-24 rounded-full bg-noir-bg border-2 ${isSenior ? 'border-accent-cyan' : 'border-trenchcoat'} flex items-center justify-center shadow-[0_0_20px_rgba(255,184,0,0.2)]`}>
                        <User className={`w-12 h-12 ${accentColor}`} />
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-sherlock font-bold text-white tracking-wide">
                            AGENT <span className={accentColor}>007</span>
                        </h2>
                        <span className={`text-xs font-mono text-white/80 ${bgAccent} px-2 py-1 rounded mt-2 inline-block`}>
                            CLEARANCE: LEVEL {RANKS.indexOf(rank) + 1}
                        </span>
                    </div>

                    <div className="w-full border-t border-white/10 pt-4 mt-2">
                        <div className="flex justify-between text-xs font-mono text-text-secondary mb-1">
                            <span>CURRENT XP</span>
                            <span className="text-white font-bold">{xp}</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono text-text-secondary">
                            <span>RANK</span>
                            <span className={`${accentColor} font-bold`}>{rank.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Mission/Status */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-sm font-bold text-text-muted font-mono uppercase mb-4 tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Mission Analytics
                </h3>
                <div className="space-y-3 mt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Total Scans</span>
                        <span className="font-mono text-white">{stats.totalScans}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Data Processed</span>
                        <span className="font-mono text-white">{stats.totalCharsProcessed} chars</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Reports Filed</span>
                        <span className="font-mono text-white">{stats.reportsSent}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* PROGRESS & BADGES (Right Column) */}
        <div className="md:col-span-2 space-y-8">
            
            {/* XP PROGRESS SECTION */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-md">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-xl font-bold font-sherlock text-white">Clearance Progress</h3>
                        <p className="text-sm text-text-secondary">
                            Next Promotion: <span className={`${accentColor} font-bold`}>{progress.nextRank ? progress.nextRank.name : 'MAX LEVEL'}</span>
                        </p>
                    </div>
                    <div className={`text-2xl font-mono font-bold ${accentColor}`}>
                        {Math.floor(progress.percent)}%
                    </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="relative h-4 w-full bg-noir-bg rounded-full overflow-hidden border border-white/10">
                    <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,184,0,0.5)]`}
                        style={{ width: `${progress.percent}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* BADGE GALLERY */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-md">
                <h3 className="text-xl font-bold font-sherlock text-white mb-6 flex items-center gap-2">
                    <Award className={`w-6 h-6 ${accentColor}`} />
                    Commendations & Badges
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {BADGES.map((badge) => {
                        const status = getBadgeStatus(badge.id);
                        
                        return (
                            <div 
                                key={badge.id}
                                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                                    status.unlocked 
                                    ? `bg-noir-bg border-${isSenior ? 'accent-cyan' : 'trenchcoat'}/30 shadow-[0_0_15px_rgba(255,184,0,0.1)]` 
                                    : 'bg-noir-bg/30 border-white/5 opacity-70 grayscale'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-2xl">{badge.icon}</span>
                                    {status.unlocked ? (
                                        <Star className={`w-5 h-5 ${accentColor} fill-${isSenior ? 'accent-cyan' : 'trenchcoat'} animate-pulse`} />
                                    ) : (
                                        <Lock className="w-4 h-4 text-text-muted" />
                                    )}
                                </div>
                                <h4 className={`font-bold text-sm mb-1 ${status.unlocked ? 'text-white' : 'text-text-muted'}`}>
                                    {badge.title}
                                </h4>
                                <p className="text-[10px] text-text-secondary leading-tight mb-3">
                                    {badge.description}
                                </p>

                                {/* Mini Progress Bar for Badge */}
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${status.unlocked ? (isSenior ? 'bg-accent-cyan' : 'bg-trenchcoat') : 'bg-white/30'}`}
                                        style={{ width: `${status.progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-right mt-1 font-mono text-text-muted">
                                    {status.current} / {status.target}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
