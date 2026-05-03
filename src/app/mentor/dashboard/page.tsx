"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, GraduationCap, MessageSquare, Settings, UserPlus, Check, X } from "lucide-react";
import Link from "next/link";

interface ConnectionRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  mentorId: string;
  status: "pending" | "accepted" | "rejected";
}

export default function MentorDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData && userData.role !== "mentor") {
        router.push("/mentee/dashboard");
      } else {
        // Setup real-time listener for requests
        const q = query(collection(db, "requests"), where("mentorId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const reqs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ConnectionRequest[];
          setRequests(reqs);
          setFetching(false);
        });

        return () => unsubscribe();
      }
    }
  }, [user, userData, loading, router]);

  const handleUpdateRequest = async (requestId: string, newStatus: "accepted" | "rejected") => {
    try {
      const reqRef = doc(db, "requests", requestId);
      await updateDoc(reqRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update request status.");
    }
  };

  if (loading || !user || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === "pending");
  const acceptedRequests = requests.filter(r => r.status === "accepted");

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mentor Dashboard</h1>
              <p className="text-sm text-neutral-400">Welcome, {userData.name} from {userData.collegeName}</p>
            </div>
          </div>
          <button
            onClick={() => auth.signOut()}
            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full rounded-3xl border border-neutral-800 bg-gradient-to-br from-indigo-900/40 to-neutral-900/40 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">Profile Status: Active</h2>
              <p className="mt-2 text-neutral-400 max-w-2xl">
                Mentees can currently find you in the directory. You are helping juniors make the right choice!
              </p>
            </div>
            <Link href="/profile" className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-600 shrink-0">
              <Settings className="h-5 w-5" />
              Edit Profile
            </Link>
          </motion.div>

          {/* Pending Requests Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
                  <UserPlus className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Incoming Requests</h3>
              </div>
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-300">
                {pendingRequests.length} Pending
              </span>
            </div>

            {fetching ? (
              <div className="flex py-10 justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 border-dashed p-8 text-center">
                <p className="text-neutral-400">You have no pending requests right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {pendingRequests.map(req => (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-5"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-white">{req.menteeName || "A Mentee"}</h4>
                        <p className="text-sm text-neutral-400">Wants to connect with you</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleUpdateRequest(req.id, "rejected")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-transparent px-4 py-2 font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                          Decline
                        </button>
                        <button 
                          onClick={() => handleUpdateRequest(req.id, "accepted")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-600"
                        >
                          <Check className="h-4 w-4" />
                          Accept
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Active Connections Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6"
          >
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Your Mentees</h3>
            </div>
            
            <div className="space-y-3">
              {acceptedRequests.length === 0 ? (
                <div className="rounded-xl border border-neutral-800/50 border-dashed p-4 text-center">
                  <p className="text-sm text-neutral-500">You haven&apos;t accepted any mentees yet.</p>
                </div>
              ) : (
                acceptedRequests.map(req => (
                  <div 
                    key={req.id} 
                    onClick={() => router.push(`/chat/${req.id}`)}
                    className="group cursor-pointer flex items-center justify-between rounded-xl bg-neutral-900 border border-neutral-800 p-4 transition-colors hover:border-indigo-500/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-white">{req.menteeName || "Mentee"}</p>
                      <p className="text-xs text-indigo-400 mt-1">Tap to chat</p>
                    </div>
                    <MessageSquare className="h-5 w-5 text-neutral-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
