import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import Product from "@/models/product/productModel";

Connect();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const query: any = {};

        if (category) {
            const escaped = category
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.$or = [
                { category: { $regex: escaped, $options: "i" } },
                { productName: { $regex: escaped, $options: "i" } },
                { brandName: { $regex: escaped, $options: "i" } },
            ];
        }

        const products = await Product.find(query);

        console.log("Matched products:", products.length);

        return NextResponse.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Unable to fetch products", error);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
