import type { TrendPoint } from "@/lib/analytics";
import { formatAmount } from "@/lib/format";

type Props = { title: string; points: TrendPoint[]; color: string };

export default function TrendLineChart({ title, points, color }: Props) {
  const values = points.flatMap((point) => (point.value === null ? [] : [point.value]));
  const max = Math.max(...values.map((value) => Math.abs(value)), 1);
  const coordinates = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? 320 : 42 + (index * 556) / Math.max(points.length - 1, 1),
    y: point.value === null ? null : 174 - (point.value / max) * 124,
  }));
  const segments: string[] = [];
  let current = "";
  for (const point of coordinates) {
    if (point.y === null) {
      if (current) segments.push(current);
      current = "";
    } else {
      current += `${current ? " L" : "M"}${point.x},${point.y}`;
    }
  }
  if (current) segments.push(current);

  return (
    <section className="arknest-chart-card" aria-label={title}>
      <div className="arknest-chart-card__header">
        <h2>{title}</h2>
        <strong>
          {values.length ? `${formatAmount(values.at(-1) ?? 0)} €` : "Pas de données"}
        </strong>
      </div>
      <svg
        viewBox="0 0 640 210"
        role="img"
        aria-label={`Évolution : ${title}`}
        className="arknest-line-chart"
      >
        {[50, 91, 132, 174].map((y) => (
          <line key={y} x1="42" x2="598" y1={y} y2={y} className="arknest-chart-grid-line" />
        ))}
        {segments.map((path, index) => (
          <path
            key={index}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {coordinates.map((point) =>
          point.y === null ? null : (
            <circle key={point.month} cx={point.x} cy={point.y} r="5" fill={color}>
              <title>
                {point.label} : {formatAmount(point.value ?? 0)} €
              </title>
            </circle>
          ),
        )}
        {coordinates.map((point, index) =>
          index % Math.ceil(points.length / 6) === 0 || index === points.length - 1 ? (
            <text
              key={point.month}
              x={point.x}
              y="201"
              textAnchor="middle"
              className="arknest-chart-label"
            >
              {point.label}
            </text>
          ) : null,
        )}
      </svg>
    </section>
  );
}
