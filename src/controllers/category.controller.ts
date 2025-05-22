import { Request, Response, NextFunction } from "express";
import categoryService from "../services/category.service";
import { validate } from "../middlewares/validation.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

export class CategoryController {
  public createCategory = [
    validate(createCategorySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const category = await categoryService.createCategory(req.body);

        res.status(201).json({
          status: "success",
          data: {
            category,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await categoryService.getAllCategories(
        page,
        limit,
        search
      );

      res.status(200).json({
        status: "success",
        data: {
          data: result.categories,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categoryId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(categoryId)) ? Number(categoryId) : categoryId;

      const category = await categoryService.getCategoryById(id);

      res.status(200).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const slug = req.params.slug;

      const category = await categoryService.getCategoryBySlug(slug);

      res.status(200).json({
        status: "success",
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = [
    validate(updateCategorySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const categoryId = req.params.id;

        const updatedCategory = await categoryService.updateCategory(
          categoryId,
          req.body
        );

        res.status(200).json({
          status: "success",
          data: {
            category: updatedCategory,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categoryId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(categoryId)) ? Number(categoryId) : categoryId;

      await categoryService.deleteCategory(id);

      res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
