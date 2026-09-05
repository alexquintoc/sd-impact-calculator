import type { CSSProperties } from "react";
import { PILLAR_COLORS } from "@/lib/pillar-colors";

type PillarCircle = {
  name: string;
  color: string;
  size: string;
  opacity: number;
  top: string;
  left: string;
  dx: string;
  dy: string;
  duration: string;
  delay: string;
};

const pillarCircles: PillarCircle[] = [
  {
    name: "Environment",
    color: PILLAR_COLORS.environment,
    size: "28.5rem",
    opacity: 0.29,
    top: "13%",
    left: "52%",
    dx: "62px",
    dy: "-42px",
    duration: "18s",
    delay: "-4s",
  },
  {
    name: "Society",
    color: PILLAR_COLORS.society,
    size: "25.5rem",
    opacity: 0.28,
    top: "24%",
    left: "66%",
    dx: "-72px",
    dy: "48px",
    duration: "23s",
    delay: "-9s",
  },
  {
    name: "Culture",
    color: PILLAR_COLORS.culture,
    size: "24rem",
    opacity: 0.27,
    top: "47%",
    left: "56%",
    dx: "48px",
    dy: "68px",
    duration: "28s",
    delay: "-13s",
  },
  {
    name: "Finance",
    color: PILLAR_COLORS.finance,
    size: "27rem",
    opacity: 0.29,
    top: "51%",
    left: "66%",
    dx: "-58px",
    dy: "-54px",
    duration: "32s",
    delay: "-18s",
  },
];

function circleStyle(circle: PillarCircle): CSSProperties {
  return {
    "--pillar-circle-color": circle.color,
    "--pillar-circle-size": circle.size,
    "--pillar-circle-opacity": circle.opacity,
    "--pillar-circle-top": circle.top,
    "--pillar-circle-left": circle.left,
    "--pillar-circle-dx": circle.dx,
    "--pillar-circle-dy": circle.dy,
    "--pillar-circle-duration": circle.duration,
    "--pillar-circle-delay": circle.delay,
  } as CSSProperties;
}

export function HeroPillarCircles({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`hero-pillar-circles ${className}`.trim()}>
      {/* Adjust circle count by editing pillarCircles above. The current design intentionally uses four circles. */}
      {/* Adjust size, color, opacity, and animation speed in the pillarCircles values. */}
      {/* Adjust desktop/mobile layout in the CSS for .hero-pillar-circles and .hero-pillar-circles__circle. */}
      {pillarCircles.map((circle) => (
        <span
          className="hero-pillar-circles__circle"
          key={circle.name}
          style={circleStyle(circle)}
        />
      ))}
    </div>
  );
}
