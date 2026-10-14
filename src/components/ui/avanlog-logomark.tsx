type AvanlogLogomarkProps = {
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
};

const LOGO_PATH =
  "M1566 3149 c-10 -6 -65 -109 -123 -228 -183 -376 -264 -542 -323 -666 -32 -66 -94 -195 -139 -287 -184 -381 -246 -509 -306 -633 -34 -71 -104 -215 -155 -320 -51 -104 -114 -235 -140 -290 -26 -55 -98 -203 -159 -329 -61 -126 -111 -241 -111 -256 0 -36 38 -70 79 -70 28 0 164 49 826 296 55 20 114 42 132 49 18 6 41 19 52 29 21 19 278 531 388 771 142 314 328 557 569 747 35 27 64 56 64 64 0 28 -550 1113 -569 1124 -25 13 -61 12 -85 -1z M2173 1863 c-180 -201 -296 -412 -354 -640 -49 -196 -50 -191 102 -496 72 -144 141 -272 152 -283 12 -12 65 -37 117 -57 560 -211 857 -317 885 -317 38 0 75 37 75 76 0 13 -125 275 -279 581 -153 307 -352 705 -441 886 -90 180 -169 327 -176 327 -6 0 -43 -35 -81 -77z";

/**
 * Abstract geometric line-art rendering of the Avanlog mark — a thin,
 * light-grey stroked outline traced directly from the source logo so the
 * silhouette matches it exactly.
 */
export default function AvanlogLogomark({
  size = 120,
  strokeColor = "#9aa0ad",
  strokeWidth = 1.25,
  className,
}: AvanlogLogomarkProps) {
  return (
    <svg
      width={size}
      height={size * (326 / 325)}
      viewBox="0 0 325 326"
      fill="none"
      className={className}
      role="img"
      aria-label="Avanlog logomark"
    >
      <g transform="translate(0,326) scale(0.1,-0.1)">
        <path
          d={LOGO_PATH}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
