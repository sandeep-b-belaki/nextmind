export default function Logo({ size = 40, id = 'nm' }: { size?: number; id?: string }) {
  const gid = `nm-grad-${id}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${gid})`} />
      <path
        d="M15 34V15l18 18V15"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36.5" cy="13.5" r="4" fill="#fbbf24" />
    </svg>
  );
}
