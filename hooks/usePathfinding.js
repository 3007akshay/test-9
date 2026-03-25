export function findPath(
  startIndex,
  endIndex,
  layout
) {
  const startBeacon = layout.beacons[startIndex];
  const endBeacon = layout.beacons[endIndex];
  const corridors = layout.rectangles;

  const path = [];
  
  path.push([startBeacon.x, startBeacon.y]);

  const graph = buildCorridorGraph(corridors);
  
  const startCorridors = findCorridorsContaining(startBeacon.x, startBeacon.y, corridors);
  const endCorridors = findCorridorsContaining(endBeacon.x, endBeacon.y, corridors);
  
  const startRectIdx = startCorridors.length > 0 ? startCorridors[0] : findNearestCorridor(startBeacon, corridors);
  const endRectIdx = endCorridors.length > 0 ? endCorridors[0] : findNearestCorridor(endBeacon, corridors);

  let bestPath = null;
  
  if (startCorridors.length > 0 && endCorridors.length > 0) {
    for (const sIdx of startCorridors) {
      for (const eIdx of endCorridors) {
        const p = findShortestPathBFS(sIdx, eIdx, graph);
        if (!bestPath || p.length < bestPath.length) {
          bestPath = p;
        }
      }
    }
  } else {
    bestPath = findShortestPathBFS(startRectIdx, endRectIdx, graph);
  }

  for (let i = 0; i < bestPath.length - 1; i++) {
    const currRect = corridors[bestPath[i]];
    const nextRect = corridors[bestPath[i + 1]];
    const connPoint = findConnectionPoint(currRect, nextRect);
    if (connPoint) {
      path.push([connPoint.x, connPoint.y]);
    }
  }

  path.push([endBeacon.x, endBeacon.y]);

  return path;
}

function findCorridorsContaining(px, py, corridors) {
  const result = [];
  for (let i = 0; i < corridors.length; i++) {
    if (isInside(px, py, corridors[i])) {
      result.push(i);
    }
  }
  return result;
}

function isInside(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.width &&
         py >= rect.y && py <= rect.y + rect.height;
}

function findNearestCorridor(beacon, corridors) {
  let nearest = 0;
  let minDist = Infinity;
  for (let i = 0; i < corridors.length; i++) {
    const c = corridors[i].x + corridors[i].width / 2;
    const r = corridors[i].y + corridors[i].height / 2;
    const dist = Math.hypot(beacon.x - c, beacon.y - r);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }
  return nearest;
}

function buildCorridorGraph(corridors) {
  const graph = {};
  for (let i = 0; i < corridors.length; i++) {
    graph[i] = [];
  }

  for (let i = 0; i < corridors.length; i++) {
    for (let j = i + 1; j < corridors.length; j++) {
      if (corridorsOverlap(corridors[i], corridors[j])) {
        graph[i].push(j);
        graph[j].push(i);
      }
    }
  }

  return graph;
}

function corridorsOverlap(r1, r2) {
  // Check if rectangles share area (overlap or touch with shared edge)
  const overlapX = Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x);
  const overlapY = Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y);
  return overlapX > 0 && overlapY > 0;
}

function findShortestPathBFS(start, end, graph) {
  if (start === end) return [start];
  
  const queue = [[start]];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === end) return path;
    
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  
  return [start, end];
}

function findConnectionPoint(r1, r2) {
  // Find the center of the overlapping region between two rectangles
  const overlapLeft = Math.max(r1.x, r2.x);
  const overlapRight = Math.min(r1.x + r1.width, r2.x + r2.width);
  const overlapTop = Math.max(r1.y, r2.y);
  const overlapBottom = Math.min(r1.y + r1.height, r2.y + r2.height);

  if (overlapRight > overlapLeft && overlapBottom > overlapTop) {
    return {
      x: (overlapLeft + overlapRight) / 2,
      y: (overlapTop + overlapBottom) / 2
    };
  }

  return null;
}
