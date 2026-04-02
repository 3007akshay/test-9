import React from "react";
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Polygon,
  Path
} from "react-native-svg";

import { COLORS } from "../constants/mapConfig";

import BeaconRenderer from "./BeaconRenderer";
import PathRenderer from "./PathRenderer";
import ArrowRenderer from "./ArrowRenderer";
import StepRenderer from "./StepRenderer";

import { buildArrows }
  from "../utils/buildPath";


export default function MapRenderer({
  layout,
  pathPoints = [],
  onSelectBeacon
}) {

  // Build arrows from path
  const arrows =
    buildArrows(pathPoints);

  // Start & Goal
  const startPoint =
    pathPoints[0];

  const goalPoint =
    pathPoints[pathPoints.length - 1];

  // Compute dynamic viewBox Based on all elements
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  const updateBounds = (x, y, w = 0, h = 0) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  };

  layout.rectangles?.forEach(r => updateBounds(r.x, r.y, r.width, r.height));
  layout.circles?.forEach(c => updateBounds(c.x - c.r, c.y - c.r, c.r * 2, c.r * 2));
  layout.beacons?.forEach(b => updateBounds(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2));

  // A basic bbox parse for paths
  layout.paths?.forEach(p => {
    const nums = p.d.match(/-?[\d.]+/g);
    if (nums) {
      for (let i = 0; i < nums.length - 1; i += 2) {
        updateBounds(parseFloat(nums[i]), parseFloat(nums[i+1]));
      }
    }
  });

  if (minX === Infinity) { minX = 0; minY = 0; maxX = 7829; maxY = 6867; }

  // Add padding
  const pad = 50;
  const vBox = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;


  return (

    <Svg
      width="100%"
      height="100%"
      viewBox={vBox}
    >

      {/* ---------------- */}
      {/* Corridors */}
      {/* ---------------- */}

      {layout.rectangles.map((r, i) => (

        <Rect
          key={`rect-${i}`}
          x={r.x}
          y={r.y}
          width={r.width}
          height={r.height}
          fill={r.fill || COLORS.corridor}
          transform={r.transform}
        />

      ))}


      {/* ---------------- */}
      {/* Path Strokes */}
      {/* ---------------- */}

      {(layout.paths || []).map((p, i) => (

        <Path
          key={`path-${i}`}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill="none"
        />

      ))}


      {/* ---------------- */}
      {/* Obstacles */}
      {/* ---------------- */}

      {layout.circles.map((c, i) => (

        <Circle
          key={`circle-${i}`}
          cx={c.x}
          cy={c.y}
          r={c.r}
          fill={c.fill || COLORS.obstacle}
        />

      ))}


      {/* ---------------- */}
      {/* Entry / Exit */}
      {/* ---------------- */}

      {layout.ellipses.map((e, i) => (

        <Path
          key={`ellipse-${i}`}
          d={e.pathData}
          fill={e.fill || COLORS.entry}
        />

      ))}


      {/* ---------------- */}
      {/* Beacons */}
      {/* ---------------- */}

      <BeaconRenderer
        beacons={layout.beacons}
      />


      {/* ---------------- */}
      {/* Path Line */}
      {/* ---------------- */}

      <PathRenderer
        points={pathPoints}
      />


      {/* ---------------- */}
      {/* Arrows */}
      {/* ---------------- */}

      <ArrowRenderer
        arrows={arrows}
      />


      {/* ---------------- */}
      {/* Step Numbers */}
      {/* ---------------- */}

      <StepRenderer
        points={pathPoints}
      />

<BeaconRenderer
  beacons={layout.beacons}
  onSelectBeacon={onSelectBeacon}
/>

      {/* ---------------- */}
      {/* Start Marker */}
      {/* ---------------- */}

      {startPoint && (

        <Circle
          cx={startPoint[0]}
          cy={startPoint[1]}
          r="8"
          fill="green"
        />

      )}


      {/* ---------------- */}
      {/* Goal Marker ⭐ */}
      {/* ---------------- */}

      {goalPoint && (

        <Polygon
          points={`
            ${goalPoint[0]},${goalPoint[1]-12}
            ${goalPoint[0]+6},${goalPoint[1]-4}
            ${goalPoint[0]+14},${goalPoint[1]-4}
            ${goalPoint[0]+8},${goalPoint[1]+2}
            ${goalPoint[0]+10},${goalPoint[1]+10}
            ${goalPoint[0]},${goalPoint[1]+5}
            ${goalPoint[0]-10},${goalPoint[1]+10}
            ${goalPoint[0]-8},${goalPoint[1]+2}
            ${goalPoint[0]-14},${goalPoint[1]-4}
            ${goalPoint[0]-6},${goalPoint[1]-4}
          `}
          fill="red"
        />

      )}

    </Svg>

  );

}