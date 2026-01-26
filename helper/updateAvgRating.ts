import Rating from "@/models/ratingProduct/ratingModel";
import Product from "@/models/product/productModel";
import mongoose from "mongoose";

export const updateAverageRating = async (productId: string) => {
    const stats = await Rating.aggregate([
        {
            $match: {
                productId: new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $group: {
                _id: "$productId",
                avgRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            avgRating: Number(stats[0].avgRating.toFixed(1)),
            totalRatings: stats[0].totalRatings,
        });
    } else {

        await Product.findByIdAndUpdate(productId, {
            avgRating: 0,
            totalRatings: 0,
        });
    }
};
