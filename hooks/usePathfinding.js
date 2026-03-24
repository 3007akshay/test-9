import {
  buildCorridorGraph
} from "../utils/buildCorridorGraph";

import {
  findNearestCorridor
} from "../utils/findNearestCorridor";

import {
  findCorridorPath
} from "../utils/findCorridorPath";


export function findPath(
  startIndex,
  endIndex,
  layout
) {

  const nodes =
    buildCorridorGraph(
      layout.rectangles
    );

  const startBeacon =
    layout.beacons[startIndex];

  const endBeacon =
    layout.beacons[endIndex];

  const startNode =
    findNearestCorridor(
      startBeacon,
      nodes
    );

  const endNode =
    findNearestCorridor(
      endBeacon,
      nodes
    );


  const corridorPath =
    findCorridorPath(
      startNode,
      endNode,
      nodes
    );


  return [

    [startBeacon.x,
     startBeacon.y],

    ...corridorPath,

    [endBeacon.x,
     endBeacon.y]

  ];

}