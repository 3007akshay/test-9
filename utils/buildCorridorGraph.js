export function buildCorridorGraph(rectangles) {

  const nodes = [];

  // Create one node per rectangle (center)
  rectangles.forEach((r, i) => {

    nodes.push({
      id: i,
      x: r.x + r.width / 2,
      y: r.y + r.height / 2,
      neighbors: []
    });

  });


  // Connect only touching rectangles
  for (let i = 0; i < rectangles.length; i++) {

    for (let j = i + 1; j < rectangles.length; j++) {

      if (
        rectanglesTouch(
          rectangles[i],
          rectangles[j]
        )
      ) {

        nodes[i].neighbors.push(j);
        nodes[j].neighbors.push(i);

      }

    }

  }

  return nodes;

}



function rectanglesTouch(r1, r2) {

  const overlapX =
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x;

  const overlapY =
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y;

  return overlapX && overlapY;

}