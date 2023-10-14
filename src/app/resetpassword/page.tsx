"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast"

export default function VerifyPage() {
	const router = useRouter()
	const [user, setUser] = React.useState({
		password: "",
		confirmPassword: "",
	})
	const [buttonDisabled, setButtonDisabled] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState(false);
	const [token, setToken] = React.useState('');
	const [validToken, setValidToken] = React.useState(false);

	const handleResetPassword = async () => {
		try {
			await axios.post('/api/users/resetpassword', {user});
		} catch (err:any) {
			setError(true);
			console.log(err.message);
		}
	}

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		setToken(urlToken || "");
	}, []);

	useEffect(() => {
		const verifyUserEmail = async () => {
			try {
				await axios.post('/api/users/verify/reset', {token});
				setValidToken(true);
			} catch (err:any) {
				setError(true);
				console.log(err.message);
			}
		}

		if (token.length > 0) {
			verifyUserEmail();
		}
	}, [token]);

	useEffect(() => {
		if ( 
			user.password.length > 0 &&
			user.confirmPassword.length > 0
		) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user])
	
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			{validToken && (
				<div className="text-center">
					<h1 className="text-2xl">{ loading ? "Processing" : "New Password" }</h1>
			
					<hr />

					<input id="token" type="hidden" value={token} />
					
					<label htmlFor="password">Password</label>
					<input
						className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
						id="password"
						type="password"
						value={user.password}
						onChange={ (e) => setUser({...user, password: e.target.value}) }
						placeholder="Password"
					/>
					
					<label htmlFor="confirmPassword">Confirm password</label>
					<input
						className="p-2 text-black border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
						id="confirmPassword"
						type="password"
						value={user.confirmPassword}
						onChange={ (e) => setUser({...user, confirmPassword: e.target.value}) }
						placeholder="Confirm Password"
					/>

					<button
						className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
						onClick={handleResetPassword}
						disabled={buttonDisabled}
					>
						{buttonDisabled ? "Complete the form": "Sign-Up Now"}
					</button>
				</div>
			)}
			{error && (
				<div className="text-center">
					<h1 className="text-4xl">Invalid Token!</h1>
					<p className="mt-4">Go to <Link href="/">Homepage</Link></p>
				</div>
			)}
		</div>
	)
}


