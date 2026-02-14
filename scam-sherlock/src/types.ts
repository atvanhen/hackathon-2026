export interface ScanResult {
    id: string;
    url: string;
    timestamp: string;
    screenshot_base64: string;
    threat_level: 'safe' | 'suspicious' | 'dangerous';
    risk_score: number;
    verdict: string;
    findings: string[];
}
