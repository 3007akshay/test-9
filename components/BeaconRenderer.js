import React from "react";
import {
  Circle,
  Text
} from "react-native-svg";

import { COLORS }
  from "../constants/mapConfig";

export default function BeaconRenderer({
  beacons,
  onSelectBeacon
}) {

  return (
    <>
      {beacons.map((b, i) => (

        <React.Fragment key={i}>

          <Circle
            cx={b.x}
            cy={b.y}
            r="6"
            fill={COLORS.beacon}

            onPress={() =>
              onSelectBeacon(i)
            }
          />

          <Text
            x={b.x + 6}
            y={b.y - 6}
            fontSize="10"
            fill="white"
          >
            {i}
          </Text>

        </React.Fragment>

      ))}
    </>
  );

}