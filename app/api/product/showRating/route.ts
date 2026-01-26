import { NextRequest, NextResponse } from "next/server";
import Rating from "@/models/ratingProduct/ratingModel";
import Connect from "@/dbconfig/mongoDbConfig";
import "@/models/product/productModel";
import "@/models/user/userModel";


export async function POST(request: NextRequest) {
    try {
        await Connect();

        const body = await request.json()

        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { message: "Product ID is Not Valid", success: false },
                { status: 401 }
            );
        }

        const ratings = await Rating.find({ productId }).populate("userId", "firstName lastName avatar").sort({ createdAt: -1 });


        return NextResponse.json(
            { message: " All Ratings of Product ", success: true, ratings },
            { status: 201 }
        );



    } catch (error: any) {
        console.log("error in showing rating", error)
        return NextResponse.json(
            { message: "error in showing rating", success: false },
            { status: 401 }
        );
    }
}