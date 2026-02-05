import { Post } from "@/lib/types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <a className="card" href={`/post/${post.id}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>{post.title}</h3>
          <p style={{ margin: "6px 0", color: "#6c6a67" }}>{post.body.slice(0, 140)}...</p>
        </div>
        <span className="badge">{post.resourceType}</span>
      </div>
      <div style={{ marginTop: 8 }}>
        {post.topic && <span className="badge">{post.topic}</span>}
        {post.school && <span className="badge">{post.school}</span>}
        {post.campus && <span className="badge">{post.campus}</span>}
      </div>
    </a>
  );
}
