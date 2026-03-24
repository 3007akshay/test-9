import React from "react";
import { Polygon } from "react-native-svg";

function getArrowPoints(x, y, direction) {

  const size = 10;

  if (direction === "E") {
    return `
      ${x},${y}
      ${x - size},${y - size}
      ${x - size},${y + size}
    `;
  }

  if (direction === "W") {
    return `
      ${x},${y}
      ${x + size},${y - size}
      ${x + size},${y + size}
    `;
  }

  if (direction === "N") {
    return `
      ${x},${y}
      ${x - size},${y + size}
      ${x + size},${y + size}
    `;
  }

  if (direction === "S") {
    return `
      ${x},${y}
      ${x - size},${y - size}
      ${x + size},${y - size}
    `;
  }

}

export default function ArrowRenderer({ arrows }) {

  return (
    <>
      {arrows.map((a, i) => (

        <Polygon
          key={i}
          points={getArrowPoints(
            a.x,
            a.y,
            a.direction
          )}
          fill="white"
        />

      ))}
    </>
  );

}