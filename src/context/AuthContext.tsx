"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "mentee" | "mentor" | null;

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  collegeName?: string;
  usn?: string;
  yearOfStudy?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  setUserData: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
            // Set user online only if document exists
            updateDoc(docRef, {
              isOnline: true,
              lastSeen: serverTimestamp()
            }).catch(console.error);
          } else {
            // Create user document if it doesn't exist
            await setDoc(docRef, {
              uid: currentUser.uid,
              email: currentUser.email || "",
              name: currentUser.displayName || "",
              role: null,
              isOnline: true,
              lastSeen: serverTimestamp(),
              createdAt: serverTimestamp()
            });
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email || "",
              name: currentUser.displayName || "",
              role: null
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Manage Online/Offline status on visibility change
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        if (document.visibilityState === "hidden") {
          updateDoc(userRef, {
            isOnline: false,
            lastSeen: serverTimestamp()
          }).catch(console.error);
        } else {
          updateDoc(userRef, {
            isOnline: true,
            lastSeen: serverTimestamp()
          }).catch(console.error);
        }
      }
    };

    const handleBeforeUnload = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        updateDoc(userRef, {
          isOnline: false,
          lastSeen: serverTimestamp()
        }).catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userData, loading, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
