export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
            {/* Pulsing shield */}
            <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-accent-green/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="relative w-20 h-20 rounded-full glass flex items-center justify-center glow-green">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-2">Scanning Target...</h3>
            <p className="text-sm text-text-secondary mb-6">Launching headless browser & capturing screenshot</p>

            {/* Animated progress bar */}
            <div className="w-64 h-1 rounded-full bg-bg-secondary overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan"
                    style={{
                        animation: 'shimmer 1.5s ease-in-out infinite',
                        width: '60%',
                    }}
                />
            </div>
        </div>
    );
}
