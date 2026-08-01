export default function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0f', flexDirection: 'column', gap: '1.5rem' }}>
      {/* CoreWealth Shield Logo */}
      <div style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}>
        <svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" fill="none">
          <path d="M12 2L3 7v6c0 5.25 3.83 10.15 9 11.25C17.17 23.15 21 18.25 21 13V7L12 2z" fill="#7C3AED" opacity="0.15" stroke="#7C3AED" strokeWidth="1.5"/>
          <path d="M9 12.5l2 2 4-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Spinning ring */}
      <div style={{ width: 32, height: 32, border: '2px solid #333', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px rgba(124,58,237,0.3)); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 12px rgba(124,58,237,0.6)); }
        }
      `}</style>
      <p style={{ color: '#666', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Loading CoreWealth Bank...</p>
    </div>
  );
}
