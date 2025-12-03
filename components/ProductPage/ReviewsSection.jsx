import { Star } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useState } from "react";

export default function ReviewsSection() {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="pt-10 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-8">
                <SectionTitle>Reviews (24)</SectionTitle>
                <div className="text-right">
                    <div className="text-3xl font-bold text-zinc-900">4.8</div>
                    <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                </div>
            </div>

            {/* Write Review */}
            <div className="bg-zinc-50 p-6 rounded-2xl mb-10">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Write a Review</h4>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                            >
                                <Star
                                    size={24}
                                    fill={(hoverRating || rating) >= star ? "#FACC15" : "transparent"}
                                    className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-zinc-300"}
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-violet-500 transition-colors resize-none"
                        rows={3}
                        placeholder="How's the fit? What do you think about the quality?"
                    ></textarea>
                    <button className="self-end px-6 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-violet-600 transition-colors cursor-pointer">
                        Submit Review
                    </button>
                </div>
            </div>

            {/* Review List */}
            <div className="space-y-8">
                {[1, 2].map((review, i) => (
                    <div key={i} className="border-b border-zinc-100 pb-8 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-200 to-lime-200" />
                            <div>
                                <p className="text-sm font-bold text-zinc-900">Alex D.</p>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                </div>
                            </div>
                            <span className="ml-auto text-xs text-zinc-400 font-mono">2 DAYS AGO</span>
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Absolutely love the fit of this hoodie. The material feels premium and heavy, perfect for winter layers. The print quality is top notch as well.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}