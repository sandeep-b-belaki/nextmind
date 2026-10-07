import Image from 'next/image';

interface LogoProps {
  size?: number;
  /** Kept for backwards compatibility with existing call sites; unused. */
  id?: string;
  className?: string;
  priority?: boolean;
}

/** E-Sahayak mark — the badge + assistant lockup, without the wordmark. */
export default function Logo({ size = 40, className = '', priority = false }: LogoProps) {
  return (
    <Image
      src="/logo-mark.png"
      alt="E-Sahayak"
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 ${className}`}
    />
  );
}
