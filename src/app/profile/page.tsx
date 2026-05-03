"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Save, UserCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, userData, loading, setUserData } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [usn, setUsn] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(userData.name || "");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCollegeName(userData.collegeName || "");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setYearOfStudy(userData.yearOfStudy || "");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsn(userData.usn || "");
      }
    }
  }, [user, userData, loading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userData) return;
    
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name,
        collegeName,
        yearOfStudy,
        usn,
      });
      
      // Update local context
      setUserData({
        ...userData,
        name,
        collegeName,
        yearOfStudy,
        usn,
      });

      alert("Profile updated successfully!");
      router.push(userData.role === "mentor" ? "/mentor/dashboard" : "/mentee/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const isMentor = userData.role === "mentor";

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="rounded-full bg-neutral-900 p-3 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </header>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-10 backdrop-blur-md">
          <div className="mb-8 flex flex-col items-center">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${isMentor ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <UserCircle2 className="h-12 w-12" />
            </div>
            <p className="mt-4 text-sm font-medium capitalize text-neutral-400">{userData.role} Account</p>
            <p className="text-sm text-neutral-500">{userData.email}</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">College / Institution</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. RV College of Engineering"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">Year of Study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">USN / Roll Number (Optional)</label>
                <input
                  type="text"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="e.g. 1RV20CS001"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white transition ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              } ${isMentor ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {saving ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
