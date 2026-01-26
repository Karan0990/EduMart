import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import mongoose from "mongoose";
import Product from "@/models/product/productModel";



export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {

        await Connect();

        const { id } = await params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found in DB" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
