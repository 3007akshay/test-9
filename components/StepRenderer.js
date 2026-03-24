import React from "react";
import { Text } from "react-native-svg";

export default function StepRenderer({ points }) {

  return (
    <>
      {points.map((p, i) => (

        <Text
          key={i}
          x={p[0] + 5}
          y={p[1] - 5}
          fontSize="12"
          fill="white"
        >
          {i}
        </Text>

      ))}
    </>
  );

}