"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function ProfilePage() {
	const router = useRouter()
	const [data, setData] = React.useState("");

	const handleLogout = async () => {
		try {
			await axios.get('/api/users/logout')
			toast.success('Logout successful')
			router.push('/')
		} catch (err: any) {
			console.log(err.message)
			toast.error(err.message)
		}
	}

	const getUserDetails = async () => {
		const res = await axios.get('/api/users/profile');
		console.log(res.data);
		setData(res.data.data._id);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1>Profile</h1>

			<hr />

			<p>Profile page</p>
			<p>{data !== "" && <Link href={`/profile/${data}`}>{data}</Link>}</p>

			<button
				className="bg-blue-500 mt-5 hover:bg-blue-700 text-white py-2 px-4 rounded"
				onClick={getUserDetails}
			>Show more details</button>

			<hr />

			<button
				className="bg-red-500 mt-5 hover:bg-red-700 text-white py-2 px-4 rounded"
				onClick={handleLogout}
			>Logout</button>
		</div>
	)
}