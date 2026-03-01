type CardProps = {
    title: string;
    description: string;
    details?: string[];
};

export default function Card({title, description, details}: CardProps) {
    return (
        <div
            className="group border border-neutral-200 rounded-xl p-10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-white"
        >

            <h3 className="text-xl font-semibold mb-4 transition-colors duration-300 group-hover:text-[#d9ad45]">
                {title}
            </h3>

            <p className="text-neutral-600 leading-relaxed">
                {description}
            </p>

            {/* Ligne dorée animée */}
            <div className="mt-8 h-[2px] w-0 bg-[#d9ad45] transition-all duration-300 group-hover:w-16"></div>

            {/* Détails */}
            {details && (
                <ul className="mt-6 space-y-2 text-neutral-600 text-sm">
                    {details.map((item, index) => (
                        <li key={index}>• {item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}