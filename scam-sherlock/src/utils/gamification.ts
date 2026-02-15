
// Constants for rank progression
export const RANKS = [
    { name: 'Rookie Informant', minXP: 0 },
    { name: 'Field Agent', minXP: 500 },
    { name: 'Senior Detective', minXP: 1000 },
    { name: 'Director of Intelligence', minXP: 2500 }
];

export const BADGES = [
    { id: 'first_intercept', title: 'First Interception', description: 'Used the Scanner for the first time.', icon: '🕵️' },
    { id: 'bulk_extractor', title: 'Bulk Extractor', description: 'Analyzed over 500 characters in Wiretap.', icon: '📂' },
    { id: 'report_specialist', title: 'Report Specialist', description: 'Dispatched 3+ reports to authorities.', icon: '🚨' }
];

// Helper to get current XP
export const getXP = (): number => {
    const xp = localStorage.getItem('agent_xp');
    return xp ? parseInt(xp, 10) : 0;
};

// Helper to increment XP
export const incrementXP = (amount: number) => {
    const current = getXP();
    const newAmount = current + amount;
    localStorage.setItem('agent_xp', newAmount.toString());

    // Dispatch a custom event so the UI can update instantly
    window.dispatchEvent(new Event('xp-updated'));

    return newAmount;
};

// Helper to calculate current rank
export const getCurrentRank = (xp: number) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].minXP) {
            return RANKS[i];
        }
    }
    return RANKS[0];
};

// Helper to get progress to next rank
export const getProgressToNextRank = (xp: number) => {
    const currentRank = getCurrentRank(xp);
    const nextRankIndex = RANKS.findIndex(r => r.name === currentRank.name) + 1;
    const nextRank = RANKS[nextRankIndex];

    if (!nextRank) return 100; // Max level

    const totalRange = nextRank.minXP - currentRank.minXP;
    const progress = xp - currentRank.minXP;
    const percent = Math.min(100, Math.max(0, (progress / totalRange) * 100));

    return { percent, nextRank };
};
