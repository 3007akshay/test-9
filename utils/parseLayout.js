export function parseLayout(json) {

  const rectangles = [];
  const beacons = [];
  const circles = [];
  const ellipses = [];
  const paths = [];

  const items = Array.isArray(json) ? json : Object.values(json)[0].regions;

  items.forEach(item => {
    const attrs = item.attributes;
    const type = item.type;
    const id = item.id;

    if (type === "rect") {
      const transform = attrs.transform;
      
      if (transform && transform.includes("rotate(-90")) {
        const match = transform.match(/rotate\(-90\s+([\d.]+)\s+([\d.]+)\)/);
        if (match) {
          const cx = parseFloat(match[1]);
          const cy = parseFloat(match[2]);
          const w = parseFloat(attrs.width);
          const h = parseFloat(attrs.height);
          
          if (cx === 0) {
            rectangles.push({
              x: 0,
              y: cy - w,
              width: h,
              height: w,
              fill: attrs.fill,
            });
          } else {
            rectangles.push({
              x: cx,
              y: 0,
              width: h,
              height: w,
              fill: attrs.fill,
            });
          }
        }
      } else {
        rectangles.push({
          x: parseFloat(attrs.x) || 0,
          y: parseFloat(attrs.y) || 0,
          width: parseFloat(attrs.width) || 0,
          height: parseFloat(attrs.height) || 0,
          fill: attrs.fill,
        });
      }
    }

    if (type === "path" && attrs.d) {
      const pathData = attrs.d;
      const stroke = attrs.stroke;
      const strokeWidth = parseFloat(attrs["stroke-width"]) || 0;
      
      if (stroke && strokeWidth > 0) {
        paths.push({
          d: pathData,
          stroke: stroke,
          strokeWidth: strokeWidth,
        });
      } else if (pathData.includes("H") && pathData.includes("V") && !pathData.includes("L") && !pathData.includes("C")) {
        const match = pathData.match(/M([\d.]+)\s+([\d.]+)H([\d.]+)V([\d.]+)/);
        if (match) {
          rectangles.push({
            x: parseFloat(match[1]),
            y: parseFloat(match[2]),
            width: parseFloat(match[3]),
            height: parseFloat(match[4]),
            fill: attrs.fill,
          });
        }
      } else {
        ellipses.push({
          pathData: pathData,
          fill: attrs.fill,
        });
      }
    }

    if (type === "line" && attrs) {
      const x1 = parseFloat(attrs.x1) || 0;
      const y1 = parseFloat(attrs.y1) || 0;
      const x2 = parseFloat(attrs.x2) || 0;
      const y2 = parseFloat(attrs.y2) || 0;
      const strokeWidth = parseFloat(attrs["stroke-width"]) || 30;
      
      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const width = Math.abs(x2 - x1) || strokeWidth;
      const height = Math.abs(y2 - y1) || strokeWidth;
      
      rectangles.push({
        x: minX - strokeWidth / 2,
        y: minY - strokeWidth / 2,
        width: width + strokeWidth,
        height: strokeWidth,
        fill: attrs.stroke,
      });
    }

    // Generic Beacon Extractor
    if (id && id.startsWith("beacon")) {
      let x = 0, y = 0, r = 10;
      if (type === "circle") {
        x = parseFloat(attrs.cx);
        y = parseFloat(attrs.cy);
        r = parseFloat(attrs.r) || 10;
      } else if (type === "path" && attrs.d) {
        // Fallback for beacon drawn as path
        const bbox = getPathBoundingBox(attrs.d);
        if (bbox) {
          x = bbox.x + bbox.width / 2;
          y = bbox.y + bbox.height / 2;
          r = Math.max(bbox.width, bbox.height) / 2;
        }
      }
      beacons.push({ x, y, r, fill: attrs.fill, id });
      return; // Skip adding it to other visual arrays since BeaconRenderer handles it
    }

    if (type === "circle") {
      circles.push({
        x: parseFloat(attrs.cx),
        y: parseFloat(attrs.cy),
        r: parseFloat(attrs.r),
        fill: attrs.fill,
      });
    }

  });

  return {
    rectangles,
    beacons,
    circles,
    ellipses,
    paths,
  };

}

function getPathBoundingBox(d) {
  if (!d) return null;
  const points = [];
  const numMatch = d.match(/-?[\d.]+/g);
  if (numMatch) {
    for (let i = 0; i < numMatch.length - 1; i += 2) {
      points.push({ x: parseFloat(numMatch[i]), y: parseFloat(numMatch[i + 1]) });
    }
  }
  if (points.length === 0) return null;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
}