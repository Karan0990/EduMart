'use client'

import React from "react"

import { useState } from 'react'
import { StarRating } from './star-rating'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import axios from "axios"
import toast from "react-hot-toast"

interface ReviewFormProps {
    productId: string
    userHasReviewed?: boolean
}

export function ReviewForm({ productId, userHasReviewed = false }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [text, setText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            setStatus('error')
            setErrorMessage('Please select a rating')
            return
        }

        if (text.trim().length < 10) {
            setStatus('error')
            setErrorMessage('Review must be at least 10 characters long')
            return
        }

        setIsLoading(true)
        setStatus('idle')

        try {


            const response = await axios.post("/api/product/rateProduct", { productId, review: text, rating })

            if (response?.data?.success) {
                toast.success("Review Successfully Submit")
                setStatus('success')
                setRating(0)
                setText('')
                setTimeout(() => setStatus('idle'), 3000)
            }

        } catch (error) {
            setStatus('error')
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit review')
        } finally {
            setIsLoading(false)
        }
    }

    if (userHasReviewed) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-muted-foreground">You have already reviewed this product</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Give Your Review</CardTitle>
                <CardDescription>Share your experience with this product</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex items-center gap-3">
                            <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
                            <span className="text-sm text-muted-foreground">{rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'No rating'}</span>
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-2">
                        <Label htmlFor="review">Your Review</Label>
                        <Textarea
                            id="review"
                            placeholder="Share your experience with this product... (minimum 10 characters)"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">{text.length} characters</p>
                    </div>

                    {/* Status Messages */}
                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                            <Check className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-green-700 font-medium">Review submitted successfully!</p>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || rating === 0 || text.trim().length < 10}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </motion.div>
                </form>
            </CardContent>
        </Card>
    )
}
