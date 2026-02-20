"use client";

import { useEffect, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Answer, Comment, Post, University } from "@/lib/types";
import { useUniversities } from "@/lib/useUniversities";
import { apiGet, apiSend } from "@/lib/api";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authConfigured, setAuthConfigured] = useState(true);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [pendingAnswers, setPendingAnswers] = useState<Answer[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [editingUni, setEditingUni] = useState<University | null>(null);
  const [universityName, setUniversityName] = useState("");
  const [universitySlug, setUniversitySlug] = useState("");
  const [universityInfo, setUniversityInfo] = useState("");
  const [universityHeader, setUniversityHeader] = useState("");
  const [universityLogoUrl, setUniversityLogoUrl] = useState("");
  const [universityWebsite, setUniversityWebsite] = useState("");
  const [universityLocation, setUniversityLocation] = useState("");
  const [universityLat, setUniversityLat] = useState("");
  const [universityLon, setUniversityLon] = useState("");
  const [universityColleges, setUniversityColleges] = useState("");
  const [uploading, setUploading] = useState(false);
  const { universities, refresh } = useUniversities();

  const loadModerationData = async () => {
    const [pendingPostsData, pendingAnswersData, pendingCommentsData, allPostsData] = await Promise.all([
      apiGet<Post[]>("/api/posts?status=pending"),
      apiGet<Answer[]>("/api/answers?status=pending"),
      apiGet<Comment[]>("/api/comments?status=pending"),
      apiGet<Post[]>("/api/posts"),
    ]);

    setPendingPosts(pendingPostsData || []);
    setPendingAnswers(pendingAnswersData || []);
    setPendingComments(pendingCommentsData || []);
    setAllPosts(allPostsData || []);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const sessionData = await apiGet<{ isAdmin: boolean; configured: boolean }>("/api/admin/session");
      if (!mounted) return;
      setIsAdmin(sessionData.isAdmin);
      setAuthConfigured(sessionData.configured);
      if (sessionData.isAdmin) {
        await loadModerationData();
      }
    };

    init().catch(() => {
      if (!mounted) return;
      setIsAdmin(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async () => {
    try {
      await apiSend("/api/admin/login", "POST", { email, password });
      setIsAdmin(true);
      setStatus("");
      await loadModerationData();
    } catch {
      setStatus("Login failed");
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    await apiSend("/api/admin/logout", "POST");
    setIsAdmin(false);
  };

  const setPostStatus = async (id: string, status: "approved" | "rejected") => {
    await apiSend(`/api/posts/${id}`, "PATCH", { status });
    setPendingPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const setAnswerStatus = async (id: string, status: "approved" | "rejected") => {
    await apiSend(`/api/answers/${id}`, "PATCH", { status });
    setPendingAnswers((prev) => prev.filter((a) => a.id !== id));
  };

  const setCommentStatus = async (id: string, status: "approved" | "rejected") => {
    await apiSend(`/api/comments/${id}`, "PATCH", { status });
    setPendingComments((prev) => prev.filter((c) => c.id !== id));
  };

  const deletePost = async (id: string) => {
    await apiSend(`/api/posts/${id}`, "PATCH", { status: "rejected" });
    setAllPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p)));
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "universities");
      setUniversityLogoUrl(url);
    } finally {
      setUploading(false);
    }
  };

  const createUniversity = async () => {
    if (!universityName.trim()) return;
    const slug = universitySlug.trim() || universityName.trim().toLowerCase().replace(/\s+/g, "-");
    const colleges = universityColleges
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    await apiSend("/api/universities", "POST", {
      name: universityName.trim(),
      slug,
      info: universityInfo.trim(),
      headerTitle: universityHeader.trim() || universityName.trim(),
      logoUrl: universityLogoUrl.trim(),
      websiteUrl: universityWebsite.trim(),
      locationLabel: universityLocation.trim(),
      latitude: universityLat ? Number(universityLat) : null,
      longitude: universityLon ? Number(universityLon) : null,
      colleges,
    });
    await refresh();
    setUniversityName("");
    setUniversitySlug("");
    setUniversityInfo("");
    setUniversityHeader("");
    setUniversityLogoUrl("");
    setUniversityWebsite("");
    setUniversityLocation("");
    setUniversityLat("");
    setUniversityLon("");
    setUniversityColleges("");
  };

  const startEditUniversity = (uni: University) => {
    setEditingUni(uni);
    setUniversityName(uni.name || "");
    setUniversitySlug(uni.slug || "");
    setUniversityInfo(uni.info || "");
    setUniversityHeader(uni.headerTitle || "");
    setUniversityLogoUrl(uni.logoUrl || "");
    setUniversityWebsite(uni.websiteUrl || "");
    setUniversityLocation(uni.locationLabel || "");
    setUniversityLat(uni.latitude ? String(uni.latitude) : "");
    setUniversityLon(uni.longitude ? String(uni.longitude) : "");
    setUniversityColleges((uni.colleges || []).join(", "));
  };

  const updateUniversity = async () => {
    if (!editingUni) return;
    const slug = universitySlug.trim() || universityName.trim().toLowerCase().replace(/\s+/g, "-");
    const colleges = universityColleges
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    await apiSend(`/api/universities/${editingUni.id}`, "PATCH", {
      name: universityName.trim(),
      slug,
      info: universityInfo.trim(),
      headerTitle: universityHeader.trim() || universityName.trim(),
      logoUrl: universityLogoUrl.trim(),
      websiteUrl: universityWebsite.trim(),
      locationLabel: universityLocation.trim(),
      latitude: universityLat ? Number(universityLat) : null,
      longitude: universityLon ? Number(universityLon) : null,
      colleges,
    });
    await refresh();
    setEditingUni(null);
    setUniversityName("");
    setUniversitySlug("");
    setUniversityInfo("");
    setUniversityHeader("");
    setUniversityLogoUrl("");
    setUniversityWebsite("");
    setUniversityLocation("");
    setUniversityLat("");
    setUniversityLon("");
    setUniversityColleges("");
  };

  const deleteUniversity = async (id: string) => {
    await apiSend(`/api/universities/${id}`, "DELETE");
    await refresh();
  };

  if (!isAdmin) {
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
        {!authConfigured && (
          <p style={{ color: "#b00020" }}>Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_TOKEN in env.</p>
        )}
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Admin Moderation</h2>
      <p>
        {pendingPosts.length} pending posts · {pendingAnswers.length} pending answers · {" "}
        {pendingComments.length} pending comments
      </p>
      <button className="button secondary" onClick={logout}>Logout</button>

      <h3>Universities</h3>
      <div className="card" style={{ marginBottom: 16 }}>
        <input
          className="input"
          placeholder="University name"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
        />
        <input
          className="input"
          placeholder="University slug (e.g. umich, msu, stanford)"
          value={universitySlug}
          onChange={(e) => setUniversitySlug(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <input
          className="input"
          placeholder="Header title (optional)"
          value={universityHeader}
          onChange={(e) => setUniversityHeader(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <input
          className="input"
          placeholder="Logo URL (optional)"
          value={universityLogoUrl}
          onChange={(e) => setUniversityLogoUrl(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <input
          className="input"
          placeholder="Website URL (optional)"
          value={universityWebsite}
          onChange={(e) => setUniversityWebsite(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <input
          className="input"
          placeholder="Location label (e.g. Ann Arbor, MI)"
          value={universityLocation}
          onChange={(e) => setUniversityLocation(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <div className="kv" style={{ marginTop: 8 }}>
          <input
            className="input"
            placeholder="Latitude"
            value={universityLat}
            onChange={(e) => setUniversityLat(e.target.value)}
          />
          <input
            className="input"
            placeholder="Longitude"
            value={universityLon}
            onChange={(e) => setUniversityLon(e.target.value)}
          />
        </div>
        <input
          className="input"
          placeholder="Colleges (comma-separated, e.g. Business, Engineering, Architecture)"
          value={universityColleges}
          onChange={(e) => setUniversityColleges(e.target.value)}
          style={{ marginTop: 8 }}
        />
        <textarea
          className="textarea"
          placeholder="Short university info (optional)"
          value={universityInfo}
          onChange={(e) => setUniversityInfo(e.target.value)}
          rows={3}
          style={{ marginTop: 8 }}
        />
        <div style={{ marginTop: 8 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadLogo(file);
            }}
          />
          {uploading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button className="button" onClick={editingUni ? updateUniversity : createUniversity}>
            {editingUni ? "Update University" : "Add University"}
          </button>
          {editingUni && (
            <button
              className="button secondary"
              onClick={() => {
                setEditingUni(null);
                setUniversityName("");
                setUniversitySlug("");
                setUniversityInfo("");
                setUniversityHeader("");
                setUniversityLogoUrl("");
                setUniversityWebsite("");
                setUniversityLocation("");
                setUniversityLat("");
                setUniversityLon("");
                setUniversityColleges("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {universities.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h4 style={{ marginTop: 0 }}>Existing Universities</h4>
          <ul>
            {universities.map((s) => (
              <li key={s.id}>
                {s.name} {s.slug ? `· ${s.slug}` : ""} {s.headerTitle ? `· ${s.headerTitle}` : ""}
                <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                  <button className="button secondary" onClick={() => startEditUniversity(s)}>
                    Edit
                  </button>
                  <button className="button secondary" onClick={() => deleteUniversity(s.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      <h3>Pending Comments</h3>
      {pendingComments.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <p>{c.text}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="button" onClick={() => setCommentStatus(c.id, "approved")}>
              Approve
            </button>
            <button className="button secondary" onClick={() => setCommentStatus(c.id, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}

      <h3>All Posts</h3>
      {allPosts.map((post) => (
        <div key={post.id} className="card" style={{ marginBottom: 12 }}>
          <strong>{post.title}</strong>
          <p>{post.body}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="button secondary" onClick={() => deletePost(post.id)}>
              Remove (Reject)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
