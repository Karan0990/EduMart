import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {


    try {

        const token = request.cookies.get("token")?.value || ""

        if (!token) {
            return new Response(JSON.stringify({ message: "Make Login First" }))
        }

        const response = NextResponse.json({
            message: "User Logout Successfull",
            success: true
        })

        response.cookies.set("token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0),
        })

        return response


    } catch (error: any) {
        console.log("Unable To Logout User")
        console.log(error)
    }


}