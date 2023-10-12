"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function SignupPage() {
	const router = useRouter()
	const [user, setUser] = React.useState({
		email: "",
		username: "",
		password: "",
	})
	const [buttonDisabled, setButtonDisabled] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

	const handleSignup = async () => {
		try {
			setLoading(true)
			const res = await axios.post("/api/users/signup", user)
			console.log("Sign-Up successful", res.data)
			router.push("/login")
		} catch (err:any) {
			console.log("Sign-Up failed", err.message)
			// toast.error(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if ( 
			user.email.length > 0 &&
			user.password.length > 0 &&
			user.username.length > 0
		) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-2xl">{ loading ? "Processing" : "Sign-Up" }</h1>
			
			<hr />
			
			<label htmlFor="username">Username</label>
			<input
				className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="username"
				type="text"
				value={user.username}
				onChange={ (e) => setUser({...user, username: e.target.value}) }
				placeholder="Username"
			/>
			
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

			<button
				className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				onClick={handleSignup}
				disabled={buttonDisabled}
			>
				{buttonDisabled ? "Complete the form": "Sign-Up Now"}
			</button>
			Already have an account? <Link href="/login">Login here</Link>
		</div>
	);
}