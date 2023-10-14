"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function LoginPage() {
	const router = useRouter()
	const [user, setUser] = React.useState({
		email: ""
	})
	const [buttonDisabled, setButtonDisabled] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

	const handleLogin = async () => {
		try {
			setLoading(true)
			const res = await axios.post("/api/users/forgotpassword", user)
			console.log("Forgot password Email sent! Please check your email", res.data)
			toast.success("Forgot password Email sent! Please check your email")
			router.push("/login")
		} catch (err:any) {
			console.log("Login failed", err.message)
			toast.error(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if ( 
			user.email.length > 0
		) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl">{loading ? "Processing" : "Forgot Password"}</h1>

			<hr />
			
			<label htmlFor="email">Email</label>
			<input
				className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="email"
				type="text"
				value={user.email}
				onChange={ (e) => setUser({...user, email: e.target.value}) }
				placeholder="Email"
			/>

			<div className="flex justify-between">
				<button
					className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
					onClick={handleLogin}
                    disabled={buttonDisabled}
				>
					Send Email
				</button>
			</div>

			<p className="mt-5">Already have an account? <Link href="/login">Login here</Link></p>
		</div>
	);
}