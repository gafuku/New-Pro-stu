"use client";

import { useState } from "react";
import { campuses, gradeLevels, schools, topics } from "@/lib/constants";
import {
  addDoc,
  collection,
  db,
  serverTimestamp,
  signInAnonymously,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  auth,
} from "@/lib/firebase";
import { Attachment } from "@/lib/types";

export default function AskPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [resourceType, setResourceType] = useState("question");
  const [campus, setCampus] = useState("");
  const [school, setSchool] = useState("");
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorSchool, setAuthorSchool] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const addLink = () => {
    setAttachments((prev) => [
      ...prev,
      { type: "link", url: "", name: "" },
    ]);
  };

  const updateAttachment = (idx: number, key: keyof Attachment, value: string) => {
    setAttachments((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [key]: value } : a))
    );
  };

  const uploadFile = async (file: File) => {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    const path = `attachments/public/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const url = await uploadFile(file);
      const type = file.type.includes("pdf")
        ? "pdf"
        : file.type.startsWith("image/")
        ? "image"
        : "link";
      setAttachments((prev) => [
        ...prev,
        { type, url, name: file.name },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      setStatus("Title and description are required.");
      return;
    }

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await addDoc(collection(db, "posts"), {
      title,
      body,
      status: "pending",
      resourceType,
      campus,
      school,
      topic,
      gradeLevel,
      tags: tagList,
      authorName: authorName || "Anonymous",
      authorSchool: authorSchool || "",
      attachments,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setTitle("");
    setBody("");
    setTags("");
    setAttachments([]);
    setStatus("Submitted for admin approval.");
  };

  return (
    <div className="panel">
      <h2>Ask a Question or Share a Resource</h2>
      <div className="kv">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="select"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
        >
          <option value="question">Question</option>
          <option value="resource">Resource</option>
        </select>
        <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Topic</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select className="select" value={school} onChange={(e) => setSchool(e.target.value)}>
          <option value="">School</option>
          {schools.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className="select" value={campus} onChange={(e) => setCampus(e.target.value)}>
          <option value="">Campus</option>
          {campuses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
        >
          <option value="">Grade level</option>
          {gradeLevels.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="textarea"
        rows={6}
        placeholder="Share details and context"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="kv">
        <input
          className="input"
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Your school (optional)"
          value={authorSchool}
          onChange={(e) => setAuthorSchool(e.target.value)}
        />
        <input
          className="input"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Attachments</h4>
        <button className="button secondary" onClick={addLink}>
          Add Link
        </button>
        <div style={{ marginTop: 8 }}>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          {loading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
        </div>
        {attachments.map((a, idx) => (
          <div key={idx} style={{ marginTop: 8 }}>
            <input
              className="input"
              placeholder="URL"
              value={a.url}
              onChange={(e) => updateAttachment(idx, "url", e.target.value)}
            />
            <input
              className="input"
              placeholder="Label"
              value={a.name}
              onChange={(e) => updateAttachment(idx, "name", e.target.value)}
              style={{ marginTop: 6 }}
            />
            <select
              className="select"
              value={a.type}
              onChange={(e) => updateAttachment(idx, "type", e.target.value)}
              style={{ marginTop: 6 }}
            >
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </select>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <button className="button" onClick={submit}>
          Submit for Approval
        </button>
        {status && <span style={{ color: "#6c6a67" }}>{status}</span>}
      </div>
    </div>
  );
}
