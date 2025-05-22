import { Document } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CategoryDocument extends ICategory, Document {}
