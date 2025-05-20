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

interface RecognitionAPIResponse {
  flower: string;
}

export class ProductService {
  public async createProduct(productData: IProduct): Promise<ProductDocument> {
    // Check if slug exists
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      throw new HttpException(409, "Product with this slug already exists");
    }

    // Check if category exists by numeric id
    const category = await Category.findById(productData.categoryId);
    if (!category) {
      throw new HttpException(404, "Category not found");
    }
    let newProduct: ProductDocument;
    try {
      const newProduct = await Product.create(productData);
      // Update product count in category
      await Category.findOneAndUpdate(
        { id: productData.categoryId },
        { $inc: { productCount: 1 } }
      );

      return newProduct.toObject<ProductDocument>();
    } catch (error) {
      console.log(error);
    }

    return newProduct.toObject<ProductDocument>();
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

      const fastapiRes = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      });

      if (!fastapiRes.ok) {
        const errorData = await fastapiRes.text();
        throw new Error(`FastAPI server error: ${errorData}`);
      }

      const result = await fastapiRes.json();
      const data = result as RecognitionAPIResponse;
      const flowerName = data.flower;

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

    console.log(query);

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
    productId: string | Types.ObjectId | number,
    productData: Partial<IProduct>
  ): Promise<ProductDocument> {
    // Find product by id or _id based on type
    const product =
      typeof productId === "number"
        ? await Product.findOne({ id: productId })
        : await Product.findById(productId);

    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    const productObj = product.toObject<ProductDocument>();

    // Check if slug exists (if trying to update slug)
    if (productData.slug && productData.slug !== productObj.slug) {
      const existingProduct = await Product.findOne({
        slug: productData.slug,
        id: { $ne: productObj.id }, // Use numeric id for comparison
      });

      if (existingProduct) {
        throw new HttpException(409, "Product with this slug already exists");
      }
    }

    // Check if category exists (if trying to update category)
    if (
      productData.categoryId &&
      productObj.categoryId !== productData.categoryId
    ) {
      // Check if category exists by numeric id
      const category = await Category.findOne({ id: productData.categoryId });

      if (!category) {
        throw new HttpException(404, "Category not found");
      }

      // Update product counts in both old and new categories
      await Promise.all([
        Category.findOneAndUpdate(
          { id: productObj.categoryId },
          { $inc: { productCount: -1 } }
        ),
        Category.findOneAndUpdate(
          { id: productData.categoryId },
          { $inc: { productCount: 1 } }
        ),
      ]);
    }

    // Update by numeric id if productId is a number
    const updatedProduct =
      typeof productId === "number"
        ? await Product.findOneAndUpdate({ id: productId }, productData, {
            new: true,
          }).populate("categoryId", "name slug")
        : await Product.findByIdAndUpdate(productId, productData, {
            new: true,
          }).populate("categoryId", "name slug");

    if (!updatedProduct) {
      throw new HttpException(404, "Product not found");
    }

    return updatedProduct.toObject<ProductDocument>();
  }

  public async deleteProduct(
    productId: string | Types.ObjectId | number
  ): Promise<void> {
    // Find product by id or _id based on type
    const product =
      typeof productId === "number"
        ? await Product.findOne({ id: productId })
        : await Product.findById(productId);

    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    const productObj = product.toObject<ProductDocument>();

    // Update product count in category
    await Category.findOneAndUpdate(
      { id: productObj.categoryId },
      { $inc: { productCount: -1 } }
    );

    // Delete associated variants
    await Variant.deleteMany({ productId: productObj.id });

    // Delete the product
    typeof productId === "number"
      ? await Product.findOneAndDelete({ id: productId })
      : await Product.findByIdAndDelete(productId);
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
