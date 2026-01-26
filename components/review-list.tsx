'use client'

import { Review } from '@/lib/types'
import { StarRating } from './star-rating'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface ReviewListProps {
    productId: string
}


export function ReviewList({ productId }: ReviewListProps) {

    let [reviews, setReviews] = useState<Review[]>([])


    useEffect(() => {

        async function getData() {
            try {

                if (!productId) return;

                const response = await axios.post("/api/product/showRating", { productId })
                console.log(response.data)


                if (response?.data?.success) {
                    console.log("reviews fetch successfully")
                    setReviews(response.data.ratings || [])
                }


            } catch (error: any) {
                console.log("Unable to get reviews")
            }
        }
        getData();

    }, [])


    return (
        <div className="space-y-4">
            {reviews.map((review, index) => (
                <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-border rounded-lg p-4"
                >
                    {/* Review Header */}
                    <div className="flex items-start gap-3 mb-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                            <Image
                                src={review.userId.avatar || "/placeholder.svg"}
                                alt={review.userId.firstName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* User Info and Rating */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{review.userId.firstName} {review.userId.lastName}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <StarRating rating={review.rating} size="sm" />
                                <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-foreground leading-relaxed">{review.review}</p>
                </motion.div>
            ))}
        </div>
    )
}
