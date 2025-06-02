import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { SupplierService } from "../services/supplier.service";
import { validate } from "../middlewares/validation.middleware";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "../validations/supplier.validation";
import { HttpException } from "../middlewares/error.middleware";

export class SupplierController {
  private supplierService = new SupplierService();

  /**
   * Create a new supplier
   */
  public createSupplier = [
    validate(createSupplierSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const supplierData = req.body;
        const supplier = await this.supplierService.createSupplier(
          supplierData
        );
        res.status(201).json({
          success: true,
          data: supplier.toObject(),
          message: "Supplier created successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Get supplier by ID
   */
  public getSupplierById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const supplierId = req.params.id;
      const supplier = await this.supplierService.getSupplierById(supplierId);
      res.status(200).json({
        success: true,
        data: supplier.toObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all suppliers
   */
  public getAllSuppliers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const status = req.query.status as "active" | "inactive" | undefined;

      const result = await this.supplierService.getAllSuppliers(
        page,
        limit,
        status
      );

      res.status(200).json({
        success: true,
        data: {
          data: result.suppliers.map((supplier) => supplier.toObject()),
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update supplier
   */
  public updateSupplier = [
    validate(updateSupplierSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const supplierId = req.params.id;
        const supplierData = req.body;

        const updatedSupplier = await this.supplierService.updateSupplier(
          supplierId,
          supplierData
        );

        res.status(200).json({
          success: true,
          data: updatedSupplier.toObject(),
          message: "Supplier updated successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Delete supplier
   */
  public deleteSupplier = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const supplierId = req.params.id;
      await this.supplierService.deleteSupplier(supplierId);
      res.status(200).json({
        success: true,
        message: "Supplier deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
