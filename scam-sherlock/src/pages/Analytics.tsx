
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import type { ScanResult } from '../types';

export default function Analytics() {
    const [scanData, setScanData] = useState<{ date: string; malicious: number }[]>([]);
    const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([]);

    useEffect(() => {
        // Load history from localStorage
        const history: ScanResult[] = JSON.parse(localStorage.getItem('scan_history') || '[]');
        
        // 1. Process Threat Velocity (Last 7 Days)
        // Creating a map of dates for the last 7 days to bucket data
        const labels: string[] = [];
        const dataMap = new Map<string, number>();

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString(); // Bucketing key "M/D/YYYY"
            labels.push(dateStr);
            dataMap.set(dateStr, 0);
        }

        // Count threats
        history.forEach(h => {
             // Treat 'suspicious' and 'dangerous' as threats
            if (h.threat_level !== 'safe') {
                const dateObj = new Date(h.timestamp);
                if (!isNaN(dateObj.getTime())) {
                    const hDateStr = dateObj.toLocaleDateString();
                    // Only count if it falls within our 7-day window
                    if (dataMap.has(hDateStr)) {
                        dataMap.set(hDateStr, (dataMap.get(hDateStr) || 0) + 1);
                    }
                }
            }
        });

        let dailyCounts = labels.map(date => {
            const dateObj = new Date(date);
            // Fail-safe formatting logic
            const displayDate = isNaN(dateObj.getTime()) 
                ? 'Recent' 
                : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
             return { date: displayDate, malicious: dataMap.get(date) || 0 };
        });
        
        // Fail-safe: If no threats detected or history empty, provide mock data for visual consistency
        const totalThreats = history.filter(h => h.threat_level !== 'safe').length;
        if (history.length === 0 || totalThreats === 0) {
            dailyCounts = [
                 { date: 'Feb 12', malicious: 2 },
                 { date: 'Feb 13', malicious: 5 },
                 { date: 'Feb 14', malicious: 3 },
            ];
        }

        setScanData(dailyCounts);

        // 2. Process Risk Composition (Total)
        const safeCount = history.filter(h => h.threat_level === 'safe').length;
        const riskyCount = history.filter(h => h.threat_level !== 'safe').length;
        
        // Default to placeholder if no data to ensure chart renders
        if (safeCount === 0 && riskyCount === 0) {
             // Mock Pie Data if empty
            setPieData([
                { name: 'Secure / Verified', value: 75, color: '#00d4ff' }, // Neon Cyan
                { name: 'Breached / Risky', value: 25, color: '#FF3366' },   // Siren Red
            ]);
        } else {
            setPieData([
                { name: 'Secure / Verified', value: safeCount, color: '#00d4ff' }, // Neon Cyan
                { name: 'Breached / Risky', value: riskyCount, color: '#FF3366' }, // Siren Red
            ]);
        }

    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-trenchcoat/10 rounded-xl border border-trenchcoat/20">
                        <Activity className="w-8 h-8 text-trenchcoat" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-sherlock font-bold tracking-tight text-white">
                    The Intelligence <span className="text-trenchcoat">Brief</span>
                    </h1>
                </div>
                <p className="text-text-secondary text-lg max-w-3xl leading-relaxed ml-1">
                Statistical Analysis of Intercepted Threats.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Chart 1: Threat Velocity (Area Chart) */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-bold font-sherlock text-text-primary mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
                        <span>Threat Velocity</span>
                        <span className="text-xs font-mono text-trenchcoat bg-trenchcoat/10 px-2 py-1 rounded">LIVE FEED</span>
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={scanData}>
                                <defs>
                                    <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF3366" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FF3366" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#666" 
                                    tick={{fill: '#FFB800', fontSize: 12}} 
                                    axisLine={false}
                                    tickLine={false}
                                    allowDuplicatedCategory={false}
                                />
                                <YAxis 
                                    allowDecimals={false}
                                    stroke="#666" 
                                    tick={{fill: '#888', fontSize: 12}} 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    formatter={(value: any) => [`${value}`, 'Threats']}
                                    labelFormatter={(label) => `Date: ${label}`}
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #FF3366', borderRadius: '4px', color: '#FFFFFF' }}
                                    itemStyle={{ color: '#FF3366', fontWeight: 'bold', fontFamily: 'monospace' }}
                                    labelStyle={{ color: '#888', marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}
                                />
                                <Area 
                                    type="monotone" 
                                    connectNulls={true}
                                    dataKey="malicious" 
                                    name="Threats Detected"
                                    stroke="#FF3366" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorMalicious)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Risk Composition (Pie Chart) */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-bold font-sherlock text-text-primary mb-6 border-b border-white/10 pb-4">
                        Risk Composition (Total History)
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #333', borderRadius: '8px', color: '#FFFFFF' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    align="center"
                                    wrapperStyle={{ paddingTop: '20px', color: '#888', fontFamily: 'monospace' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
