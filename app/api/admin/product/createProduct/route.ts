import Product from "@/models/product/productModel"
import Connect from "@/dbconfig/mongoDbConfig"
import { NextRequest, NextResponse } from "next/server"
import { getCookieData } from "@/helper/getTokenData"
import User from "@/models/user/userModel"

export const maxDuration = 60

export async function POST(request: NextRequest) {
    try {
        await Connect()


        const userId = await getCookieData(request)
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await User.findById(userId)
        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admin can access this route" },
                { status: 403 }
            )
        }


        const body = await request.json()

        const {
            productName,
            brandName,
            productPrice,
            shortDiscription,
            longDiscription,
            stock,
            category,
            coverImage,
            otherImages,
        } = body


        if (
            !productName ||
            !brandName ||
            !shortDiscription ||
            !longDiscription ||
            !category ||
            !coverImage ||
            !Array.isArray(otherImages) ||
            otherImages.length === 0 ||
            isNaN(Number(productPrice)) ||
            isNaN(Number(stock))
        ) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }

        const product = await Product.create({
            productName,
            brandName,
            productPrice: Number(productPrice),
            shortDiscription,
            longDiscription,
            stock: Number(stock),
            category,
            coverImage,
            otherImages,
        })

        return NextResponse.json(
            { success: true, product },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Unable to create Product", error)

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Server error",
            },
            { status: 500 }
        )
    }
}
