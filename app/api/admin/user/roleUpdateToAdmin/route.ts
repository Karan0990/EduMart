import User from "@/models/user/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getCookieData } from "@/helper/getTokenData";
import Connect from "@/dbconfig/mongoDbConfig";

export async function POST(request: NextRequest) {

    try {

        await Connect();

        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findById(userId).select("role");

        if (!user) {
            return NextResponse.json(
                { message: "Invalid user" },
                { status: 401 }
            );
        }

        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Only admin can access this route" },
                { status: 403 }
            );
        }

        const body = await request.json()
        const { id, role } = body

        console.log(id, role)

        const updateUser = await User.findOne({ _id: id })


        if (!updateUser) {
            return NextResponse.json({
                message: "User Not Fount", status: 401
            })
        }
        if (role !== "admin" && role !== "user") {
            return NextResponse.json({
                message: "role is not correct", status: 401
            })
        }

        if (updateUser.role == "user") {
            updateUser.role = role
        } else if (updateUser.role == "admin") {
            updateUser.role = "user"
        }

        await updateUser.save()

        return NextResponse.json({
            updateUser, success: true
        })

    } catch (error: any) {
        console.log("Unable to change User Role", error)

        return NextResponse.json(
            { message: "Unable to get all users" },
            { status: 500 }
        );
    }


}
