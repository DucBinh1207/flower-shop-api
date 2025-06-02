import { Types } from "mongoose";
import { Supplier } from "../models";
import {
  ISupplier,
  SupplierDocument,
} from "../interfaces/models/supplier.interface";
import { HttpException } from "../middlewares/error.middleware";

export class SupplierService {
  /**
   * Create a new supplier
   */
  public async createSupplier(
    supplierData: ISupplier
  ): Promise<SupplierDocument> {
    try {
      const createdSupplier = await Supplier.create({
        ...supplierData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return createdSupplier;
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to create supplier: ${error.message}`
      );
    }
  }

  /**
   * Get supplier by ID
   */
  public async getSupplierById(
    supplierId: string | Types.ObjectId | number
  ): Promise<SupplierDocument> {
    try {
      const supplier = await Supplier.findOne({ id: Number(supplierId) });
      if (!supplier) {
        throw new HttpException(404, "Supplier not found");
      }
      return supplier;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Failed to get supplier: ${error.message}`);
    }
  }

  /**
   * Get all suppliers with pagination and filters
   */
  public async getAllSuppliers(
    page: number = 1,
    limit: number = 10,
    status?: "active" | "inactive"
  ): Promise<{
    suppliers: SupplierDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query = { status };
    }

    try {
      const total = await Supplier.countDocuments(query);
      const suppliers = await Supplier.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        suppliers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new HttpException(500, `Failed to get suppliers: ${error.message}`);
    }
  }

  /**
   * Update supplier
   */

  public async updateSupplier(
    supplierId: string,
    supplierData: Partial<ISupplier>
  ): Promise<SupplierDocument> {
    try {
      // Validate ObjectId
      if (!Types.ObjectId.isValid(supplierId)) {
        throw new HttpException(400, "Invalid supplier ID");
      }

      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        throw new HttpException(404, "Supplier not found");
      }

      // Update
      const updatedSupplier = await Supplier.findByIdAndUpdate(
        supplierId,
        {
          ...supplierData,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedSupplier) {
        throw new HttpException(500, "Failed to update supplier");
      }

      return updatedSupplier;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        500,
        `Failed to update supplier: ${error.message}`
      );
    }
  }

  /**
   * Delete supplier
   */
  public async deleteSupplier(supplierId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(supplierId)) {
        throw new HttpException(400, "Invalid supplier ID");
      }

      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        throw new HttpException(404, "Supplier not found");
      }

      const deleteResult = await Supplier.deleteOne({ _id: supplierId });
      if (deleteResult.deletedCount === 0) {
        throw new HttpException(500, "Failed to delete supplier");
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        500,
        `Failed to delete supplier: ${error.message}`
      );
    }
  }
}
