"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Users, ArrowRight, BookOpen, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-950">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[40%] -left-[10%] h-[70%] w-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[10%] h-[70%] w-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-24 text-center sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm font-medium text-neutral-300 backdrop-blur-md"
        >
          <Star className="mr-2 h-4 w-4 text-yellow-500" />
          <span>The #1 KCET Counselling Community</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          Guidance from those <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            who made it.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 sm:text-xl"
        >
          Connect with 2nd, 3rd, and 4th year engineering students from top colleges. Get real, unfiltered advice for your KCET journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6"
        >
          <Link
            href="/role-selection"
            className="group flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-neutral-950 transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="flex h-14 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 px-8 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/about"
            className="flex h-14 items-center justify-center rounded-full text-base font-semibold text-neutral-400 transition-all hover:text-white"
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">1-on-1 Mentorship</h3>
            <p className="text-neutral-400">Directly chat with seniors from colleges you are aiming for.</p>
          </div>
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Counselling Help</h3>
            <p className="text-neutral-400">Navigate the complex KCET option entry process with ease.</p>
          </div>
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3 text-purple-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">College Insights</h3>
            <p className="text-neutral-400">Learn about placements, campus life, and academics directly.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
