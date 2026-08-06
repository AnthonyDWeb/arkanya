import Image from "next/image";
import Link from "next/link";

interface PriceCardProps {
  title: string;
  image: string;
  details: string[];
  note?: string;
  slug: string; // utilisé pour ?service=slug
}

export default function PriceCard({ title, image, details, note, slug }: PriceCardProps) {
  return (
    <div
      className="
                p-6 rounded-2xl shadow-sm hover:shadow-lg
                transition-all bg-white border border-[#EDEDED]
                flex flex-col
            "
    >
      <div className="relative w-full h-44 sm:h-48 mb-5 rounded-lg overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <h3 className="text-2xl font-semibold mb-3 text-center" style={{ color: "#809877" }}>
        {title}
      </h3>

      <ul className="text-[#444444] space-y-2 mb-4">
        {details.map((line, index) => (
          <li key={index}>✔ {line}</li>
        ))}
      </ul>

      {note && <p className="text-sm italic text-[#666666] text-center mb-4">{note}</p>}

      {/* CTA — aligné en bas quel que soit le contenu */}
      <div className="mt-auto pt-4 text-center">
        <Link
          href={`/contact?service=${slug}`}
          className="
                        inline-block px-6 py-3 rounded-md
                        bg-[#809877] text-white font-medium
                        hover:bg-[#6c8064] transition
                        shadow-soft hover:shadow-lg
                    "
        >
          Prendre contact
        </Link>
      </div>
    </div>
  );
}
