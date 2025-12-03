import { SectionTitle } from "./SectionTitle";

export default function DescriptionSection({ description }) {
    return (
        <div>
            <SectionTitle>Product DNA</SectionTitle>
            <div className="prose prose-zinc max-w-none text-zinc-600">
                <p className="text-lg leading-relaxed mb-6">
                    {description}
                </p>
                <p className="mb-4">
                    Designed in our Urban Veins lab, this piece represents the intersection of high-fidelity aesthetics and street utility. Constructed with premium materials that age gracefully with every wear.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 mt-8">
                    {["Premium Heavyweight Cotton", "Oversized Fit", "Ribbed knit cuffs and hem", "High-density puff print", "Pre-shrunk to minimize shrinkage", "Machine wash cold"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium border-b border-zinc-100 pb-2">
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}