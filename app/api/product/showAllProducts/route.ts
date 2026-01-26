import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/product/productModel";
import Connect from "@/dbconfig/mongoDbConfig";



export async function GET(request: NextRequest) {
    try {
        await Connect();

        const products = await Product.find({});

        if (products.length === 0) {
            return NextResponse.json({
                products: [],
                message: "No products found",
                success: true
            });
        }

        return NextResponse.json({
            products,
            success: true
        })


    } catch (error: any) {
        console.error("Unable to find products", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}