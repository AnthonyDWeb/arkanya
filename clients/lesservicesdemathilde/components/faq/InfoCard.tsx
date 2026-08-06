import { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div
      className="
                p-6 rounded-2xl
                shadow-sm hover:shadow-md transition-all
                bg-[#FFFFFF] border border-[#EDEDED]
                flex flex-col gap-3
            "
    >
      <div className="text-[#809877] text-3xl">{icon}</div>

      <h3 className="text-xl font-semibold" style={{ color: "#809877" }}>
        {title}
      </h3>

      <p className="text-[#444444] text-sm leading-relaxed">{children}</p>
    </div>
  );
}
