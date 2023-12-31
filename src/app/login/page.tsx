"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function LoginPage() {
	const router = useRouter()
	const [user, setUser] = React.useState({
		email: "",
		password: "",
	})
	const [buttonDisabled, setButtonDisabled] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

	const handleLogin = async () => {
		try {
			setLoading(true)
			const res = await axios.post("/api/users/login", user)
			console.log("Login successful", res.data)
			toast.success("Login successful")
			router.push("/profile")
		} catch (err:any) {
			console.log("Login failed", err.message)
			toast.error(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if ( 
			user.email.length > 0 &&
			user.password.length > 0
		) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl">{loading ? "Processing" : "Login"}</h1>

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

			<label htmlFor="password">Password</label>
			<input
				className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="password"
				type="password"
				value={user.password}
				onChange={ (e) => setUser({...user, password: e.target.value}) }
				placeholder="Password"
			/>

			<div className="flex justify-between">
				<Link href="/forgotpassword">Forgot Password?</Link>

				<button
					className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
					onClick={handleLogin}
					disabled={buttonDisabled}
				>
					Login
				</button>
			</div>

			Need an account? <Link href="/signup">Sign-Up here</Link>
		</div>
	);
}