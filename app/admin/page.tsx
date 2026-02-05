"use client";

import { useEffect, useState } from "react";
import {
  auth,
  db,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  signInWithEmailAndPassword,
  updateDoc,
  where,
} from "@/lib/firebase";
import { Answer, Post } from "@/lib/types";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc } from "firebase/firestore";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [pendingAnswers, setPendingAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserId(null);
        setIsAdmin(false);
        return;
      }
      setUserId(user.uid);
      const snap = await getDoc(doc(db, "users", user.uid));
      setIsAdmin(snap.exists() && snap.data().role === "admin");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const qPosts = query(
      collection(db, "posts"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const unsubPosts = onSnapshot(qPosts, (snap) => {
      const next: Post[] = [];
      snap.forEach((doc) => next.push({ id: doc.id, ...(doc.data() as any) }));
      setPendingPosts(next);
    });

    const qAnswers = query(
      collection(db, "answers"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const unsubAnswers = onSnapshot(qAnswers, (snap) => {
      const next: Answer[] = [];
      snap.forEach((doc) => next.push({ id: doc.id, ...(doc.data() as any) }));
      setPendingAnswers(next);
    });

    return () => {
      unsubPosts();
      unsubAnswers();
    };
  }, [isAdmin]);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("");
    } catch (err: any) {
      setStatus(err.message || "Login failed");
    }
  };

  const setPostStatus = async (id: string, status: "approved" | "rejected") => {
    await updateDoc(doc(db, "posts", id), { status });
  };

  const setAnswerStatus = async (id: string, status: "approved" | "rejected") => {
    await updateDoc(doc(db, "answers", id), { status });
  };

  if (!userId || !isAdmin) {
    return (
      <div className="panel">
        <h2>Admin Login</h2>
        <input
          className="input"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <button className="button" onClick={login} style={{ marginTop: 12 }}>
          Login
        </button>
        {status && <p style={{ color: "#b00020" }}>{status}</p>}
        {!userId && <p>Only admins can access approvals.</p>}
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Admin Moderation</h2>
      <p>{pendingPosts.length} pending posts · {pendingAnswers.length} pending answers</p>

      <h3>Pending Posts</h3>
      {pendingPosts.map((post) => (
        <div key={post.id} className="card" style={{ marginBottom: 12 }}>
          <strong>{post.title}</strong>
          <p>{post.body}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="button" onClick={() => setPostStatus(post.id, "approved")}>
              Approve
            </button>
            <button className="button secondary" onClick={() => setPostStatus(post.id, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}

      <h3>Pending Answers</h3>
      {pendingAnswers.map((ans) => (
        <div key={ans.id} className="card" style={{ marginBottom: 12 }}>
          <p>{ans.body}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="button" onClick={() => setAnswerStatus(ans.id, "approved")}>
              Approve
            </button>
            <button className="button secondary" onClick={() => setAnswerStatus(ans.id, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
