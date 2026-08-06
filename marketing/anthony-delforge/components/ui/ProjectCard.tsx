import Image from "next/image";
import Link from "next/link";
import HorizonLine from "@/components/effects/HorizonLine";

type Props = {
  title: string;
  description: string;
  image: string;
  url?: string;
};

export default function ProjectCard({ title, description, image, url }: Props) {
  const Card = (
    <div className="relative group">
      {/* Glow hover */}
      <div
        className="
        absolute
        inset-0
        rounded-xl
        opacity-0
        blur-xl
        transition
        duration-500
        group-hover:opacity-100
        bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.18),transparent_70%)]
        "
      />

      {/* CARD */}

      <div
        className="
        relative
        rounded-xl
        border
        border-neutral-800
        overflow-hidden
        aspect-[16/10]
        transition
        duration-300
        group-hover:border-green-400
        group-hover:scale-[1.02]
        group-hover:-translate-y-1
        "
      >
        {/* IMAGE */}

        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="
          object-cover
          transition
          duration-500
          group-hover:scale-105
          "
        />

        {/* TEXTE HOVER */}

        <div
          className="
          absolute
          inset-0
          flex
          flex-col
          justify-end
          p-6
          bg-gradient-to-t
          from-black/80
          via-black/40
          to-transparent
          opacity-0
          transition
          duration-300
          group-hover:opacity-100
          "
        >
          <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>

          <p className="text-neutral-300 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      <HorizonLine className="absolute bottom-0" />
    </div>
  );

  if (url) {
    return (
      <Link href={url} target="_blank" rel="noopener noreferrer">
        {Card}
      </Link>
    );
  }

  return Card;
}
