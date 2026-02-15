
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity } from 'lucide-react';

// MOCK DATA: Simulating a 7-day threat landscape
const MOCK_SCANS = [
  { date: 'Feb 08', safe: 45, malicious: 12 },
  { date: 'Feb 09', safe: 52, malicious: 8 },
  { date: 'Feb 10', safe: 38, malicious: 15 },
  { date: 'Feb 11', safe: 65, malicious: 4 },
  { date: 'Feb 12', safe: 48, malicious: 22 }, // Spike in threats
  { date: 'Feb 13', safe: 55, malicious: 10 },
  { date: 'Feb 14', safe: 60, malicious: 7 },
];

const PIE_DATA = [
  { name: 'Secure / Verified', value: 363, color: '#FFB800' }, // Trenchcoat Amber
  { name: 'Breached / Risky', value: 78, color: '#FF3366' },   // Siren Red
];

export default function Analytics() {
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
                <span>Threat Velocity (7 Days)</span>
                <span className="text-xs font-mono text-trenchcoat bg-trenchcoat/10 px-2 py-1 rounded">LIVE FEED</span>
            </h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_SCANS}>
                        <defs>
                            <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFB800" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#FFB800" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="date" 
                            stroke="#666" 
                            tick={{fill: '#888', fontSize: 12}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#666" 
                            tick={{fill: '#888', fontSize: 12}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                            itemStyle={{ color: '#FFB800' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="malicious" 
                            name="Threats Detected"
                            stroke="#FFB800" 
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
                Risk Composition (Global)
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                        <Pie
                            data={PIE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {PIE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #FFB800', borderRadius: '8px', color: '#FFFFFF' }}
                            itemStyle={{ color: '#FFB800' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            align="center"
                            wrapperStyle={{ paddingTop: '20px', color: '#FFB800', fontFamily: 'monospace' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}
