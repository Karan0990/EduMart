import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import User from "@/models/user/userModel";
import { getCookieData } from "@/helper/getTokenData";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {

    try {
        await Connect();

        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json({
                message: "Make Login First",
                success: false
            })
        }

        const existingUser = await User.findOne({ _id: userId })

        if (!existingUser) {
            return NextResponse.json({
                message: "Unable to find User",
                success: false
            })
        }

        const body = await request.json()
        const { oldPassword, password, confirmPassword } = body;


        if (!oldPassword && !confirmPassword) {
            return NextResponse.json({
                message: "Enter old Password and New Password",
                success: false
            })
        }

        if (password != confirmPassword) {
            return NextResponse.json({
                message: "Enter Correct Confirm Password",
                success: false
            })
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, existingUser.password)

        if (!isPasswordCorrect) {
            return NextResponse.json({
                message: "Old Password is Not Correct",
                success: false
            })
        }

        const newHashedPassword = await bcrypt.hash(confirmPassword, 10);

        existingUser.password = newHashedPassword

        await existingUser.save()

        return NextResponse.json({
            message: "Password Reset Successfully",
            success: true
        })

    } catch (error: any) {
        console.log("Error in resetting Password", error)
        return NextResponse.json({
            message: "Error in reset Password",
            error,
            success: false
        })
    }


}