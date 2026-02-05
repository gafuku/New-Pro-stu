import { Answer } from "@/lib/types";

export default function AnswerList({ answers }: { answers: Answer[] }) {
  if (!answers.length) return <p>No answers yet. Be the first to help!</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {answers.map((ans) => (
        <div key={ans.id} className="card">
          <div style={{ color: "#6c6a67", fontSize: 13 }}>
            {ans.authorName || "Anonymous"}
            {ans.authorSchool ? ` · ${ans.authorSchool}` : ""}
          </div>
          <p style={{ marginTop: 6 }}>{ans.body}</p>
        </div>
      ))}
    </div>
  );
}
