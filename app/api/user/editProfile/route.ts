import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbconfig/mongoDbConfig";
import User from "@/models/user/userModel";
import { getCookieData } from "@/helper/getTokenData";

export async function POST(request: NextRequest) {
    try {
        await Connect();

        const userId = await getCookieData(request);

        if (!userId) {
            return NextResponse.json({
                message: "Make login first",
                success: false
            })
        }

        const existingUser = await User.findOne({ _id: userId })

        if (!existingUser) {
            return NextResponse.json({
                message: "Unable To find User",
                success: false
            })
        }

        const body = await request.json()

        const { firstName, lastName, phoneNumber, email, address } = body;


        const updates: any = {};

        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (email) updates.email = email;
        if (phoneNumber) {
            if (phoneNumber.isdCode) updates["phoneNumber.isdCode"] = phoneNumber.isdCode;
            if (phoneNumber.number) updates["phoneNumber.number"] = phoneNumber.number;
        }

        if (address) {
            if (address.city) updates["address.city"] = address.city;
            if (address.state) updates["address.state"] = address.state;
            if (address.locality) updates["address.locality"] = address.locality;
            if (address.country) updates["address.country"] = address.country;
            if (address.pincode) updates["address.pincode"] = address.pincode;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            success: true,
        });

    } catch (error: any) {
        console.log("Unable to edit Profile", error)
        return NextResponse.json({
            message: "Unable to edit Profile", error,
            success: false
        })
    }
}