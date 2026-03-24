import React from "react";
import { Path } from "react-native-svg";

export default function PathRenderer({ points }) {

  if (!points.length) return null;

  let d =
    `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length; i++) {

    d +=
      ` L ${points[i][0]} ${points[i][1]}`;

  }

  return (

    <Path
      d={d}
      stroke="yellow"
      strokeWidth="4"
      fill="none"
      strokeDasharray="10,6"
    />

  );

}