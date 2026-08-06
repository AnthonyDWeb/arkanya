import { CalculateResult } from "@/lib/calculate";
import { formatAmount } from "@/lib/format";

type Props = {
  result: CalculateResult;
};

export default function DashboardBalanceRows({ result }: Props) {
  return (
    <>
      <tr>
        <td>
          <strong>A payer</strong>
        </td>
        {result.members.map((member) => (
          <td key={member.memberId}>
            <strong>{formatAmount(member.toPay)} EUR</strong>
          </td>
        ))}
      </tr>
      <tr>
        <td>
          <strong>Reste</strong>
        </td>
        {result.members.map((member) => (
          <td
            key={member.memberId}
            className={member.remaining < 0 ? "arknest-negative" : "arknest-positive"}
          >
            <strong>{formatAmount(member.remaining)} EUR</strong>
          </td>
        ))}
      </tr>
    </>
  );
}
