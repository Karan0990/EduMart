import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import Rating from "@/models/ratingProduct/ratingModel";
import { getCookieData } from "@/helper/getTokenData";
import { updateAverageRating } from "@/helper/updateAvgRating";
import "@/models/product/productModel";
import "@/models/user/userModel";

export async function POST(request: NextRequest) {
    try {

        await Connect();


        const userId = await getCookieData(request);
        if (!userId) {
            return NextResponse.json(
                { message: "Please login first", success: false },
                { status: 401 }
            );
        }

        const { rating, review, productId } = await request.json();


        if (!productId || rating === undefined) {
            return NextResponse.json(
                { message: "ProductId and rating are required", success: false },
                { status: 400 }
            );
        }


        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: "Rating must be a number between 1 and 5", success: false },
                { status: 400 }
            );
        }


        const productRating = await Rating.create({
            productId,
            userId,
            rating,
            review,
        });

        await updateAverageRating(productId);

        return NextResponse.json(
            {
                message: "Rating added successfully",
                success: true,
                productRating,
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error in rating product:", error);


        if (error.code === 11000) {
            return NextResponse.json(
                {
                    message: "You have already rated this product",
                    success: false,
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                message: "Internal server error",
                success: false,
            },
            { status: 500 }
        );
    }
}
