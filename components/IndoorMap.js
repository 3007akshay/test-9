import React, {
  useState
} from "react";

import {
  View,
  StyleSheet
} from "react-native";

import layoutJson
  from "../assets/layout2.json";

import {
  parseLayout
} from "../utils/parseLayout";

import MapRenderer
  from "./MapRenderer";

import ZoomableView
  from "./ZoomableView";

import SimpleDropdown
  from "./SimpleDropdown";

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


  const beaconList =
    layout.beacons.map(
      (_, i) => i
    );


  // Generate path
  function updatePath(
    start,
    target
  ) {

    if (
      start !== null &&
      target !== null
    ) {

      const path =
        findPath(
          start,
          target,
          layout
        );

      setPathPoints(path);

    }

  }


  return (

    <View style={{ flex: 1 }}>

      {/* Dropdowns */}

      <View style={styles.row}>

        <SimpleDropdown
          label="Start"
          options={beaconList}
          selected={startIndex}

          onSelect={(i) => {

            setStartIndex(i);

            updatePath(
              i,
              targetIndex
            );

          }}
        />


        <SimpleDropdown
          label="Target"
          options={beaconList}
          selected={targetIndex}

          onSelect={(i) => {

            setTargetIndex(i);

            updatePath(
              startIndex,
              i
            );

          }}
        />

      </View>


      {/* Map */}

      <ZoomableView>

        <MapRenderer
          layout={layout}
          pathPoints={pathPoints}
        />

      </ZoomableView>

    </View>

  );

}


const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    backgroundColor: "#111"
  }

});