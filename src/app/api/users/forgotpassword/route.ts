import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { dbConnect } from "@/utils/dbConfig"
import { sendEmail } from "@/helpers/mailer"
import User from "@/models/userModel"

dbConnect()

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json()
		const { email } = reqBody;

		console.log(reqBody);

		// check if user exists
		const user = await User.findOne({email})
		if (!user) {
			return NextResponse.json({ 
				error: "User does not exists"
			}, { 
				status: 400
			})
		}

		// send verification email
		await sendEmail({
			email, 
			emailType: "RESET",
			userId: user._id
		});

		// response
		return NextResponse.json({ 
			message: "Forgot Email Send",
			success: true,
		})
		
	} catch (err: any) {
		return NextResponse.json({ error: err.message },{ status: 500 })
	}
}