import type { SVGProps } from 'react';

const CareEdgeLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 100"
    width="150"
    height="40"
    {...props}
  >
    <style>
      {`
        .care-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 60px;
          font-weight: bold;
          fill: hsl(var(--primary));
        }
        .edge-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 60px;
          font-weight: bold;
          fill: hsl(var(--accent));
        }
        .ratings-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 20px;
          font-weight: 500;
          fill: hsl(var(--primary));
          letter-spacing: 2px;
        }
        .line {
          stroke: hsl(var(--primary));
          stroke-width: 2;
        }
        .edge-e-bar {
            fill: hsl(var(--accent));
        }
      `}
    </style>

    <text x="10" y="60" className="care-text">Care</text>
    
    <g className="edge-text" transform="translate(145, 0)">
      <g>
        <rect x="0" y="19" width="30" height="8" className="edge-e-bar" />
        <rect x="0" y="31" width="30" height="8" className="edge-e-bar" />
        <rect x="0" y="43" width="30" height="8" className="edge-e-bar" />
      </g>
      <text x="35" y="60">dge</text>
    </g>
    
    <text x="10" y="85" className="ratings-text">RATINGS</text>
    
    <line x1="10" y1="68" x2="270" y2="68" className="line" />

  </svg>
);

export default CareEdgeLogo;
