import { Attachment } from "@/lib/types";

export default function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  if (!attachments.length) return null;
  return (
    <div>
      <h4>Attachments</h4>
      <ul>
        {attachments.map((a, idx) => (
          <li key={`${a.url}-${idx}`}>
            <a href={a.url} target="_blank" rel="noreferrer">
              {a.name || a.url}
            </a>
            <span style={{ marginLeft: 8, color: "#6c6a67" }}>({a.type})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
