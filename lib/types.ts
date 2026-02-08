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
  university: string;
  universitySlug?: string;
  college: string;
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

export type Comment = {
  id: string;
  postId: string;
  text: string;
  status: PostStatus;
  authorName?: string;
  authorSchool?: string;
  attachments?: Attachment[];
  createdAt?: any;
  updatedAt?: any;
};

export type University = {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
  info?: string;
  headerTitle?: string;
  websiteUrl?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  colleges?: string[];
};
