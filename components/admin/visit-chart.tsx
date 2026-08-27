"use client";

import { useId, useMemo, useState } from "react";
import { formatVisitNumber, type VisitSeriesPoint } from "@/lib/cms/visit-types";
import { cn } from "@/lib/utils";

export function VisitChart({
  points,
  mode,
}: {
  points: VisitSeriesPoint[];
  mode: "hour" | "day" | "month";
}) {
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const width = 800;
  const height = 260;
  const pad = { top: 24, right: 16, bottom: 36, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const max = useMemo(() => {
    const peak = Math.max(...points.map((point) => Math.max(point.views, point.uniques)), 0);
    if (peak <= 4) return 4;
    return Math.ceil(peak / 4) * 4;
  }, [points]);

  const coords = useMemo(
    () =>
      points.map((point, index) => {
        const x =
          points.length === 1
            ? pad.left + innerW / 2
            : pad.left + (index / (points.length - 1)) * innerW;
        const yViews = pad.top + innerH - (point.views / max) * innerH;
        const yUniques = pad.top + innerH - (point.uniques / max) * innerH;
        return { ...point, x, yViews, yUniques };
      }),
    [innerH, innerW, max, pad.left, pad.top, points],
  );

  const area = useMemo(() => {
    if (coords.length === 0) return "";
    const line = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.yViews}`).join(" ");
    const last = coords[coords.length - 1];
    const first = coords[0];
    return `${line} L ${last.x} ${pad.top + innerH} L ${first.x} ${pad.top + innerH} Z`;
  }, [coords, innerH, pad.top]);

  const lineViews = useMemo(
    () => coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.yViews}`).join(" "),
    [coords],
  );
  const lineUniques = useMemo(
    () => coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.yUniques}`).join(" "),
    [coords],
  );

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: pad.top + innerH - ratio * innerH,
    value: Math.round(max * ratio),
  }));

  const labelEvery = Math.max(1, Math.ceil(points.length / (mode === "hour" ? 8 : 7)));
  const current = active != null ? coords[active] : null;
  const hasData = points.some((point) => point.views > 0);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full md:h-[280px]" role="img" aria-label="Évolution des visites">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00af84" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#00af84" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => (
          <g key={tick.y}>
            <line x1={pad.left} x2={width - pad.right} y1={tick.y} y2={tick.y} stroke="#e8eeec" strokeWidth="1" />
            <text x={pad.left - 8} y={tick.y + 4} textAnchor="end" className="fill-slate-400" fontSize="11">
              {formatVisitNumber(tick.value)}
            </text>
          </g>
        ))}
        {hasData ? <path d={area} fill={`url(#${gradientId})`} /> : null}
        {hasData ? (
          <path d={lineViews} fill="none" stroke="#00af84" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        ) : null}
        {hasData ? (
          <path
            d={lineUniques}
            fill="none"
            stroke="#065b48"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}
        {coords.map((point, index) =>
          index % labelEvery === 0 || index === coords.length - 1 ? (
            <text
              key={point.key}
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize="11"
            >
              {point.label}
            </text>
          ) : null,
        )}
        {current ? (
          <>
            <line
              x1={current.x}
              x2={current.x}
              y1={pad.top}
              y2={pad.top + innerH}
              stroke="#065b48"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <circle cx={current.x} cy={current.yViews} r="5" fill="#00af84" stroke="white" strokeWidth="2" />
            <circle cx={current.x} cy={current.yUniques} r="4" fill="#065b48" stroke="white" strokeWidth="2" />
          </>
        ) : null}
        {coords.map((point, index) => (
          <rect
            key={`${point.key}-hit`}
            x={point.x - innerW / points.length / 2}
            y={pad.top}
            width={Math.max(innerW / points.length, 8)}
            height={innerH}
            fill="transparent"
            className="cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={`${point.label} : ${formatVisitNumber(point.views)} pages vues, ${formatVisitNumber(point.uniques)} visiteurs`}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onPointerDown={() => setActive(index)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <title>{`${point.label} : ${formatVisitNumber(point.views)} pages vues, ${formatVisitNumber(point.uniques)} visiteurs`}</title>
          </rect>
        ))}
      </svg>
      {current ? (
        <div
          className={cn(
            "pointer-events-none absolute top-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur",
            current.x > width / 2 ? "right-6" : "left-14",
          )}
        >
          <p className="font-semibold text-[#065b48]">{current.label}</p>
          <p className="mt-1 text-slate-600">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#00af84]" />
            {formatVisitNumber(current.views)} pages vues
          </p>
          <p className="text-slate-600">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#065b48]" />
            {formatVisitNumber(current.uniques)} visiteurs
          </p>
        </div>
      ) : null}
    </div>
  );
}
