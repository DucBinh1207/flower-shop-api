import { Types } from "mongoose";
import Category from "../models/category.model";
import {
  ICategory,
  CategoryDocument,
} from "../interfaces/models/category.interface";
import { HttpException } from "../middlewares/error.middleware";

export class CategoryService {
  public async createCategory(
    categoryData: ICategory
  ): Promise<CategoryDocument> {
    const existingCategory = await Category.findOne({
      slug: categoryData.slug,
    });

    if (existingCategory) {
      throw new HttpException(409, "Category with this slug already exists");
    }

    const newCategory = await Category.create(categoryData);

    return newCategory.toObject<CategoryDocument>();
  }

  public async getCategoryById(
    categoryId: string | Types.ObjectId | number
  ): Promise<CategoryDocument> {
    // Find category by id or _id based on type
    const category =
      typeof categoryId === "number"
        ? await Category.findOne({ id: categoryId })
        : await Category.findById(categoryId);

    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    return category.toObject<CategoryDocument>();
  }

  public async getCategoryBySlug(slug: string): Promise<CategoryDocument> {
    const category = await Category.findOne({ slug });

    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    return category.toObject<CategoryDocument>();
  }

  public async getAllCategories(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    categories: CategoryDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [categories, totalCount] = await Promise.all([
      Category.find(query).skip(skip).limit(limit).sort({ name: 1 }),
      Category.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return {
      categories: categories.map((category) =>
        category.toObject<CategoryDocument>()
      ),
      totalCount,
      totalPages,
    };
  }

  public async updateCategory(
    categoryId: string | Types.ObjectId,
    categoryData: Partial<ICategory>
  ): Promise<CategoryDocument> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new HttpException(400, "Invalid category ID");
    }

    if (categoryData.slug) {
      const existing = await Category.findOne({
        slug: categoryData.slug,
        _id: { $ne: categoryId },
      });

      if (existing) {
        throw new HttpException(409, "Category with this slug already exists");
      }
    }

    // Cập nhật category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      categoryData,
      { new: true }
    );

    if (!updatedCategory) {
      throw new HttpException(404, "Category not found");
    }

    return updatedCategory.toObject<CategoryDocument>();
  }

  public async deleteCategory(
    categoryId: string | Types.ObjectId | number
  ): Promise<void> {
    // Delete by numeric id if categoryId is a number
    const result =
      typeof categoryId === "number"
        ? await Category.findOneAndDelete({ id: categoryId })
        : await Category.findByIdAndDelete(categoryId);

    if (!result) {
      throw new HttpException(404, "Category not found");
    }
  }
}

export default new CategoryService();
