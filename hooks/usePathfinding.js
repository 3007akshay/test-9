export function findPath(
  startIndex,
  endIndex,
  layout
) {

  const beacons =
    layout.beacons;

  const path = [];

  const start =
    beacons[startIndex];

  const end =
    beacons[endIndex];

  // Simple demo path
  path.push([
    start.x,
    start.y
  ]);

  path.push([
    start.x,
    end.y
  ]);

  path.push([
    end.x,
    end.y
  ]);

  return path;

}