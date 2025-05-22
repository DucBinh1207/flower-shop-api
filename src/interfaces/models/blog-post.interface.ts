import { Document } from "mongoose";

export interface IBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  tags: string[];
}

export interface BlogPostDocument extends IBlogPost, Document {}
