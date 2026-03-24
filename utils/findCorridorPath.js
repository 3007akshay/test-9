export function findCorridorPath(
  startNode,
  endNode,
  nodes
) {

  const queue = [startNode.id];

  const visited = new Set();

  const cameFrom = {};

  visited.add(startNode.id);

  while (queue.length) {

    const current = queue.shift();

    if (current === endNode.id)
      break;

    nodes[current].neighbors.forEach((n) => {

      if (!visited.has(n)) {

        visited.add(n);

        cameFrom[n] = current;

        queue.push(n);

      }

    });

  }


  // Rebuild path
  const path = [];

  let curr = endNode.id;

  while (curr !== undefined) {

    const node = nodes[curr];

    path.unshift([
      node.x,
      node.y
    ]);

    curr = cameFrom[curr];

  }

  return path;

}