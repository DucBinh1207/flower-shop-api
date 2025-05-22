import { Document } from "mongoose";

export interface IVariant {
  productId: number;
  size: string;
  variant: string;
  price: number;
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VariantDocument extends IVariant, Document {}

// Adding this to match the product types in specification
export interface Variant {
  productId: number;
  size: string;
  variant: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}
