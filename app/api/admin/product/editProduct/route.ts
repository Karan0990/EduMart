import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product/productModel";
import Connect from "@/dbconfig/mongoDbConfig";
import { getCookieData } from "@/helper/getTokenData";
import User from "@/models/user/userModel";

export async function POST(request: NextRequest) {
    try {
        await Connect();

        const userId = await getCookieData(request)

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json(
                { message: "Invalid user" },
                { status: 401 }
            )
        }

        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admin can access this route" },
                { status: 403 }
            )
        }
        const body = await request.json()
        const { id, updatedData } = body

        console.log(updatedData)

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                updatedProduct,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.log("Unable to edit Product", error.message);
        return NextResponse.json(
            { success: false, message: "Unable to edit Product", error: error.message },
            { status: 500 }
        );
    }
}