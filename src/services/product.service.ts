import mongoose, { Types } from "mongoose";
import Product from "../models/product.model";
import Category from "../models/category.model";
import Variant from "../models/variant.model";
import {
  IProduct,
  ProductDocument,
} from "../interfaces/models/product.interface";
import { VariantDocument } from "../interfaces/models/variant.interface";
import { HttpException } from "../middlewares/error.middleware";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import axios from "axios";

interface RecognitionAPIResponse {
  label: string;
  name: string;
}

export class ProductService {
  public async createProduct(productData: IProduct): Promise<ProductDocument> {
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      throw new HttpException(409, "Product with this slug already exists");
    }

    const category = await Category.findById(productData.categoryId);
    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    try {
      const newProduct = await Product.create(productData);

      await Category.findByIdAndUpdate(productData.categoryId, {
        $inc: { productCount: 1 },
      });

      return newProduct.toObject<ProductDocument>();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        500,
        `Failed to create product: ${error.message}`
      );
    }
  }

  public async getProductById(
    productId: string | Types.ObjectId | number
  ): Promise<ProductDocument> {
    // If productId is a number, find by numeric id field
    const product =
      typeof productId === "number"
        ? await Product.findOne({ id: productId }).populate(
            "categoryId",
            "name slug"
          )
        : await Product.findById(productId).populate("categoryId", "name slug");

    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    return product.toObject<ProductDocument>();
  }

  public async getProductBySlug(slug: string): Promise<ProductDocument> {
    const product = await Product.findOne({ slug }).populate(
      "categoryId",
      "name slug"
    );

    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    return product.toObject<ProductDocument>();
  }

  public async getProductByImage(
    file: Express.Multer.File
  ): Promise<IProduct[]> {
    const filePath = file.path;

    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath), {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const fastapiRes = await axios.post(
        "https://flower-recognition-api.onrender.com/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      const data = fastapiRes.data as RecognitionAPIResponse;
      const flowerName = data.name;

      if (!flowerName || typeof flowerName !== "string") {
        throw new Error(`Invalid flowerName: ${flowerName}`);
      }

      const products = await Product.find({
        name: { $regex: flowerName, $options: "i" },
      });

      if (products.length === 0) {
        throw new Error(`No product found for flower: ${flowerName}`);
      }

      return products;
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  public async getAllProducts(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {},
    sort: string = "-createdAt"
  ): Promise<{
    products: ProductDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const query: Record<string, any> = {};

    // Apply filters
    if (filters.categoryId) {
      query.categoryId = new mongoose.Types.ObjectId(filters.categoryId);
    }

    if (filters.supplierId) {
      query.supplierId = filters.supplierId;
    }

    if (filters.isBestSeller) {
      query.isBestSeller = filters.isBestSeller === "true";
    }

    if (filters.isNew) {
      query.isNew = filters.isNew === "true";
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) {
        query.price.$gte = parseFloat(filters.minPrice);
      }
      if (filters.maxPrice) {
        query.price.$lte = parseFloat(filters.maxPrice);
      }
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { shortDescription: { $regex: filters.search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Handle sorting
    const sortOption: Record<string, 1 | -1> = {};
    if (sort.startsWith("-")) {
      sortOption[sort.substring(1)] = -1;
    } else {
      sortOption[sort] = 1;
    }

    const [products, totalCount] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sortOption),
      Product.countDocuments(query),
    ]);
    // Check if products collection is empty
    const totalPages = Math.ceil(totalCount / limit);

    const result = {
      products: products.map((product) => product.toObject<ProductDocument>()),
      totalCount,
      totalPages,
    };
    return result;
  }

  public async updateProduct(
    productId: string | Types.ObjectId,
    productData: Partial<IProduct>
  ): Promise<ProductDocument> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    const productObj = product.toObject<ProductDocument>();

    if (productData.slug && productData.slug !== productObj.slug) {
      const existingProduct = await Product.findOne({
        slug: productData.slug,
        _id: { $ne: product._id },
      });

      if (existingProduct) {
        throw new HttpException(409, "Product with this slug already exists");
      }
    }

    if (
      productData.categoryId &&
      productObj.categoryId.toString() !== productData.categoryId.toString()
    ) {
      const category = await Category.findById(productData.categoryId);
      if (!category) {
        throw new HttpException(404, "Category not found");
      }

      await Promise.all([
        Category.findByIdAndUpdate(productObj.categoryId, {
          $inc: { productCount: -1 },
        }),
        Category.findByIdAndUpdate(productData.categoryId, {
          $inc: { productCount: 1 },
        }),
      ]);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      { new: true }
    ).populate("categoryId", "name slug");

    if (!updatedProduct) {
      throw new HttpException(404, "Product not found after update");
    }

    return updatedProduct.toObject<ProductDocument>();
  }

  public async deleteProduct(
    productId: string | Types.ObjectId
  ): Promise<void> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new HttpException(404, "Product not found");
      }

      const productObj = product.toObject<ProductDocument>();

      await Category.findByIdAndUpdate(productObj.categoryId, {
        $inc: { productCount: -1 },
      });

      await Variant.deleteMany({ productId: productObj._id });

      await Product.findByIdAndDelete(productId);
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to delete product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get product with its variants
   */
  public async getProductWithVariants(
    productId: string | Types.ObjectId | number
  ): Promise<{
    product: ProductDocument;
    variants: VariantDocument[];
  }> {
    try {
      const product = await this.getProductById(productId);
      const variants = await Variant.find({ productId: Number(productId) });

      return {
        product,
        variants: variants.map((variant) =>
          variant.toObject<VariantDocument>()
        ),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        500,
        `Failed to get product with variants: ${error.message}`
      );
    }
  }
}

export default new ProductService();
