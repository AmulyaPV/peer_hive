"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ArrowLeft, UserCircle2 } from "lucide-react";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export default function MenteeRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role: "mentee",
        createdAt: new Date().toISOString(),
      });

      router.push("/mentee/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12 relative">
      <Link href="/role-selection" className="absolute top-8 left-8 flex items-center text-neutral-400 hover:text-white">
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm shadow-2xl"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-400">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Mentee Registration</h1>
          <p className="mt-2 text-sm text-neutral-400">Create an account to get KCET guidance.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900/50 p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              minLength={6}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900/50 p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-500 p-3 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50 mt-4"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="mx-4 text-xs text-neutral-500">OR</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        <GoogleAuthButton role="mentee" />
        
        <p className="mt-8 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-white hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
