import React from "react";
import { Path } from "react-native-svg";

export default function PathRenderer({ points }) {

  if (!points || points.length === 0) return null;

  // Use straight line segments (L) so the path follows corridor centre-lines
  // exactly.  Bezier smoothing causes the line to visually cut through walls.
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0]} ${points[i][1]}`;
  }

  return (
    <Path
      d={d}
      stroke="#2196F3"
      strokeWidth="5"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );

}