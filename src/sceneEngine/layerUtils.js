export function conditionMatches(condition, flags = {}) {
  if (!condition) return true;
  if (typeof condition === 'function') return Boolean(condition(flags));
  if (typeof condition === 'string') return Boolean(flags[condition]);
  if (Array.isArray(condition)) return condition.every((key) => Boolean(flags[key]));
  if (condition.all) return condition.all.every((key) => Boolean(flags[key]));
  if (condition.any) return condition.any.some((key) => Boolean(flags[key]));
  if (condition.not) return !conditionMatches(condition.not, flags);
  return true;
}

export function actorDepthFor(scene, feetY) {
  const bands = [...(scene.depthBands || [])].sort((a, b) => a.minY - b.minY);
  const band = bands.find((entry) => feetY >= entry.minY && feetY <= entry.maxY)
    || bands.at(-1)
    || { id: 'default', actorZ: 20 };
  return band;
}

export function actorScaleFor(scene, feetY) {
  const perspective = scene.perspective || { minY: 58, maxY: 91, minScale: 0.72, maxScale: 1 };
  const progress = Math.max(0, Math.min(1, (feetY - perspective.minY) / (perspective.maxY - perspective.minY)));
  return perspective.minScale + progress * (perspective.maxScale - perspective.minScale);
}

export function clampToWalkArea(scene, x, y) {
  const area = scene.walkArea || { minX: 5, maxX: 95, minY: 65, maxY: 91 };
  return {
    x: Math.max(area.minX, Math.min(area.maxX, x)),
    y: Math.max(area.minY, Math.min(area.maxY, y))
  };
}

export function applyLayerOverrides(layer, overrides = {}) {
  const patch = overrides[layer.id] || {};
  return { ...layer, ...patch };
}

export function sortLayers(layers) {
  return [...layers].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
}
