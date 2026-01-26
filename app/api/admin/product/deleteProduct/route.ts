import Product from "@/models/product/productModel";
import Connect from "@/dbconfig/mongoDbConfig";
import { getCookieData } from "@/helper/getTokenData";
import User from "@/models/user/userModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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
        const { id } = body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid product ID" },
                { status: 400 }
            );
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        console.log("Deleted Product", deletedProduct);

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
                deletedProduct,
            },
            { status: 200 }
        );


    } catch (error: any) {
        console.log("Unable to delete Product")
        console.log(error)
    }


}