type Props = {
  className?: string;
};

export default function HorizonLine({ className = "" }: Props) {
  return (
    <div className={`horizon-line ${className}`}>
      <div className="horizon-line-glow" />
    </div>
  );
}
