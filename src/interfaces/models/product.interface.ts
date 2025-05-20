import { Document } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  categoryId: string;
  supplierId: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  stock: number;
  packageSize: string;
  seedCount: number;
  howToPlant: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDocument extends IProduct, Document {
}

// Adding this interface to match the front-end specification
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  categoryId: number;
  supplierId: number;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  stock: number;
  packageSize: string;
  seedCount: number;
  howToPlant: string;
  createdAt: string;
  updatedAt: string;
}
