import { CalculateResult } from "@/lib/calculate";
import { formatAmount } from "@/lib/format";

type Props = {
  result: CalculateResult;
  memberCount: number;
};

export default function DashboardSummaryRows({ result, memberCount }: Props) {
  const totalIncome = result.members.reduce((sum, member) => sum + member.income, 0);

  return (
    <>
      <tr>
        <td>
          <strong>Revenu</strong>
        </td>
        {result.members.map((member) => (
          <td key={member.memberId}>{formatAmount(member.income)} EUR</td>
        ))}
      </tr>
      <tr>
        <td>
          <strong>Total</strong>
        </td>
        <td colSpan={memberCount}>
          <strong>{formatAmount(totalIncome)} EUR</strong>
        </td>
      </tr>
      <tr>
        <td>
          <strong>Repartition</strong>
        </td>
        {result.members.map((member) => (
          <td key={member.memberId}>{(member.percent * 100).toFixed(2)}%</td>
        ))}
      </tr>
    </>
  );
}
