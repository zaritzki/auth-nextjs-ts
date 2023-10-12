"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function ProfilePage() {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            await axios.get('/api/users/logout')
            toast.success('Logout successful')
            router.push('login')
        } catch (err: any) {
            console.log(err.message)
            toast.error(err.message)
        }

    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>

            <hr />

            <p>profile page...</p>

            <hr />

            <button
                className="bg-blue-500 mt-5 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={handleLogout}
            >Logout</button>
        </div>
    )
}