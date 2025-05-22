import { Document } from "mongoose";

export interface ISupplier {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierDocument extends ISupplier, Document {}
