export interface RoutingParams {
  seed: number;
  strands: number;
  spread: number;
  curvature: number;
}

export const routingDefaults: RoutingParams = { seed: 1703, strands: 19, spread: 1, curvature: 1 };

/** A small, deterministic field. SVG and the p5 study share these control points. */
export function quietRoutes(params: RoutingParams = routingDefaults) {
  let state = params.seed >>> 0;
  const random = () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  return [-1, 1].flatMap(side => Array.from({ length: params.strands }, (_, index) => {
    const offset = (index - (params.strands - 1) / 2) * 8 * params.spread;
    const jitter = (random() - .5) * 15;
    const bend = params.curvature * (1 + (random() - .5) * .12);
    const mirror = (x: number) => side === -1 ? x : 1440 - x;
    const points = [
      [-60, 83 + offset + jitter],
      [169 + offset * .5, 28 + offset],
      [262 * bend + offset * .2, 133 + offset],
      [208 + offset * .7, 263 + offset * .55],
      [147 / bend + offset * .8, 422 + offset * .4],
      [167 + offset, 523 + offset * .3],
      [341 + offset * .6, 622 + offset * .1],
    ].map(([x, y]) => [mirror(x), y]);
    const d = `M${points[0].join(',')} C${points.slice(1, 4).map(p => p.join(',')).join(' ')} C${points.slice(4).map(p => p.join(',')).join(' ')}`;
    return { d, points, index, side, emphasis: index % 6 === 0 };
  }));
}
