"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AttachmentList from "@/components/AttachmentList";
import AnswerList from "@/components/AnswerList";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Answer, Comment, Post, Attachment } from "@/lib/types";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentAttachments, setCommentAttachments] = useState<Attachment[]>([]);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: postData, error: postErr } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();
      if (!mounted) return;
      if (postErr || !postData) {
        setError("Post not found or not approved.");
        return;
      }
      setPost(postData as Post);

      const { data: answerData } = await supabase
        .from("answers")
        .select("*")
        .eq("postId", postId)
        .eq("status", "approved")
        .order("createdAt", { ascending: true });
      if (mounted) setAnswers((answerData || []) as Answer[]);

      const { data: commentData } = await supabase
        .from("comments")
        .select("*")
        .eq("postId", postId)
        .eq("status", "approved")
        .order("createdAt", { ascending: true });
      if (mounted) setComments((commentData || []) as Comment[]);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [postId]);

  const submitAnswer = async () => {
    if (!body.trim()) return;
    await supabase.from("answers").insert([
      {
        postId,
        body,
        status: "pending",
        authorName: name || "Anonymous",
        authorSchool: school || "",
      },
    ]);
    setBody("");
    setStatus("Answer submitted for admin approval.");
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    await supabase.from("comments").insert([
      {
        postId,
        text: commentText,
        status: "pending",
        authorName: name || "Anonymous",
        authorSchool: school || "",
        attachments: commentAttachments,
      },
    ]);
    setCommentText("");
    setCommentAttachments([]);
    setStatus("Comment submitted for admin approval.");
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
        {post.topic} · {post.college} · {post.campus}
      </div>
      <p>{post.body}</p>
      <AttachmentList attachments={post.attachments || []} />

      <hr style={{ margin: "24px 0" }} />
      <h3>Answers</h3>
      <AnswerList answers={answers} />

      <div style={{ marginTop: 24 }}>
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {comments.map((c) => (
              <div key={c.id} className="card">
                <div style={{ color: "#6c6a67", fontSize: 13 }}>
                  {c.authorName || "Anonymous"}
                  {c.authorSchool ? ` · ${c.authorSchool}` : ""}
                </div>
                <p style={{ marginTop: 6 }}>{c.text}</p>
                {c.attachments && c.attachments.length > 0 && (
                  <ul>
                    {c.attachments.map((a, idx) => (
                      <li key={`${a.url}-${idx}`}>
                        <a href={a.url} target="_blank" rel="noreferrer">
                          {a.name || a.url}
                        </a>{" "}
                        <span style={{ color: "#6c6a67" }}>({a.type})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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

      <div style={{ marginTop: 24 }}>
        <h4>Leave a Comment</h4>
        <textarea
          className="textarea"
          placeholder="Ask a follow-up or add context"
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <h5 style={{ margin: "6px 0" }}>Comment Attachments</h5>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadToCloudinary(file, "comments");
              const type = file.type.includes("pdf")
                ? "pdf"
                : file.type.startsWith("image/")
                ? "image"
                : "link";
              setCommentAttachments((prev) => [...prev, { type, url, name: file.name }]);
            }}
          />
          {commentAttachments.length > 0 && (
            <ul>
              {commentAttachments.map((a, idx) => (
                <li key={`${a.url}-${idx}`}>
                  {a.name} ({a.type})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="button secondary" onClick={submitComment}>
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
}
