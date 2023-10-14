import { dbConnect } from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

dbConnect();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const {token} = reqBody;
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

	} catch (err:any) {
		return NextResponse.json({error: err.message}, {status: 500})
		
	}
}

