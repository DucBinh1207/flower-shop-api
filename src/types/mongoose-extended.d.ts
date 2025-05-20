import { Document } from "mongoose";

declare module "mongoose" {
  interface Document {
    // id: number;
    [key: string]: any; // Allows for dynamic property access

    toObject<T = any>(): T;
  }
}
