import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import Rating from "@/models/ratingProduct/ratingModel";
import { updateAverageRating } from "@/helper/updateAvgRating";
import { getCookieData } from "@/helper/getTokenData";

export async function PATCH(request: NextRequest) {
    try {
        await Connect();

        const userId = await getCookieData(request);
        if (!userId) {
            return NextResponse.json(
                { message: "Please login first", success: false },
                { status: 401 }
            );
        }

        const { productId, newRating, newReview } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { message: "Product ID is required", success: false },
                { status: 400 }
            );
        }

        const existingRating = await Rating.findOne({ userId, productId });

        if (!existingRating) {
            return NextResponse.json(
                { message: "You have not rated this product", success: false },
                { status: 404 }
            );
        }


        if (newRating !== undefined) {
            if (
                typeof newRating !== "number" ||
                newRating < 1 ||
                newRating > 5
            ) {
                return NextResponse.json(
                    { message: "Rating must be between 1 and 5", success: false },
                    { status: 400 }
                );
            }
            existingRating.rating = newRating;
        }


        if (newReview !== undefined) {
            existingRating.review = newReview;
        }

        await existingRating.save();


        await updateAverageRating(productId);

        return NextResponse.json(
            {
                message: "Rating updated successfully",
                success: true,
                rating: existingRating,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in editing rating:", error);

        return NextResponse.json(
            {
                message: "Internal server error",
                success: false,
            },
            { status: 500 }
        );
    }
}
