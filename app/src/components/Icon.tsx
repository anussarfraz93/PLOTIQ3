import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { IconName } from "../data/types";

// Ported 1:1 from prototype/index.html's ICONS object — same path data,
// same viewBox, same stroke widths. "phone" and "whatsapp" are new, for
// the Contact Agent feature (SRS 4.8), drawn in the same style.
export type { IconName };

type Props = { name: IconName; size?: number; color: string };

const strokeProps = (color: string) => ({
  stroke: color,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
});

export function Icon({ name, size = 20, color }: Props) {
  const sp = strokeProps(color);
  const body = (() => {
    switch (name) {
      case "compass":
        return (
          <>
            <Circle cx={12} cy={12} r={9} {...sp} />
            <Path d="M15 9l-2.2 6-3.8 1.5L11 10z" fill={color} stroke="none" />
          </>
        );
      case "menu":
        return <Path d="M4 7h16M4 12h16M4 17h16" {...sp} strokeWidth={1.9} />;
      case "arrowLeft":
        return (
          <>
            <Path d="M15 5l-7 7 7 7" {...sp} strokeWidth={1.9} />
            <Path d="M8 12h9" {...sp} strokeWidth={1.9} />
          </>
        );
      case "close":
        return <Path d="M6 6l12 12M18 6L6 18" {...sp} strokeWidth={1.9} />;
      case "search":
        return (
          <>
            <Circle cx={11} cy={11} r={6.5} {...sp} />
            <Path d="M20 20l-4.3-4.3" {...sp} />
          </>
        );
      case "bookmark":
        return <Path d="M6 4h12v16l-6-4-6 4z" {...sp} />;
      case "bookmarkFill":
        return <Path d="M6 4h12v16l-6-4-6 4z" fill={color} stroke="none" />;
      case "chart":
        return <Path d="M5 19V10M12 19V5M19 19v-7" {...sp} />;
      case "layers":
        return (
          <>
            <Path d="M12 3l8 4.5-8 4.5-8-4.5z" {...sp} />
            <Path d="M4 12l8 4.5 8-4.5" {...sp} />
            <Path d="M4 16.5L12 21l8-4.5" {...sp} />
          </>
        );
      case "house":
        return (
          <>
            <Path d="M4 11.5L12 4l8 7.5" {...sp} />
            <Path d="M6 10v9h12v-9" {...sp} />
            <Path d="M10 19v-5h4v5" {...sp} />
          </>
        );
      case "coins":
        return (
          <>
            <Rect x={4} y={8} width={14} height={9} rx={2} {...sp} />
            <Path d="M8 8V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2" {...sp} />
            <Path d="M9 12.5h4" {...sp} />
          </>
        );
      case "shop":
        return (
          <>
            <Path d="M4 9l1.2-4.5h13.6L20 9" {...sp} />
            <Path d="M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" {...sp} />
            <Path d="M5.5 9V19h13V9" {...sp} />
            <Path d="M10 19v-5h4v5" {...sp} />
          </>
        );
      case "factory":
        return (
          <>
            <Path d="M4 20V12l4.5 3V12L13 15V9l7-3v14z" {...sp} />
            <Path d="M4 20h16" {...sp} />
            <Path d="M17 6V3" {...sp} />
          </>
        );
      case "tree":
        return (
          <>
            <Path d="M12 3l4 6h-2.5l3.5 5.5h-3L17 19H7l3-4.5H7L10.5 9H8z" {...sp} />
            <Path d="M12 19v2" {...sp} />
          </>
        );
      case "mapPin":
        return (
          <>
            <Path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z" {...sp} />
            <Circle cx={12} cy={9.5} r={2.3} {...sp} />
          </>
        );
      case "shield":
        return <Path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" {...sp} />;
      case "leaf":
        return (
          <>
            <Path d="M20 4C10 4 4 10 4 18c8 0 14-6 14-14z" {...sp} />
            <Path d="M9 19c0-6 3-10 9-12" {...sp} />
          </>
        );
      case "tag":
        return (
          <>
            <Path d="M12 3h6a1 1 0 0 1 1 1v6l-9.5 9.5a1.5 1.5 0 0 1-2 0L3.5 15.5a1.5 1.5 0 0 1 0-2z" {...sp} />
            <Circle cx={16} cy={8} r={1.3} {...sp} />
          </>
        );
      case "trendingUp":
        return (
          <>
            <Path d="M4 16l6-6 4 4 6-7" {...sp} />
            <Path d="M15 7h5v5" {...sp} />
          </>
        );
      case "building":
        return (
          <>
            <Rect x={6} y={4} width={12} height={16} {...sp} />
            <Path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" {...sp} />
          </>
        );
      case "truck":
        return (
          <>
            <Path d="M3 7h11v9H3z" {...sp} />
            <Path d="M14 11h4l3 3v2h-7z" {...sp} />
            <Circle cx={7} cy={18} r={1.6} {...sp} />
            <Circle cx={18} cy={18} r={1.6} {...sp} />
          </>
        );
      case "bolt":
        return <Path d="M13 3L5 13h5l-1 8 8-10h-5z" {...sp} />;
      case "mountain":
        return <Path d="M3 19l6-10 4 6 2-3 6 7z" {...sp} />;
      case "info":
        return (
          <>
            <Circle cx={12} cy={12} r={9} {...sp} />
            <Path d="M12 11v5.5M12 8v.01" {...sp} />
          </>
        );
      case "phone":
        return <Path d="M6 3h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2L19.5 15v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4.5 4.6 1.5 1.5 0 0 1 6 3z" {...sp} />;
      case "whatsapp":
        return (
          <>
            <Path d="M6.5 17.5L4 20l2.6-2.4A8 8 0 1 0 4 12a7.9 7.9 0 0 0 1.1 4z" {...sp} />
            <Path d="M9 10c0 3 2 5 5 5 .3 0 .6-.4.6-1v-1l-2-.8-.6.8a5.3 5.3 0 0 1-2-2l.8-.6-.8-2h-1c-.6 0-1 .3-1 .6z" fill={color} stroke="none" />
          </>
        );
      case "settings":
        return (
          <>
            <Circle cx={12} cy={12} r={3} {...sp} />
            <Path d="M12 3v2.5M12 18.5V21M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M3 12h2.5M18.5 12H21M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" {...sp} />
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body}
    </Svg>
  );
}

// Ported 1:1 from prototype/index.html's barsIcon() — a magnitude icon
// (growing bars) used for the scale/budget option cards.
export function BarsIcon({ level, max, size = 16, color }: { level: number; max: number; size?: number; color: string }) {
  const w = 3.4;
  const gap = 2.2;
  const h0 = 6;
  const bars = [];
  for (let i = 0; i < max; i++) {
    const bh = h0 + i * 3.6;
    const x = 2 + i * (w + gap);
    const y = 20 - bh;
    const on = i < level;
    bars.push(
      <Rect
        key={i}
        x={x}
        y={y}
        width={w}
        height={bh}
        rx={1}
        fill={on ? color : "none"}
        stroke={color}
        strokeWidth={1.3}
      />
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {bars}
    </Svg>
  );
}
