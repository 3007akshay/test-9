import React, {
  useState
} from "react";

import { View } from "react-native";

import layoutJson
  from "../assets/layout.json";

import {
  parseLayout
} from "../utils/parseLayout";

import MapRenderer
  from "./MapRenderer";

import ZoomableView
  from "./ZoomableView";

import {
  findPath
} from "../hooks/usePathfinding";


const layout =
  parseLayout(layoutJson);


export default function IndoorMap() {

  const [startIndex,
    setStartIndex] = useState(null);

  const [targetIndex,
    setTargetIndex] = useState(null);

  const [pathPoints,
    setPathPoints] = useState([]);



  // When user taps beacon
  const handleBeaconSelect =
    (index) => {

      if (startIndex === null) {

        setStartIndex(index);

      }
      else if (targetIndex === null) {

        setTargetIndex(index);

        // Calculate path
        const path =
          findPath(
            startIndex,
            index,
            layout
          );

        setPathPoints(path);

      }
      else {

        // Reset
        setStartIndex(index);
        setTargetIndex(null);
        setPathPoints([]);

      }

    };


  return (

    <View style={{ flex: 1 }}>

      <ZoomableView>

        <MapRenderer
          layout={layout}
          pathPoints={pathPoints}
          onSelectBeacon={
            handleBeaconSelect
          }
        />

      </ZoomableView>

    </View>

  );

}