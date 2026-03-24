import React from "react";
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Polygon
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


  return (

    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 700 500"
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
          fill={COLORS.corridor}
          stroke="cyan"
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
          fill={COLORS.obstacle}
        />

      ))}


      {/* ---------------- */}
      {/* Entry / Exit */}
      {/* ---------------- */}

      {layout.ellipses.map((e, i) => (

        <Ellipse
          key={`ellipse-${i}`}
          cx={e.x}
          cy={e.y}
          rx={e.rx}
          ry={e.ry}
          fill={COLORS.entry}
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