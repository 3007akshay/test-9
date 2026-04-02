/**
 * usePathfinding.js
 *
 * Generic graph-based pathfinding for arbitrary shapes (paths + rectangles).
 */

export function findPath(startIndex, endIndex, layout) {
  const startBeacon = layout.beacons[startIndex];
  const endBeacon   = layout.beacons[endIndex];

  // ── 1. Create a generic point-based graph ──────────────────────────────
  const { nodes, edges } = buildNavGraph(layout);

  if (nodes.length === 0) {
    return [[startBeacon.x, startBeacon.y], [endBeacon.x, endBeacon.y]];
  }

  // ── 2. Add Start & End Beacons to the graph ────────────────────────────
  const startId = nodes.length;
  nodes.push({ x: startBeacon.x, y: startBeacon.y });
  edges[startId] = [];

  const endId = nodes.length;
  nodes.push({ x: endBeacon.x, y: endBeacon.y });
  edges[endId] = [];

  // Connect beacons to nearest graph nodes
  connectToNearestWalkable(startId, nodes, edges, 2);
  connectToNearestWalkable(endId, nodes, edges, 2);

  // ── 3. A* through the point graph ────────────────────────────────────────
  const sequence = astar(startId, endId, nodes, edges);

  // Convert node sequence to points
  return sequence.map(idx => [nodes[idx].x, nodes[idx].y]);
}

// ─── Generic Graph Builder ──────────────────────────────────────────────────

function buildNavGraph(layout) {
  const nodes = [];
  const edges = {}; // adjacency list
  
  const step = 20; // Sampling step size

  // Helper to add a node
  const addNode = (x, y) => {
    nodes.push({ x, y });
    edges[nodes.length - 1] = [];
    return nodes.length - 1;
  };

  // 1. Sample SVG paths
  if (layout.paths) {
    layout.paths.forEach(p => {
      const pathPts = samplePathString(p.d, step);
      let prevId = -1;
      pathPts.forEach((pt, i) => {
        const id = addNode(pt.x, pt.y);
        if (prevId !== -1) {
          edges[prevId].push(id);
          edges[id].push(prevId);
        }
        prevId = id;
      });
    });
  }

  // 2. Sample Rectangles
  if (layout.rectangles) {
    layout.rectangles.forEach(r => {
      // Just put points along the center-ish lines, or a basic grid inside
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      // create a small skeleton for the rect
      const idC = addNode(cx, cy);
      // add ends
      if (r.width > r.height) {
        const idL = addNode(r.x + step, cy);
        const idR = addNode(r.x + r.width - step, cy);
        edges[idC].push(idL, idR);
        edges[idL].push(idC); edges[idR].push(idC);
      } else {
        const idT = addNode(cx, r.y + step);
        const idB = addNode(cx, r.y + r.height - step);
        edges[idC].push(idT, idB);
        edges[idT].push(idC); edges[idB].push(idC);
      }
    });
  }

  // 3. Connect overlapping / nearby nodes from different shapes to form junctions
  // O(N^2) spatial connect for junctions
  const junctionDist = step * 1.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < junctionDist) {
        if (!edges[i].includes(j)) edges[i].push(j);
        if (!edges[j].includes(i)) edges[j].push(i);
      }
    }
  }

  // 4. Connect isolated components if they are slightly disjoint
  // (In case users drew strokes that don't perfectly touch)
  for (let i = 0; i < nodes.length; i++) {
    let closest = -1;
    let minDist = Infinity;
    for (let j = 0; j < nodes.length; j++) {
      if (i === j || edges[i].length > 0) continue; 
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < minDist) { minDist = d; closest = j; }
    }
    if (closest !== -1 && minDist < step * 3) {
      edges[i].push(closest);
      edges[closest].push(i);
    }
  }

  return { nodes, edges };
}

function connectToNearestWalkable(nodeId, nodes, edges, numConnections = 1) {
  const target = nodes[nodeId];
  let dists = [];
  for (let i = 0; i < nodes.length; i++) {
    if (i === nodeId) continue;
    dists.push({
      id: i,
      d: Math.hypot(nodes[i].x - target.x, nodes[i].y - target.y)
    });
  }
  dists.sort((a, b) => a.d - b.d);
  for (let i = 0; i < Math.min(numConnections, dists.length); i++) {
    const cId = dists[i].id;
    edges[nodeId].push(cId);
    edges[cId].push(nodeId);
  }
}

// ─── Simple SVG Path Sampler ────────────────────────────────────────────────

function samplePathString(d, step) {
  const points = [];
  const tokens = d.match(/[MLC]|-?[\d.]+/g);
  if (!tokens) return points;

  let curr = { x: 0, y: 0 };
  let i = 0;

  while (i < tokens.length) {
    const cmd = tokens[i];
    
    if (cmd === 'M' || cmd === 'L') {
      const px = parseFloat(tokens[i + 1]);
      const py = parseFloat(tokens[i + 2]);
      
      if (cmd === 'M') {
        points.push({ x: px, y: py });
      } else {
        const dist = Math.hypot(px - curr.x, py - curr.y);
        const steps = Math.ceil(dist / step);
        for (let j = 1; j <= steps; j++) {
          points.push({
            x: curr.x + (px - curr.x) * (j / steps),
            y: curr.y + (py - curr.y) * (j / steps)
          });
        }
      }
      curr = { x: px, y: py };
      i += 3;
      
    } else if (cmd === 'C') {
      const cx1 = parseFloat(tokens[i + 1]), cy1 = parseFloat(tokens[i + 2]);
      const cx2 = parseFloat(tokens[i + 3]), cy2 = parseFloat(tokens[i + 4]);
      const ex = parseFloat(tokens[i + 5]), ey = parseFloat(tokens[i + 6]);
      
      const appxDist = Math.hypot(cx1 - curr.x, cy1 - curr.y) +
                       Math.hypot(cx2 - cx1, cy2 - cy1) +
                       Math.hypot(ex - cx2, ey - cy2);
                       
      const steps = Math.ceil(appxDist / step);
      for (let j = 1; j <= steps; j++) {
        const t = j / steps;
        const mt = 1 - t;
        const bx = mt*mt*mt * curr.x + 3 * mt*mt*t * cx1 + 3 * mt*t*t * cx2 + t*t*t * ex;
        const by = mt*mt*mt * curr.y + 3 * mt*mt*t * cy1 + 3 * mt*t*t * cy2 + t*t*t * ey;
        points.push({ x: bx, y: by });
      }
      curr = { x: ex, y: ey };
      i += 7;
    } else if (!isNaN(parseFloat(cmd))) {
      // Implicit L
      const px = parseFloat(tokens[i]);
      const py = parseFloat(tokens[i + 1]);
      const dist = Math.hypot(px - curr.x, py - curr.y);
      const steps = Math.ceil(dist / step);
      for (let j = 1; j <= steps; j++) {
        points.push({
          x: curr.x + (px - curr.x) * (j / steps),
          y: curr.y + (py - curr.y) * (j / steps)
        });
      }
      curr = { x: px, y: py };
      i += 2;
    } else {
      i++;
    }
  }
  return points;
}

// ─── A* Pathfinding ─────────────────────────────────────────────────────────

function astar(start, end, nodes, edges) {
  if (start === end) return [start];

  const heuristic = (a, b) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);

  // [fScore, node, path]
  const open = [[0, start, [start]]];
  const gScore = { [start]: 0 };
  const visited = new Set();

  while (open.length > 0) {
    open.sort((a, b) => a[0] - b[0]);
    const [, current, path] = open.shift();

    if (current === end) return path;
    if (visited.has(current)) continue;
    visited.add(current);

    for (const neighbor of (edges[current] || [])) {
      if (visited.has(neighbor)) continue;

      const edgeCost = Math.hypot(nodes[current].x - nodes[neighbor].x, nodes[current].y - nodes[neighbor].y);
      const g = (gScore[current] || 0) + edgeCost;

      if (g < (gScore[neighbor] ?? Infinity)) {
        gScore[neighbor] = g;
        const f = g + heuristic(neighbor, end);
        open.push([f, neighbor, [...path, neighbor]]);
      }
    }
  }

  return [start, end];
}
