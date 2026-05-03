"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Target, Users, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 text-neutral-50 font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-[40%] -left-[10%] h-[70%] w-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] h-[70%] w-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <header className="relative z-10 flex shrink-0 items-center border-b border-neutral-800 bg-neutral-900/50 px-6 py-4 backdrop-blur-md sm:px-12">
        <Link 
          href="/"
          className="flex items-center gap-2 rounded-full text-sm font-semibold text-neutral-400 transition hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-12 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-sm font-medium text-neutral-300 backdrop-blur-md">
            <Heart className="mr-2 h-4 w-4 text-pink-500" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Empowering the next generation of{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Engineers.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            KCET Mentor Connect was built to bridge the gap between aspiring engineering students and those who have already successfully navigated the complex counselling process.
          </p>
        </motion.div>

        <div className="mt-20 grid w-full gap-8 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">The Problem</h3>
            <p className="text-neutral-400 leading-relaxed">
              Every year, thousands of students participate in KCET counselling without proper guidance. They rely on outdated information or generic advice, leading to poor college choices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">The Solution</h3>
            <p className="text-neutral-400 leading-relaxed">
              We connect these aspirants directly with current 2nd, 3rd, and 4th-year students from top engineering colleges to provide authentic, real-time insights and mentorship.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="sm:col-span-2 rounded-3xl border border-neutral-800 bg-gradient-to-br from-blue-900/20 to-neutral-900/50 p-8 backdrop-blur-sm sm:p-12"
          >
            <div className="mb-4 inline-flex rounded-xl bg-green-500/10 p-3 text-green-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-white">Safe & Secure</h3>
            <p className="max-w-3xl text-neutral-400 leading-relaxed">
              We prioritize the safety and privacy of both our mentors and mentees. Connections are strictly request-based, and communication happens within our platform without sharing personal phone numbers.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/role-selection"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:bg-neutral-200"
              >
                Join the Community
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
