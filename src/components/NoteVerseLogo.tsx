import type { SVGProps } from 'react';

const NoteVerseLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="120"
    height="30"
    {...props}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      d="M10 10 L10 40 L25 40 L25 25 Q25 10 40 10 L10 10 Z"
      fill="url(#grad1)"
    />
    <path
      d="M27 27 L27 40 L40 40 L27 27 Z"
      fill="hsl(var(--primary))"
      opacity="0.6"
    />
    <text
      x="50"
      y="32"
      fontFamily="Space Grotesk, sans-serif"
      fontSize="24"
      fontWeight="bold"
      fill="hsl(var(--foreground))"
    >
      NoteVerse
    </text>
  </svg>
);

export default NoteVerseLogo;
