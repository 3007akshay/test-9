export function findNearestCorridor(
  beacon,
  nodes
) {

  let best = null;
  let bestDist = Infinity;

  nodes.forEach((n) => {

    const d =
      Math.hypot(
        beacon.x - n.x,
        beacon.y - n.y
      );

    if (d < bestDist) {

      bestDist = d;
      best = n;

    }

  });

  return best;

}