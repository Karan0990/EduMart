import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import User from "@/models/user/userModel";
import resetEmail from "@/helper/resetEmail";
import crypto from "crypto";


export async function POST(request: NextRequest) {
    await Connect();
    try {

        const body = await request.json();

        const { email } = body;

        console.log("Received email for password reset:", email);

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 404 }
            );
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const tokenExpiry = Date.now() + 15 * 60 * 1000;

        existingUser.forgetPasswordToken = resetToken;
        existingUser.resetPasswordExpire = new Date(tokenExpiry);

        await existingUser.save();

        await resetEmail({
            useremail: existingUser.email,
            userName: existingUser.firstName,
            token: resetToken
        });

        return NextResponse.json({
            message: "Password reset link has been sent to your email",
            success: true,
        });



    } catch (error: any) {
        console.log("Error in forgot password route:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }


}