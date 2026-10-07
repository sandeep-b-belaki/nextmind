import { useId } from 'react';

interface Props {
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export default function ESahayakAvatar({ size = 96, showLabel = true, className = '' }: Props) {
  const uid = useId().replace(/:/g, '');
  const id = (n: string) => `es-${n}-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      role="img"
      aria-label="E-Sahayak, your government schemes assistant"
    >
      <title>E-Sahayak — government schemes assistant</title>
      <defs>
        <radialGradient id={id('bg')} cx="0.34" cy="0.26" r="0.95">
          <stop offset="0" stopColor="#e0f2fe" />
          <stop offset="0.55" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#d1fae5" />
        </radialGradient>
        <linearGradient id={id('coat')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id={id('skin')} cx="0.38" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#f2bb8c" />
          <stop offset="0.7" stopColor="#e0a070" />
          <stop offset="1" stopColor="#c8834f" />
        </radialGradient>
        <linearGradient id={id('ring')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <clipPath id={id('clip')}>
          <circle cx="256" cy="256" r="240" />
        </clipPath>
        <filter id={id('shadow')} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.18" />
        </filter>
      </defs>

      <g clipPath={`url(#${id('clip')})`}>
        <circle cx="256" cy="256" r="240" fill={`url(#${id('bg')})`} />
        <ellipse cx="164" cy="118" rx="170" ry="120" fill="#ffffff" opacity="0.3" />

        {/* torso / jacket */}
        <path d="M 40 512 C 52 430 130 376 256 376 C 382 376 460 430 472 512 Z" fill={`url(#${id('coat')})`} />
        <path d="M 218 377 L 294 377 L 256 464 Z" fill="#ffffff" />
        <path d="M 218 377 L 256 464 L 232 464 Z" fill="#3b82f6" opacity="0.85" />
        <path d="M 294 377 L 256 464 L 280 464 Z" fill="#3b82f6" opacity="0.85" />
        <path d="M 236 377 L 256 424 L 276 377 Z" fill="#f8fafc" />

        {/* neck */}
        <rect x="226" y="290" width="60" height="84" rx="28" fill="#c8834f" />
        <path d="M 232 290 h 48 v 44 q -24 20 -48 0 z" fill="#d9965f" />
        <ellipse cx="256" cy="336" rx="40" ry="16" fill="#a8663c" opacity="0.5" />

        {/* head */}
        <ellipse cx="164" cy="238" rx="15" ry="21" fill="#d9965f" />
        <ellipse cx="348" cy="238" rx="15" ry="21" fill="#d9965f" />
        <ellipse cx="256" cy="224" rx="96" ry="104" fill={`url(#${id('skin')})`} />

        {/* hair */}
        <path
          d="M 158 234 C 148 130 198 86 256 86 C 314 86 364 130 354 234
             C 349 188 341 160 321 147 C 299 133 273 152 246 146
             C 214 139 190 157 176 187 C 168 205 162 220 158 234 Z"
          fill="#23303d"
        />
        <path d="M 158 234 C 156 258 160 276 166 288 C 158 268 156 250 158 234 Z" fill="#23303d" />
        <path d="M 354 234 C 356 258 352 276 346 288 C 354 268 356 250 354 234 Z" fill="#23303d" />

        {/* brows */}
        <path d="M 210 206 Q 226 195 245 204" stroke="#23303d" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 267 204 Q 286 195 302 206" stroke="#23303d" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* eyes */}
        <ellipse cx="227" cy="228" rx="17" ry="12" fill="#ffffff" />
        <ellipse cx="285" cy="228" rx="17" ry="12" fill="#ffffff" />
        <circle cx="229" cy="228" r="8.5" fill="#3f2d1f" />
        <circle cx="283" cy="228" r="8.5" fill="#3f2d1f" />
        <circle cx="232" cy="225" r="3" fill="#ffffff" />
        <circle cx="286" cy="225" r="3" fill="#ffffff" />

        {/* nose + smile */}
        <path d="M 256 226 L 248 256 Q 256 263 264 256" stroke="#b9764a" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 230 274 Q 256 298 282 274" stroke="#9a4a3f" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="210" cy="258" rx="16" ry="9" fill="#e8797a" opacity="0.28" />
        <ellipse cx="302" cy="258" rx="16" ry="9" fill="#e8797a" opacity="0.28" />

        {/* E monogram badge on the jacket */}
        <g filter={`url(#${id('shadow')})`}>
          <rect x="100" y="396" width="110" height="30" rx="9" fill="#ffffff" />
          <text
            x="155"
            y="418"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
            fontSize="20"
            fontWeight="800"
            fill="#1d4ed8"
          >
            E
          </text>
        </g>

        {/* floating: document + check */}
        <g filter={`url(#${id('shadow')})`}>
          <circle cx="108" cy="152" r="38" fill="#ffffff" />
          <rect x="88" y="130" width="40" height="48" rx="7" fill="#dbeafe" stroke="#2563eb" strokeWidth="5" />
          <path d="M 97 156 L 106 165 L 123 145" stroke="#059669" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* floating: AI lightbulb */}
        <g filter={`url(#${id('shadow')})`}>
          <circle cx="404" cy="152" r="38" fill="#ffffff" />
          <path d="M 404 116 V 104" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M 376 128 L 367 120" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M 432 128 L 441 120" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <circle cx="404" cy="147" r="21" fill="#fbbf24" />
          <rect x="394" y="165" width="20" height="11" rx="5" fill="#94a3b8" />
          <path d="M 397 178 H 411" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
          <circle cx="398" cy="143" r="4" fill="#ffffff" />
          <circle cx="410" cy="151" r="4" fill="#ffffff" />
          <path d="M 398 143 L 410 151" stroke="#ffffff" strokeWidth="3" />
        </g>

        {/* small digital sparkles */}
        <circle cx="332" cy="72" r="6" fill="#34d399" opacity="0.75" />
        <circle cx="180" cy="70" r="5" fill="#60a5fa" opacity="0.75" />
        <circle cx="356" cy="330" r="5" fill="#60a5fa" opacity="0.55" />

        {/* name label */}
        {showLabel && (
          <g>
            <rect x="166" y="434" width="180" height="42" rx="21" fill="#0f172a" opacity="0.72" />
            <text
              x="256"
              y="463"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
              fontSize="26"
              fontWeight="700"
              fill="#ffffff"
            >
              E-Sahayak
            </text>
          </g>
        )}
      </g>

      {/* rings */}
      <circle cx="256" cy="256" r="238" fill="none" stroke="#ffffff" strokeWidth="12" />
      <circle cx="256" cy="256" r="247" fill="none" stroke={`url(#${id('ring')})`} strokeWidth="6" />
    </svg>
  );
}
