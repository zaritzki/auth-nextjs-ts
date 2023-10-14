import { dbConnect } from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer"
import User from "@/models/userModel";
import bcryptjs from "bcryptjs"

dbConnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {token, password, confirmPassword} = reqBody;
        console.log(token);

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: {$gt: Date.now()},
        })
        console.log(user);

        // if there's no user
        if (!user) {
            return NextResponse.json({ 
                error: "Invalid token"
            }, {
                status: 400
            })
        }

        if (password === confirmPassword) {
            return NextResponse.json({ 
                error: "Please confirm your password"
            }, {
                status: 400
            })
        }

        // hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Update user details
        user.password = hashedPassword
        user.isVerified = true;
        user.forgotPasswordToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        // send verification email
        await sendEmail({
            email: user.email, 
            emailType: "CHANGE",
            userId: user._id
        });

        return NextResponse.json({
            message: "Password reset successfully",
            success: true
        })

    } catch (err:any) {
        return NextResponse.json({error: err.message}, {status: 500})
        
    }
}

