// Demo path generator

export function getDemoPath() {

  return [
    [75, 405],
    [75, 75],
    [225, 75],
    [225, 325],
    [325, 325],
  ];

}


// Arrow builder

export function buildArrows(points) {

  const arrows = [];

  for (let i = 0; i < points.length - 1; i++) {

    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    let direction = "E";

    if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {

      direction =
        x2 > x1 ? "E" : "W";

    } else {

      direction =
        y2 > y1 ? "S" : "N";

    }

    arrows.push({
      x: midX,
      y: midY,
      direction
    });

  }

  return arrows;

}