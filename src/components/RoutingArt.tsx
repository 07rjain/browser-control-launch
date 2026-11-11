import { useId } from 'react';
import { quietRoutes } from '../art/quietRouting';

const routes = quietRoutes();

export function RoutingArt({ signal }: { signal: number }) {
  const id = useId().replaceAll(':', '');
  return <div className="routing-art" aria-hidden="true">
    <svg viewBox="0 0 1440 670" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="0" y2="670" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b783b8" stopOpacity=".08" />
          <stop offset=".28" stopColor="#c477a6" stopOpacity=".48" />
          <stop offset=".72" stopColor="#b26fae" stopOpacity=".38" />
          <stop offset="1" stopColor="#b26fae" stopOpacity="0" />
        </linearGradient>
      </defs>
      {routes.map(route => <path key={`${route.side}-${route.index}`} d={route.d} stroke={`url(#${id}-ink)`} strokeWidth={route.emphasis ? 1.15 : .7} className="routing-strand" />)}
      <g key={signal} className="routing-signals">
        {routes.filter(route => route.index === 5 || route.index === 13).map(route => <path key={`${route.side}-${route.index}`} d={route.d} pathLength="1" className="routing-signal" style={{ animationDelay: `${route.index * 45}ms` }} />)}
      </g>
    </svg>
  </div>;
}
