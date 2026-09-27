export default function Mascot({ size = 120, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Glow effect */}
        <circle cx="100" cy="100" r="90" fill="url(#glowGradient)" opacity="0.3" />
        
        {/* Flame Body */}
        <path 
          d="M100 15C100 15 50 65 50 115C50 142.614 72.3858 165 100 165C127.614 165 150 142.614 150 115C150 85 115 50 100 15Z" 
          fill="url(#flameGradient)" 
        />
        
        {/* Inner Flame */}
        <path 
          d="M100 50C100 50 70 85 70 120C70 136.569 83.4315 150 100 150C116.569 150 130 136.569 130 120C130 95 110 65 100 50Z" 
          fill="#FEF08A" 
        />
        
        {/* Eyes (Cute) */}
        <ellipse cx="85" cy="110" rx="8" ry="12" fill="#1E293B" />
        <ellipse cx="115" cy="110" rx="8" ry="12" fill="#1E293B" />
        <circle cx="83" cy="105" r="3" fill="white" />
        <circle cx="113" cy="105" r="3" fill="white" />
        
        {/* Smile */}
        <path d="M90 125Q100 135 110 125" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        
        {/* Left Arm holding Barbell */}
        <path d="M40 120Q30 100 15 100" stroke="url(#flameGradient)" strokeWidth="12" strokeLinecap="round" />
        {/* Right Arm holding Barbell */}
        <path d="M160 120Q170 100 185 100" stroke="url(#flameGradient)" strokeWidth="12" strokeLinecap="round" />
        
        {/* Barbell */}
        <rect x="5" y="95" width="190" height="10" rx="5" fill="#94A3B8" />
        {/* Weights Left */}
        <rect x="10" y="80" width="15" height="40" rx="4" fill="#334155" />
        <rect x="25" y="85" width="10" height="30" rx="3" fill="#475569" />
        {/* Weights Right */}
        <rect x="175" y="80" width="15" height="40" rx="4" fill="#334155" />
        <rect x="165" y="85" width="10" height="30" rx="3" fill="#475569" />

        <defs>
          <linearGradient id="glowGradient" x1="100" y1="10" x2="100" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-primary-500)" />
            <stop offset="1" stopColor="var(--color-primary-100)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameGradient" x1="100" y1="15" x2="100" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316" />
            <stop offset="0.5" stopColor="var(--color-primary-500)" />
            <stop offset="1" stopColor="var(--color-primary-700)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
