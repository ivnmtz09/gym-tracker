export default function Mascot({ size = 120, className = "", level = 1 }) {
  return (
    <div className={`relative ${className} group`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
      >
        <defs>
          <linearGradient id="glowGradient" x1="100" y1="10" x2="100" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--theme-accent)" stopOpacity="0.8" />
            <stop offset="1" stopColor="var(--theme-accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flameGradient" x1="100" y1="15" x2="100" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fca5a5" />
            <stop offset="0.4" stopColor="var(--theme-accent)" />
            <stop offset="1" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="innerFlameGradient" x1="100" y1="60" x2="100" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* Glow effect */}
        <circle cx="100" cy="100" r="90" fill="url(#glowGradient)" opacity="0.3" className="animate-pulse" />
        
        {/* Flame Body */}
        <path 
          d="M100 15C100 15 50 65 50 115C50 142.614 72.3858 165 100 165C127.614 165 150 142.614 150 115C150 85 115 50 100 15Z" 
          fill="url(#flameGradient)" 
        />
        
        {/* Inner Flame */}
        <path 
          d="M100 50C100 50 70 85 70 120C70 136.569 83.4315 150 100 150C116.569 150 130 136.569 130 120C130 95 110 65 100 50Z" 
          fill="url(#innerFlameGradient)" 
        />

        {/* Nivel >= 5: Headband (Banda de sudor) */}
        {level >= 5 && (
          <g className="animate-in slide-in-from-top">
            <path d="M55 95 Q 100 110 145 95 L 140 85 Q 100 100 60 85 Z" fill="#ffffff" opacity="0.9" />
            <circle cx="100" cy="95" r="5" fill="var(--theme-accent)" />
          </g>
        )}

        {/* Nivel < 20: Ojos normales. Nivel >= 20: Gafas de sol */}
        {level < 20 ? (
          <g>
            {/* Eyes (Cute) */}
            <ellipse cx="85" cy="110" rx="8" ry="12" fill="#1E293B" />
            <ellipse cx="115" cy="110" rx="8" ry="12" fill="#1E293B" />
            <circle cx="83" cy="105" r="3" fill="white" />
            <circle cx="113" cy="105" r="3" fill="white" />
          </g>
        ) : (
          <g className="animate-in fade-in">
            {/* Sunglasses */}
            <path d="M 65 105 Q 85 100 100 105 Q 115 100 135 105 L 135 115 Q 115 125 100 110 Q 85 125 65 115 Z" fill="#0f172a" />
            <path d="M 70 107 L 85 107 L 80 115 Z" fill="#ffffff" opacity="0.3" />
            <path d="M 105 107 L 120 107 L 115 115 Z" fill="#ffffff" opacity="0.3" />
          </g>
        )}

        {/* Smile */}
        <path d="M90 125Q100 135 110 125" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

        {/* Nivel >= 10: Mancuernas. Si es menor, no tiene manos. */}
        {level >= 10 && (
          <g className="animate-in zoom-in">
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
          </g>
        )}
      </svg>
    </div>
  );
}
