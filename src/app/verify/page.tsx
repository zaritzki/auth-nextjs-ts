"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function VerifyPage() {
    const [token, setToken] = React.useState('');
    const [verified, setVerified] = React.useState(false);
    const [error, setError] = React.useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verify', {token});
            setVerified(true);
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
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {verified && (
                <div className="text-center">
                    <h1 className="text-4xl">Email Verified!</h1>
                    <p className="mt-4"><Link href="/login">Login</Link></p>
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


