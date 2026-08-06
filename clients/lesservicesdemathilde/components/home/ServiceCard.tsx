import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  image: string;
  title: string;
  items: string[];
  slug: string;
}

export default function ServiceCard({ image, title, items, slug }: ServiceCardProps) {
  return (
    <Link href={`/services/${slug}`}>
      <div
        className="
                    p-6 rounded-2xl cursor-pointer

                    bg-white border border-[#EDEDED]

                    shadow-[0_2px_6px_rgba(0,0,0,0.05)]

                    transform transition-all duration-300 ease-out

                    hover:scale-[1.04]
                    hover:-translate-y-1
                    hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)]
                "
      >
        <div className="relative w-full h-44 sm:h-48 mb-5 rounded-lg overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-[#809877]">{title}</h3>

        <ul className="text-[#444444] space-y-2">
          {items.map((item, i) => (
            <li key={i}>✔ {item}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
