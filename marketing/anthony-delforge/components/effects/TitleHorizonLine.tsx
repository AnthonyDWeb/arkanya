import HorizonLine from "@/components/effects/HorizonLine";

type Props = {
  className?: string;
};

export default function TitleHorizonLine({ className = "" }: Props) {
  return (
    <div className={`flex-1 max-w-[200px] ${className}`}>
      <HorizonLine />
    </div>
  );
}
