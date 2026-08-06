import Image from "next/image";
import Link from "next/link";
import HorizonLine from "@/components/effects/HorizonLine";

type Props = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  size?: "small" | "large";
  href?: string;
};

export default function FeatureCard({
  title,
  description,
  icon,
  image,
  size = "small",
  href,
}: Props) {
  const sizeClass = size === "large" ? "h-[260px] md:h-[280px]" : "h-[200px]";

  const CardContent = (
    <div className="relative group cursor-pointer">
      {/* glow hover */}
      <div
        className="
                absolute
                inset-0
                rounded-xl
                opacity-0
                transition
                duration-500
                blur-xl
                group-hover:opacity-100
                bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.18),transparent_70%)]
                "
      />

      <div
        className={`
                relative
                ${sizeClass}
                px-8
                flex
                flex-col
                justify-center
                items-center
                rounded-xl
                border
                border-neutral-700
                backdrop-blur-sm
                text-center
                transition
                duration-300
                bg-[rgba(5,10,8,0.65)]
                bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)]
                bg-[length:4px_4px]
                group-hover:border-green-400
                group-hover:bg-[rgba(5,10,8,0.75)]
                group-hover:scale-[1.02]
                group-hover:-translate-y-1
                `}
      >
        {icon && <div className="flex justify-center mb-4 text-green-300 text-4xl">{icon}</div>}

        {image && (
          <div className="flex justify-center items-center mb-4">
            <Image
              src={image}
              alt={title ?? "project"}
              width={140}
              height={140}
              className="object-contain"
            />
          </div>
        )}

        {title && <h3 className="text-neutral-100 text-lg font-medium mb-2">{title}</h3>}

        {description && (
          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">{description}</p>
        )}
      </div>

      <HorizonLine className="absolute bottom-0" />
    </div>
  );

  if (href) {
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}
