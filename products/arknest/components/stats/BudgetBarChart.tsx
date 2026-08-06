import type { MonthlySnapshot } from "@/types";

type Props = { snapshots: MonthlySnapshot[]; months: string[]; memberId?: string };

export default function BudgetBarChart({ snapshots, months, memberId }: Props) {
  const groups = months.map((month) => {
    const snapshot = snapshots.find((item) => item.month === month);
    const member = memberId
      ? snapshot?.members.find((item) => item.memberId === memberId)
      : undefined;
    return {
      month,
      income: memberId ? (member?.income ?? null) : (snapshot?.totalIncome ?? null),
      expenses: memberId ? (member?.expenses ?? null) : (snapshot?.totalExpenses ?? null),
      remaining: memberId ? (member?.remaining ?? null) : (snapshot?.remaining ?? null),
    };
  });
  const max = Math.max(
    ...groups.flatMap((group) =>
      [group.income, group.expenses, group.remaining]
        .filter((value): value is number => value !== null)
        .map(Math.abs),
    ),
    1,
  );
  const groupWidth = 560 / Math.max(groups.length, 1);
  const barWidth = Math.min(14, groupWidth / 4);

  return (
    <section className="arknest-chart-card">
      <div className="arknest-chart-card__header">
        <h2>Vue combinée</h2>
        <span className="arknest-chart-legend">
          <i data-tone="income" />
          Revenus <i data-tone="expenses" />
          Dépenses <i data-tone="remaining" />
          Reste
        </span>
      </div>
      <svg
        viewBox="0 0 640 230"
        role="img"
        aria-label="Comparaison mensuelle des revenus, dépenses et du reste"
        className="arknest-bar-chart"
      >
        <line x1="40" x2="600" y1="185" y2="185" className="arknest-chart-grid-line" />
        {groups.map((group, index) => {
          const center = 40 + groupWidth * index + groupWidth / 2;
          const bars = [
            [group.income, "income"],
            [group.expenses, "expenses"],
            [group.remaining, "remaining"],
          ] as const;
          return (
            <g key={group.month}>
              {bars.map(([value, tone], barIndex) => {
                const height = value === null ? 0 : (Math.abs(value) / max) * 140;
                return (
                  <rect
                    key={tone}
                    x={center + (barIndex - 1) * (barWidth + 2) - barWidth / 2}
                    y={185 - height}
                    width={barWidth}
                    height={height}
                    rx="3"
                    className={`arknest-chart-bar arknest-chart-bar--${tone}`}
                  >
                    <title>
                      {tone} : {value ?? "sans donnée"}
                    </title>
                  </rect>
                );
              })}
              <text x={center} y="213" textAnchor="middle" className="arknest-chart-label">
                {group.month.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
