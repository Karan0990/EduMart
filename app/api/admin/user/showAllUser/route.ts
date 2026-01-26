import User from "@/models/user/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getCookieData } from "@/helper/getTokenData";
import Connect from "@/dbconfig/mongoDbConfig";

export async function GET(request: NextRequest) {
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

        const allUsers = await User.find({}).select("-password");

        return NextResponse.json({
            allUsers,
            success: true,
        });

    } catch (error) {
        console.error("Unable to get all users by admin", error);

        return NextResponse.json(
            { message: "Unable to get all users" },
            { status: 500 }
        );
    }
}
