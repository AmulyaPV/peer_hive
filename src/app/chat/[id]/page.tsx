"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Send, ArrowLeft, UserCircle2 } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp | null;
}

interface ChatProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage(props: ChatProps) {
  const params = use(props.params);
  const { id: requestId } = params;
  
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState<{ id: string; name: string; role: string; isOnline?: boolean; lastSeen?: any } | null>(null);
  const [isValidChat, setIsValidChat] = useState<boolean | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (loading) return;
    if (!user || !userData) {
      router.push("/login");
      return;
    }

    const verifyChatAndFetchPartner = async () => {
      try {
        const reqRef = doc(db, "requests", requestId);
        const reqSnap = await getDoc(reqRef);

        if (!reqSnap.exists()) {
          setIsValidChat(false);
          return;
        }

        const requestData = reqSnap.data();

        // Security check: Only the involved mentor and mentee can view the chat
        if (requestData.menteeId !== user.uid && requestData.mentorId !== user.uid) {
          setIsValidChat(false);
          return;
        }

        if (requestData.status !== "accepted") {
          setIsValidChat(false);
          return;
        }

        setIsValidChat(true);

        // Fetch partner details and listen for presence
        const partnerId = userData.role === "mentee" ? requestData.mentorId : requestData.menteeId;
        const partnerRef = doc(db, "users", partnerId);
        
        const unsubPartner = onSnapshot(partnerRef, (docSnap) => {
          if (docSnap.exists()) {
            setChatPartner({
              id: partnerId,
              name: docSnap.data().name,
              role: docSnap.data().role,
              isOnline: docSnap.data().isOnline,
              lastSeen: docSnap.data().lastSeen,
            });
          }
        });
        
        return unsubPartner;

      } catch (error) {
        console.error("Error verifying chat:", error);
        setIsValidChat(false);
      }
    };

    let unsubPartner: any;
    verifyChatAndFetchPartner().then(unsub => {
      unsubPartner = unsub;
    });

    // Listen to messages
    const messagesRef = collection(db, "requests", requestId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return () => {
      unsubscribe();
      if (unsubPartner) unsubPartner();
    };
  }, [user, userData, loading, requestId, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage;
    setNewMessage(""); // Optimistic clear

    try {
      const messagesRef = collection(db, "requests", requestId, "messages");
      await addDoc(messagesRef, {
        text: messageText,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  if (loading || isValidChat === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isValidChat === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Chat Unavailable</h1>
        <p className="mt-2 text-neutral-400">This connection request hasn't been accepted yet, or you don't have access.</p>
        <Link 
          href={userData?.role === "mentor" ? "/mentor/dashboard" : "/mentee/dashboard"}
          className="mt-6 rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-neutral-950">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-4 border-b border-neutral-800 bg-neutral-900/50 px-6 py-4 backdrop-blur-md">
        <Link 
          href={userData?.role === "mentor" ? "/mentor/dashboard" : "/mentee/dashboard"}
          className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{chatPartner?.name || "Loading..."}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs capitalize text-neutral-400">{chatPartner?.role}</p>
              {chatPartner?.isOnline && (
                <span className="flex items-center gap-1 text-[10px] text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> Online
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center py-20">
              <p className="text-neutral-500">Say hello to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.uid;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                      isMine 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-neutral-800 text-neutral-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm md:text-base">{msg.text}</p>
                    {msg.createdAt && (
                      <span className={`mt-1 block text-[10px] ${isMine ? "text-blue-200" : "text-neutral-400"}`}>
                        {msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="shrink-0 border-t border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-4xl">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 p-1 pr-2 focus-within:border-blue-500 transition-colors"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-transparent px-4 py-2 text-white outline-none placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
