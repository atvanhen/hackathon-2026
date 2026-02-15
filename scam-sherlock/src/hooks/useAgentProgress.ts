
import { useState, useEffect } from 'react';
import { getXP, incrementXP, getCurrentRank, getProgressToNextRank, RANKS } from '../utils/gamification';

// Stats Interfaces
interface AgentStats {
    totalScans: number;
    totalCharsProcessed: number;
    reportsSent: number;
}

// Badge Requirements
export const ACHIEVEMENT_REQUIREMENTS = {
    first_intercept: { type: 'totalScans', target: 1, nextTarget: 10, nextTitle: 'Elite Interceptor' },
    bulk_extractor: { type: 'totalCharsProcessed', target: 500, nextTarget: 5000, nextTitle: 'Data Hoarder' },
    report_specialist: { type: 'reportsSent', target: 3, nextTarget: 15, nextTitle: 'Justice Bringer' }
};

export function useAgentProgress() {
    const [xp, setXp] = useState(0);
    const [rank, setRank] = useState(RANKS[0]);
    const [progress, setProgress] = useState({ percent: 0, nextRank: RANKS[1] });
    const [stats, setStats] = useState<AgentStats>({
        totalScans: 0,
        totalCharsProcessed: 0,
        reportsSent: 0
    });

    // Initial load
    useEffect(() => {
        updateState();

        // Listen for updates from other tabs or components
        window.addEventListener('xp-updated', updateState);
        window.addEventListener('stats-updated', updateState);

        return () => {
            window.removeEventListener('xp-updated', updateState);
            window.removeEventListener('stats-updated', updateState);
        };
    }, []);

    const updateState = () => {
        const currentXP = getXP();
        setXp(currentXP);
        setRank(getCurrentRank(currentXP));
        // @ts-ignore
        setProgress(getProgressToNextRank(currentXP));

        // Load Stats
        const savedStats = localStorage.getItem('agent_stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    };

    const addXP = (amount: number) => {
        incrementXP(amount);
        return amount;
    };

    // Helper to update specific stats
    const incrementStat = (key: keyof AgentStats, amount: number = 1) => {
        const currentStats = { ...stats };
        currentStats[key] += amount;

        setStats(currentStats);
        localStorage.setItem('agent_stats', JSON.stringify(currentStats));
        window.dispatchEvent(new Event('stats-updated'));
    };

    return {
        xp,
        rank,
        progress,
        stats,
        addXP,
        incrementStat
    };
}
