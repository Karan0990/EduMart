import Cart from "@/models/cart/cartModel";
import Connect from "@/dbconfig/mongoDbConfig";
import { getCookieData } from "@/helper/getTokenData";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await Connect();


    try {
        const body = await request.json()
        const { productId } = body
        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json(
                { message: "Make Login First" },
                { status: 401 }
            );
        }


        let cart = await Cart.findOne({ userId });


        if (cart) {
            const itemIndex = cart.items.findIndex(
                (item: any) => item.productId.toString() == productId
            );


            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            }

            else {
                cart.items.push({
                    productId: productId,
                    quantity: 1
                });
            }

            await cart.save();
        }

        else {
            cart = await Cart.create({
                userId,
                items: [
                    {
                        productId: productId,
                        quantity: 1
                    }
                ]
            });
        }

        return NextResponse.json({
            message: "Product added to cart",
            cart,
            success: true
        });




    } catch (error: any) {

        console.log("Unable to Add item ", error)

        return NextResponse.json({
            message: "Unable To Add Item",
            error,
            success: false
        });
    }

}