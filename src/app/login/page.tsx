"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        router.push(data.role === "mentor" ? "/mentor/dashboard" : "/mentee/dashboard");
      } else {
        setError("Account details not found. Please register.");
        auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center text-neutral-400 hover:text-white">
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-neutral-400">Log in to your KCET Mentor Connect account.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900/50 p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900/50 p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white p-3 font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50 mt-4"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="mx-4 text-xs text-neutral-500">OR</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <GoogleAuthButton isLogin={true} />

        <p className="mt-8 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link href="/role-selection" className="font-semibold text-white hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
