import React from 'react';

export type ShatominExpression = 
  | 'smile' 
  | 'sparkle' 
  | 'wink' 
  | 'shy' 
  | 'happy_closed' 
  | 'sunglasses' 
  | 'sunflower' 
  | 'wave'
  | 'love'
  | 'excited';

interface ShatominAvatarProps {
  expression?: ShatominExpression;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

export const ShatominAvatar: React.FC<ShatominAvatarProps> = ({
  expression = 'smile',
  size = 'md',
  className = '',
  animate = true,
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-56 h-56',
  };

  const isWaving = expression === 'wave';
  const isHoldingSunflower = expression === 'sunflower';
  const isShy = expression === 'shy';

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${animate ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={`シャトミン (${expression})`}
    >
      <svg
        viewBox="0 0 200 210"
        className="w-full h-full drop-shadow-sm overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="plushGradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>
          <radialGradient id="featherGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F3F4F6" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>
          <linearGradient id="greenBand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EAB308" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="starEyeGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>
        </defs>

        {/* 1. FEET (Cute Orange Plush Feet) */}
        <g id="shatomin-feet">
          {/* Left Foot */}
          <ellipse cx="78" cy="196" rx="16" ry="10" fill="#EA580C" />
          <ellipse cx="78" cy="194" rx="13" ry="7" fill="#F97316" />
          {/* Right Foot */}
          <ellipse cx="122" cy="196" rx="16" ry="10" fill="#EA580C" />
          <ellipse cx="122" cy="194" rx="13" ry="7" fill="#F97316" />
        </g>

        {/* 2. SHUTTLECOCK FEATHER CROWN (バドミントンの羽根) */}
        <g id="shatomin-feathers">
          {/* Feather 1 (Far Left) */}
          <path
            d="M 52 82 C 40 45, 46 22, 60 14 C 68 28, 70 54, 70 82 Z"
            fill="url(#featherGradient)"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          <path d="M 56 22 Q 62 50 64 78" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

          {/* Feather 2 (Mid Left) */}
          <path
            d="M 72 82 C 64 35, 72 12, 84 8 C 94 22, 94 52, 90 82 Z"
            fill="url(#featherGradient)"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          <path d="M 81 12 Q 83 45 84 78" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

          {/* Feather 3 (Center Left) */}
          <path
            d="M 90 82 C 88 30, 96 8, 106 6 C 114 20, 112 50, 108 82 Z"
            fill="url(#featherGradient)"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          <path d="M 102 8 Q 102 45 102 78" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

          {/* Feather 4 (Mid Right) */}
          <path
            d="M 110 82 C 112 30, 122 10, 134 10 C 138 24, 134 52, 126 82 Z"
            fill="url(#featherGradient)"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          <path d="M 125 12 Q 123 45 120 78" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

          {/* Feather 5 (Far Right) */}
          <path
            d="M 128 82 C 136 40, 148 20, 158 20 C 160 36, 150 60, 144 82 Z"
            fill="url(#featherGradient)"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />
          <path d="M 148 24 Q 142 50 138 78" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        </g>

        {/* 3. GREEN RIBBON BAND & GOLD TRIM */}
        <g id="shatomin-band">
          <path
            d="M 52 82 Q 100 90 148 82 L 146 95 Q 100 103 54 95 Z"
            fill="url(#greenBand)"
            stroke="#064E3B"
            strokeWidth="1"
          />
          {/* Gold fine piping on top & bottom */}
          <path d="M 53 83 Q 100 91 147 83" stroke="url(#goldLine)" strokeWidth="2" fill="none" />
          <path d="M 55 94 Q 100 102 145 94" stroke="url(#goldLine)" strokeWidth="1.5" fill="none" />
        </g>

        {/* 4. MAIN BODY (Cute Round White Plush Head & Torso) */}
        <g id="shatomin-body">
          {/* Plush Body Shape */}
          <path
            d="M 54 96 C 24 116, 26 172, 70 186 C 100 194, 132 194, 156 182 C 188 166, 184 114, 146 96 C 120 90, 80 90, 54 96 Z"
            fill="url(#plushGradient)"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />

          {/* Plush fur texture stitch lines */}
          <path d="M 96 98 Q 100 102 104 98" stroke="#E5E7EB" strokeWidth="1.5" fill="none" />
          <path d="M 68 180 Q 74 184 80 180" stroke="#E5E7EB" strokeWidth="1.5" fill="none" />
          <path d="M 120 180 Q 126 184 132 180" stroke="#E5E7EB" strokeWidth="1.5" fill="none" />
        </g>

        {/* 5. ARMS / HANDS (Plush nubby arms) */}
        <g id="shatomin-arms">
          {isShy ? (
            /* Shy: Hands brought up to cheeks! */
            <>
              <ellipse cx="68" cy="148" rx="14" ry="11" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" transform="rotate(-15 68 148)" />
              <ellipse cx="132" cy="148" rx="14" ry="11" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" transform="rotate(15 132 148)" />
            </>
          ) : isWaving ? (
            /* Waving: Left arm normal, Right arm raised waving */
            <>
              {/* Left arm */}
              <path d="M 46 142 C 28 146, 26 158, 40 165 C 50 165, 56 156, 52 144 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
              {/* Right arm waving up */}
              <path d="M 152 136 C 172 110, 184 116, 172 136 C 164 148, 150 150, 146 138 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
            </>
          ) : isHoldingSunflower ? (
            /* Holding sunflower */
            <>
              <path d="M 44 144 C 30 148, 28 160, 42 166 C 52 166, 58 156, 50 146 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
              {/* Right hand holding stem */}
              <path d="M 148 140 C 165 142, 168 154, 155 160 C 146 162, 140 152, 144 140 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
            </>
          ) : (
            /* Default arms extended out happily */
            <>
              {/* Left Arm */}
              <path d="M 46 140 C 26 144, 24 158, 38 164 C 50 164, 56 154, 50 142 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
              {/* Right Arm */}
              <path d="M 154 140 C 174 144, 176 158, 162 164 C 150 164, 144 154, 150 142 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
            </>
          )}
        </g>

        {/* 6. BLUSHING CHEEKS */}
        <g id="shatomin-cheeks">
          <ellipse cx="64" cy="148" rx="14" ry="9" fill="url(#blushGradient)" />
          <ellipse cx="136" cy="148" rx="14" ry="9" fill="url(#blushGradient)" />
        </g>

        {/* 7. FACIAL EXPRESSIONS & EYES */}
        <g id="shatomin-face">
          {expression === 'smile' && (
            <>
              {/* Left Eye */}
              <circle cx="78" cy="136" r="6.5" fill="#18181B" />
              <circle cx="76" cy="133.5" r="2.2" fill="#FFFFFF" />
              {/* Right Eye */}
              <circle cx="122" cy="136" r="6.5" fill="#18181B" />
              <circle cx="120" cy="133.5" r="2.2" fill="#FFFFFF" />
              {/* Gentle Smile Mouth */}
              <path d="M 92 144 Q 100 154 108 144" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {expression === 'sparkle' && (
            <>
              {/* Left Sparkling Star Eye */}
              <circle cx="78" cy="136" r="8" fill="#18181B" />
              <polygon points="78,128 80.5,134 86,136 80.5,138 78,144 75.5,138 70,136 75.5,134" fill="url(#starEyeGrad)" />
              <circle cx="78" cy="136" r="1.5" fill="#FFFFFF" />

              {/* Right Sparkling Star Eye */}
              <circle cx="122" cy="136" r="8" fill="#18181B" />
              <polygon points="122,128 124.5,134 130,136 124.5,138 122,144 119.5,138 114,136 119.5,134" fill="url(#starEyeGrad)" />
              <circle cx="122" cy="136" r="1.5" fill="#FFFFFF" />

              {/* Sweet smile */}
              <path d="M 93 145 Q 100 153 107 145" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {expression === 'wink' && (
            <>
              {/* Left Eye (Winking arc) */}
              <path d="M 70 137 Q 78 131 86 137" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Right Eye (Big round eye with shine) */}
              <circle cx="122" cy="135" r="7.5" fill="#18181B" />
              <circle cx="120" cy="132" r="3" fill="#FFFFFF" />
              {/* Cheerful Open Mouth */}
              <path d="M 94 142 Q 100 144 106 142 Q 100 160 94 142 Z" fill="#F97316" stroke="#18181B" strokeWidth="2.5" />
              <path d="M 96 150 Q 100 154 104 150" fill="#FDA4AF" />
            </>
          )}

          {expression === 'shy' && (
            <>
              {/* Big glossy eyes */}
              <circle cx="78" cy="136" r="7.5" fill="#18181B" />
              <circle cx="76" cy="133" r="3" fill="#FFFFFF" />
              <circle cx="80" cy="138" r="1.5" fill="#FFFFFF" />

              <circle cx="122" cy="136" r="7.5" fill="#18181B" />
              <circle cx="120" cy="133" r="3" fill="#FFFFFF" />
              <circle cx="124" cy="138" r="1.5" fill="#FFFFFF" />

              {/* Shy curved cute mouth */}
              <path d="M 94 147 Q 100 153 106 147" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {expression === 'happy_closed' && (
            <>
              {/* Laughing eyes ^ ^ */}
              <path d="M 70 138 Q 78 130 86 138" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 114 138 Q 122 130 130 138" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Happy smile */}
              <path d="M 92 144 Q 100 154 108 144" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {expression === 'sunglasses' && (
            <>
              {/* Cool Dark Sunglasses */}
              <g id="sunglasses-layer">
                {/* Frame Bar */}
                <path d="M 60 130 Q 100 126 140 130" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                {/* Left Lens */}
                <rect x="62" y="127" width="32" height="20" rx="8" fill="#18181B" stroke="#27272A" strokeWidth="2" />
                <line x1="68" y1="131" x2="78" y2="131" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" />
                {/* Center Bridge */}
                <line x1="94" y1="133" x2="106" y2="133" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
                {/* Right Lens */}
                <rect x="106" y="127" width="32" height="20" rx="8" fill="#18181B" stroke="#27272A" strokeWidth="2" />
                <line x1="112" y1="131" x2="122" y2="131" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              {/* Cool Smirk */}
              <path d="M 93 154 Q 102 161 109 152" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {expression === 'sunflower' && (
            <>
              {/* Happy closed eyes ^ ^ */}
              <path d="M 70 138 Q 78 130 86 138" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 114 138 Q 122 130 130 138" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 92 145 Q 100 155 108 145" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Sunflower held on left side */}
              <g id="sunflower-layer" transform="translate(32, 110)">
                {/* Green Stem */}
                <path d="M 18 28 Q 16 46 22 56" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Sunflower Petals */}
                <circle cx="16" cy="18" r="16" fill="#FACC15" />
                <circle cx="16" cy="18" r="16" stroke="#EAB308" strokeWidth="1.5" fill="none" />
                {/* Petal scallops */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <circle
                    key={deg}
                    cx={16 + Math.cos((deg * Math.PI) / 180) * 14}
                    cy={18 + Math.sin((deg * Math.PI) / 180) * 14}
                    r="4"
                    fill="#FBBF24"
                  />
                ))}
                {/* Brown Seed Center */}
                <circle cx="16" cy="18" r="8" fill="#78350F" />
                <circle cx="16" cy="18" r="6" fill="#92400E" />
              </g>
            </>
          )}

          {expression === 'wave' && (
            <>
              {/* Round happy eyes */}
              <circle cx="78" cy="135" r="7" fill="#18181B" />
              <circle cx="76" cy="132" r="2.5" fill="#FFFFFF" />
              <path d="M 114 136 Q 122 130 130 136" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Joyful open mouth */}
              <path d="M 94 142 Q 100 144 106 142 Q 100 158 94 142 Z" fill="#F97316" stroke="#18181B" strokeWidth="2.5" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
