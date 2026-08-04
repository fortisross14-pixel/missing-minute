export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function closestOnSegment(p, a, b) {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const apx = p.x - a[0];
  const apy = p.y - a[1];
  const len2 = abx * abx + aby * aby || 1;
  const t = clamp((apx * abx + apy * aby) / len2, 0, 1);
  return { x: a[0] + abx * t, y: a[1] + aby * t };
}

export function clampToPolygons(point, polygons) {
  if (polygons.some((polygon) => pointInPolygon(point, polygon))) return point;
  let best = null;
  let bestDist = Infinity;
  polygons.forEach((polygon) => {
    polygon.forEach((a, index) => {
      const b = polygon[(index + 1) % polygon.length];
      const candidate = closestOnSegment(point, a, b);
      const dist = (candidate.x - point.x) ** 2 + (candidate.y - point.y) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        best = candidate;
      }
    });
  });
  return best || point;
}

export function resolveDepth(scene, point) {
  const zone = [...scene.depthZones]
    .reverse()
    .find((candidate) => pointInPolygon(point, candidate.polygon));
  return zone || scene.depthZones[0];
}

export function perspectiveScale(scene, y) {
  const p = scene.perspective;
  const ratio = clamp((y - p.nearY) / (p.farY - p.nearY), 0, 1);
  return p.nearScale + (p.farScale - p.nearScale) * ratio;
}
