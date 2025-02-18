"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SlideShow from "@/components/Home/SlideShow";
import Login from "@/components/Home/Login";
import Signup from "@/components/Home/Signup";

export default function Home() {
	const [isSignup, setIsSignup] = useState(true);
	const { isAuthenticated, initialized } = useAuth();
	const router = useRouter();
	useEffect(() => {
		// Only redirect after auth context is fully initialized
		if (initialized) {
		  if (isAuthenticated()) {
			router.push('/dashboard');
		  }
		}
	}, [isAuthenticated, router, initialized]);
	return (
		<div className="bg-white w-screen h-screen flex p-4">
			<SlideShow/>
			{isSignup ? <Signup toggleForm={() => setIsSignup(false)} /> : <Login toggleForm={() => setIsSignup(true)} />}
		</div>
	);
}
