"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, UserCircle2, ArrowLeft } from "lucide-react";

export default function RoleSelection() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back home
      </Link>

      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white md:text-5xl"
          >
            Join KCET Mentor Connect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-neutral-400"
          >
            Choose how you want to use the platform.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/register/mentee" className="block h-full">
              <div className="group relative flex h-full flex-col items-center rounded-3xl border border-neutral-800 bg-neutral-900/50 p-10 text-center transition-all hover:border-blue-500/50 hover:bg-neutral-800/80">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/0 to-blue-500/0 opacity-0 transition-opacity group-hover:from-blue-500/10 group-hover:opacity-100" />
                <div className="mb-6 rounded-full bg-blue-500/10 p-6 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                  <UserCircle2 className="h-16 w-16" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white">I am a Mentee</h2>
                <p className="text-neutral-400">
                  I am a KCET aspirant looking for counselling guidance and college insights.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/register/mentor" className="block h-full">
              <div className="group relative flex h-full flex-col items-center rounded-3xl border border-neutral-800 bg-neutral-900/50 p-10 text-center transition-all hover:border-indigo-500/50 hover:bg-neutral-800/80">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-indigo-500/0 to-indigo-500/0 opacity-0 transition-opacity group-hover:from-indigo-500/10 group-hover:opacity-100" />
                <div className="mb-6 rounded-full bg-indigo-500/10 p-6 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <GraduationCap className="h-16 w-16" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white">I am a Mentor</h2>
                <p className="text-neutral-400">
                  I am an engineering student wanting to guide juniors through KCET counselling.
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-neutral-500"
        >
          Already have an account? <Link href="/login" className="text-white hover:underline">Log in</Link>
        </motion.p>
      </div>
    </div>
  );
}
