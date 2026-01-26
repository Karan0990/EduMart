import { NextRequest, NextResponse } from "next/server"
import { getCookieData } from "@/helper/getTokenData"
import User from "@/models/user/userModel"
import Connect from "@/dbconfig/mongoDbConfig"

export async function GET(request: NextRequest) {
    try {
        await Connect()

        const userId = await getCookieData(request)


        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    isLoggedIn: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            )
        }

        const user = await User.findById(userId).select("-password")


        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    isLoggedIn: false,
                    message: "User not found",
                },
                { status: 404 }
            )
        }


        return NextResponse.json(
            {
                success: true,
                isLoggedIn: true,
                user,
                message: "User fetched successfully",
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Unable To Get User", error)

        return NextResponse.json(
            {
                success: false,
                isLoggedIn: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        )
    }
}
