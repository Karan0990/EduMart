import { NextResponse, NextRequest } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import { Params } from "next/dist/server/request/params";
import bcrypt from "bcryptjs";
import User from "@/models/user/userModel";


export async function POST(request: NextRequest) {
    await Connect();
    try {

        const body = await request.json();
        const { confirmPassword, token } = body;


        const existingUser = await User.findOne({ forgetPasswordToken: token })

        if (!existingUser) {
            return NextResponse.json({
                message: "Token Session is expired",
                success: false
            })
        }



        if (!confirmPassword) {
            return NextResponse.json({
                message: "Enter password is Invalid",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(confirmPassword, 10);

        existingUser.password = hashedPassword

        await existingUser.save()

        return NextResponse.json({
            message: "Password Changed Successfully",
            success: true
        })


    } catch (error: any) {
        console.log("Error in reset Password", error)
        return NextResponse.json({
            message: "error in resetting password", error,
            success: false
        })
    }


}