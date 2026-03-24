export function parseLayout(json) {

  const regions =
    Object.values(json)[0].regions;

  const rectangles = [];
  const beacons = [];
  const circles = [];
  const ellipses = [];

  regions.forEach(r => {

    const s = r.shape_attributes;

    if (s.name === "rect") {

      rectangles.push({
        x: s.x,
        y: s.y,
        width: s.width,
        height: s.height,
      });

    }

    if (s.name === "point") {

      beacons.push({
        x: s.cx,
        y: s.cy,
      });

    }

    if (s.name === "circle") {

      circles.push({
        x: s.cx,
        y: s.cy,
        r: s.r,
      });

    }

    if (s.name === "ellipse") {

      ellipses.push({
        x: s.cx,
        y: s.cy,
        rx: s.rx,
        ry: s.ry,
      });

    }

  });

  return {
    rectangles,
    beacons,
    circles,
    ellipses,
  };

}