import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel"
import { dbConnect } from "@/utils/dbConfig"

dbConnect();

export async function GET(request:NextRequest) {
	try {
		const userId =  await getDataFromToken(request); 
		const user = await User.findOne({_id: userId}).select("-password");
		return NextResponse.json({
			message: "User found",
			data: user
		})
	} catch (err:any) {
		return NextResponse.json({
			error: err.message
		}, {
			status: 400
		})
		
	}
}