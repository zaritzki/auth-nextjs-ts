import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/utils/dbConfig"
import { sendEmail } from "@/helpers/mailer"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"


dbConnect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody;

        console.log(reqBody);

        // add validation
        // check if user already exists
        const user = await User.findOne({email})

        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create the user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        // save to MongoDB
        const savedUser = await newUser.save();
        console.log(savedUser);

        // send verification email
        await sendEmail({
            email, 
            emailType: "VERIFY",
            userId: savedUser._id
        });

        // response
        return NextResponse.json({ 
            message: "User created successfully",
            success: true,
            savedUser
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message },{ status: 500 })
    }
}