'use client';

import { Star, Loader2, User } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReviewsSection({ productId }) {
    const { data: session } = useSession();
    const router = useRouter();

    // State
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    // 1. Fetch Reviews on Load
    useEffect(() => {
        if (!productId) return;

        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews || []);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    // 2. Handle Submit
    const handleSubmit = async () => {
        setError("");
        if (!session) {
            router.push("/login");
            return;
        }
        if (rating === 0) {
            setError("Please select a star rating.");
            return;
        }
        if (!comment.trim()) {
            setError("Please write a comment.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Add new review to top of list immediately
                const newReview = {
                    ...data.review,
                    user: {
                        name: session.user.name,
                        image: session.user.image
                    },
                    createdAt: new Date().toISOString() // temporary timestamp
                };
                setReviews([newReview, ...reviews]);
                
                // Reset form
                setRating(0);
                setComment("");
                alert("Review submitted successfully!");
            } else {
                setError(data.message || "Failed to submit review.");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate Average Rating for display
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : "0.0";

    return (
        <div className="pt-10 border-t border-zinc-200">
            {/* Header Stats */}
            <div className="flex items-center justify-between mb-8">
                <SectionTitle>Reviews ({reviews.length})</SectionTitle>
                <div className="text-right">
                    <div className="text-3xl font-bold text-zinc-900">{averageRating}</div>
                    <div className="flex text-yellow-400 text-xs justify-end">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={12} 
                                fill={i < Math.round(averageRating) ? "currentColor" : "none"} 
                                className={i < Math.round(averageRating) ? "text-yellow-400" : "text-zinc-300"}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Write Review Form */}
            <div className="bg-zinc-50 p-6 rounded-2xl mb-10 border border-zinc-100">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-4">
                    {session ? "Write a Review" : "Login to Review"}
                </h4>
                
                {session ? (
                    <div className="flex flex-col gap-4">
                        {/* Star Rating Input */}
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    type="button"
                                >
                                    <Star
                                        size={24}
                                        fill={(hoverRating || rating) >= star ? "#FACC15" : "transparent"}
                                        className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-zinc-300"}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Comment Input */}
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-violet-500 transition-colors resize-none"
                            rows={4}
                            placeholder="How's the fit? What do you think about the quality?"
                            disabled={submitting}
                        ></textarea>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                        <button 
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="self-end px-6 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-violet-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting && <Loader2 size={14} className="animate-spin" />}
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                ) : (
                    <div className="text-sm text-zinc-500">
                        Please <button onClick={() => router.push('/login')} className="text-violet-600 font-bold hover:underline">login</button> to write a review.
                    </div>
                )}
            </div>

            {/* Review List */}
            <div className="space-y-8">
                {loading ? (
                    <p className="text-center text-zinc-400 text-sm">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center text-zinc-400 text-sm">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-zinc-100 pb-8 last:border-0">
                            <div className="flex items-center gap-3 mb-2">
                                {/* User Avatar */}
                                <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden relative flex items-center justify-center">
                                    {review.user?.image ? (
                                        <Image 
                                            src={review.user.image} 
                                            alt={review.user.name} 
                                            fill 
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User size={16} className="text-zinc-400" />
                                    )}
                                </div>
                                
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">{review.user?.name || "Anonymous"}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={10} 
                                                fill={i < review.rating ? "currentColor" : "none"} 
                                                className={i < review.rating ? "text-yellow-400" : "text-zinc-300"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="ml-auto text-xs text-zinc-400 font-mono">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-600 leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}