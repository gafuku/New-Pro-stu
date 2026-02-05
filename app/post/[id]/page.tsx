"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AttachmentList from "@/components/AttachmentList";
import AnswerList from "@/components/AnswerList";
import {
  addDoc,
  collection,
  db,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "@/lib/firebase";
import { Answer, Post } from "@/lib/types";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "posts", postId),
      (snap) => {
        if (snap.exists()) {
          setPost({ id: snap.id, ...(snap.data() as any) });
        } else {
          setError("Post not found or not approved.");
        }
      },
      () => setError("Post not found or not approved.")
    );

    const q = query(
      collection(db, "answers"),
      where("postId", "==", postId),
      where("status", "==", "approved"),
      orderBy("createdAt", "asc")
    );
    const unsubAnswers = onSnapshot(q, (snap) => {
      const next: Answer[] = [];
      snap.forEach((doc) => next.push({ id: doc.id, ...(doc.data() as any) }));
      setAnswers(next);
    });

    return () => {
      unsub();
      unsubAnswers();
    };
  }, [postId]);

  const submitAnswer = async () => {
    if (!body.trim()) return;
    await addDoc(collection(db, "answers"), {
      postId,
      body,
      status: "pending",
      authorName: name || "Anonymous",
      authorSchool: school || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setBody("");
    setStatus("Answer submitted for admin approval.");
  };

  if (error) {
    return <div className="panel">{error}</div>;
  }

  if (!post) {
    return <div className="panel">Loading...</div>;
  }

  return (
    <div className="panel">
      <h2>{post.title}</h2>
      <div style={{ color: "#6c6a67", marginBottom: 10 }}>
        {post.topic} · {post.school} · {post.campus}
      </div>
      <p>{post.body}</p>
      <AttachmentList attachments={post.attachments || []} />

      <hr style={{ margin: "24px 0" }} />
      <h3>Answers</h3>
      <AnswerList answers={answers} />

      <div style={{ marginTop: 24 }}>
        <h4>Submit an Answer</h4>
        <div className="kv">
          <input
            className="input"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Your school (optional)"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <textarea
          className="textarea"
          placeholder="Share your answer or insight"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="button" onClick={submitAnswer}>
            Submit Answer
          </button>
          {status && <span style={{ color: "#6c6a67" }}>{status}</span>}
        </div>
      </div>
    </div>
  );
}
