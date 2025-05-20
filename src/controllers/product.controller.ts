import { Request, Response, NextFunction } from "express";
import productService from "../services/product.service";
import { validate } from "../middlewares/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation";
import { Product } from "models";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

export class ProductController {
  public createProduct = [
    validate(createProductSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const product = await productService.createProduct(req.body);

        res.status(201).json({
          status: "success",
          data: {
            product,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      let sort = (req.query.sort as string) || "-createdAt";

      // Handle special sorting options from frontend
      if (sort === "price-asc") {
        sort = "price";
      } else if (sort === "price-desc") {
        sort = "-price";
      }

      // Filters
      const filters: Record<string, any> = {};

      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId;
      }

      if (req.query.supplierId) {
        filters.supplierId = req.query.supplierId;
      }

      if (req.query.isBestSeller) {
        filters.isBestSeller = req.query.isBestSeller;
      }

      if (req.query.isNew) {
        filters.isNew = req.query.isNew;
      }

      if (req.query.minPrice) {
        filters.minPrice = req.query.minPrice;
      }

      if (req.query.maxPrice) {
        filters.maxPrice = req.query.maxPrice;
      }

      if (req.query.search) {
        filters.search = req.query.search;
      }

      const result = await productService.getAllProducts(
        page,
        limit,
        filters,
        sort
      );

      res.status(200).json({
        status: "success",
        data: {
          data: result.products,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(productId)) ? Number(productId) : productId;

      const product = await productService.getProductById(id);

      res.status(200).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const slug = req.params.slug;

      const product = await productService.getProductBySlug(slug);

      res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  // public getProductByImage = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const file = (req as MulterRequest).file;

  //     if (!file) {
  //       res.status(400).json({
  //         status: "fail",
  //         message: "No image uploaded",
  //       });
  //       return;
  //     }

  //     const filePath = file.path;

  //     // Tạo FormData để gửi sang FastAPI
  //     const formData = new FormData();
  //     formData.append("file", fs.createReadStream(filePath), {
  //       filename: file.originalname,
  //       contentType: file.mimetype,
  //     });

  //     // Gửi yêu cầu POST tới FastAPI
  //     const fastapiRes = await fetch("http://localhost:8000/predict", {
  //       method: "POST",
  //       body: formData,
  //       headers: formData.getHeaders(),
  //     });

  //     if (!fastapiRes.ok) {
  //       const errorData = await fastapiRes.text();
  //       throw new Error(`FastAPI server error: ${errorData}`);
  //     }

  //     const result = await fastapiRes.json();

  //     // Sau khi xử lý xong, xóa file tạm
  //     fs.unlinkSync(filePath);

  //     res.status(200).json({
  //       status: "success",
  //       data: result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public getProductByImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const file = (req as MulterRequest).file;

      if (!file) {
        res.status(400).json({
          status: "fail",
          message: "No image uploaded",
        });
        return;
      }

      const product = await productService.getProductByImage(file);

      res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = [
    validate(updateProductSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const productId = req.params.id;
        // Convert string ID to number if it's a number
        const id = !isNaN(Number(productId)) ? Number(productId) : productId;

        const updatedProduct = await productService.updateProduct(id, req.body);

        res.status(200).json({
          status: "success",
          data: {
            product: updatedProduct,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(productId)) ? Number(productId) : productId;

      await productService.deleteProduct(id);

      res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get product with its variants
   */
  public getProductWithVariants = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(productId)) ? Number(productId) : productId;

      const result = await productService.getProductWithVariants(id);

      res.status(200).json({
        status: "success",
        data: {
          product: result.product,
          variants: result.variants,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
