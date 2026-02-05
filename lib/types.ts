export type ResourceType = "question" | "answer" | "resource";

export type PostStatus = "pending" | "approved" | "rejected";

export type Attachment = {
  type: "pdf" | "image" | "link";
  url: string;
  name: string;
};

export type Post = {
  id: string;
  title: string;
  body: string;
  status: PostStatus;
  resourceType: ResourceType;
  campus: string;
  school: string;
  topic: string;
  gradeLevel: string;
  tags: string[];
  authorName?: string;
  authorSchool?: string;
  createdAt?: any;
  updatedAt?: any;
  attachments: Attachment[];
};

export type Answer = {
  id: string;
  postId: string;
  body: string;
  status: PostStatus;
  authorName?: string;
  authorSchool?: string;
  createdAt?: any;
  updatedAt?: any;
};
