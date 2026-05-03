"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, UserCircle2, Search, GraduationCap, Clock, MessageSquare, CheckCircle2, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";

interface Mentor {
  uid: string;
  name: string;
  collegeName: string;
  yearOfStudy?: string;
  email: string;
}

interface ConnectionRequest {
  id: string;
  mentorId: string;
  status: "pending" | "accepted" | "rejected";
}

export default function MenteeDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentorsAndRequests() {
      if (!user) return;
      try {
        const mentorsQuery = query(collection(db, "users"), where("role", "==", "mentor"));
        const mentorsSnap = await getDocs(mentorsQuery);
        const mentorsList = mentorsSnap.docs.map(doc => doc.data() as Mentor);
        setMentors(mentorsList);

        const requestsQuery = query(collection(db, "requests"), where("menteeId", "==", user.uid));
        const requestsSnap = await getDocs(requestsQuery);
        const requestsList = requestsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ConnectionRequest[];
        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetching(false);
      }
    }

    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData && userData.role !== "mentee") {
        router.push("/mentor/dashboard");
      } else {
        fetchMentorsAndRequests();
      }
    }
  }, [user, userData, loading, router]);

  const handleRequestConnect = async (mentorId: string) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "requests"), {
        menteeId: user.uid,
        menteeName: userData?.name,
        mentorId,
        status: "pending",
        createdAt: serverTimestamp()
      });
      setRequests(prev => [...prev, { id: docRef.id, mentorId, status: "pending" }]);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  const getRequest = (mentorId: string) => {
    return requests.find(req => req.mentorId === mentorId);
  };

  // Get unique colleges from mentors
  const colleges = Array.from(new Set(mentors.map(m => m.collegeName))).filter(Boolean);
  
  const filteredColleges = colleges.filter(college => 
    college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mentorsForSelectedCollege = mentors.filter(m => m.collegeName === selectedCollege);

  if (loading || !user || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <UserCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mentee Dashboard</h1>
              <p className="text-sm text-neutral-400">Welcome back, {userData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
            >
              <Settings className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {!selectedCollege ? (
              // COLLEGE LIST VIEW
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-blue-900/40 to-neutral-900/40 p-8"
                >
                  <h2 className="text-2xl font-bold text-white">Explore Colleges</h2>
                  <p className="mt-2 text-neutral-400">Search for engineering colleges to find current students you can connect with.</p>
                  
                  <div className="mt-6 flex items-center rounded-xl border border-neutral-700 bg-neutral-950 p-2 focus-within:border-blue-500 transition-colors">
                    <Search className="ml-3 h-5 w-5 text-neutral-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search colleges (e.g. RV College, PES University)..." 
                      className="w-full bg-transparent px-4 py-2 text-white outline-none placeholder:text-neutral-600"
                    />
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Engineering Colleges</h3>
                  {fetching ? (
                    <div className="flex py-10 justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : filteredColleges.length === 0 ? (
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
                      <p className="text-neutral-400">No colleges found matching your search.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AnimatePresence>
                        {filteredColleges.map((college, idx) => (
                          <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSelectedCollege(college)}
                            className="cursor-pointer group flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-blue-500/50 hover:bg-neutral-800"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                                <GraduationCap className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-white line-clamp-2">{college}</h4>
                                <p className="text-sm text-neutral-400 mt-1">
                                  {mentors.filter(m => m.collegeName === college).length} Mentors
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // MENTORS FOR SELECTED COLLEGE VIEW
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => setSelectedCollege(null)}
                  className="flex items-center text-sm font-semibold text-neutral-400 transition hover:text-white"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Colleges
                </button>
                
                <div className="rounded-3xl border border-neutral-800 bg-blue-900/20 p-8">
                  <h2 className="text-2xl font-bold text-white">{selectedCollege}</h2>
                  <p className="text-blue-400 mt-2">Available Mentors</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AnimatePresence>
                    {mentorsForSelectedCollege.map((mentor) => {
                      const req = getRequest(mentor.uid);
                      const status = req?.status;
                      
                      return (
                        <motion.div
                          key={mentor.uid}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700"
                        >
                          <div>
                            <h4 className="text-xl font-bold text-white">{mentor.name}</h4>
                            <div className="mt-2 inline-flex items-center rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-300">
                              {mentor.yearOfStudy || "Engineering Student"}
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-neutral-800/50">
                            {status === "accepted" ? (
                              <button 
                                onClick={() => router.push(`/chat/${req?.id}`)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500/10 py-2.5 font-semibold text-blue-400 transition hover:bg-blue-500/20"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Start Chat
                              </button>
                            ) : status === "pending" ? (
                              <button disabled className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-800 py-2.5 font-semibold text-neutral-400 cursor-not-allowed">
                                <Clock className="h-4 w-4" />
                                Request Pending
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleRequestConnect(mentor.uid)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 font-semibold text-neutral-950 transition hover:bg-neutral-200"
                              >
                                Request to Connect
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sticky top-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">My Connections</h3>
              
              <div className="space-y-3">
                {requests.filter(r => r.status === "accepted").length === 0 ? (
                  <div className="rounded-xl border border-neutral-800/50 border-dashed p-4 text-center">
                    <p className="text-sm text-neutral-500">No active connections yet. Send some requests!</p>
                  </div>
                ) : (
                  requests.filter(r => r.status === "accepted").map(req => {
                    const mentor = mentors.find(m => m.uid === req.mentorId);
                    if (!mentor) return null;
                    return (
                      <div 
                        key={req.id} 
                        onClick={() => router.push(`/chat/${req.id}`)}
                        className="flex cursor-pointer items-center gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-3 transition hover:border-blue-500/50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{mentor.name}</p>
                          <p className="truncate text-xs text-neutral-400">Tap to chat</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
