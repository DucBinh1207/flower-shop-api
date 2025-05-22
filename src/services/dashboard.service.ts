import dayjs from "dayjs";
import Order from "../models/order.model";
import User from "../models/user.model";
import Product from "../models/product.model";
import Category from "../models/category.model";
import { OrderDocument } from "interfaces/models";

export class DashboardService {
  public async getOrderCount(): Promise<{
    totalOrder: number;
    totalPendingOrder: number;
  }> {
    const count = await Order.countDocuments();
    const pendingCount = await Order.countDocuments({ status: "pending" });

    return {
      totalOrder: count,
      totalPendingOrder: pendingCount,
    };
  }

  public async getIncome(): Promise<{
    totalIncome: number;
    currentMonthIncome: number;
  }> {
    const allOrders = await Order.find({ status: "completed" });
    const totalIncome = allOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // Khoảng thời gian của tháng hiện tại
    const startOfMonth = dayjs().startOf("month").toDate();
    const endOfMonth = dayjs().endOf("month").toDate();

    // Tổng thu nhập của riêng tháng hiện tại
    const monthlyOrders = await Order.find({
      status: "completed",
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const currentMonthIncome = monthlyOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    return {
      totalIncome,
      currentMonthIncome,
    };
  }

  public async getUserCount(): Promise<{
    totalUser: number;
  }> {
    const count = await User.countDocuments();

    return {
      totalUser: count,
    };
  }

  public async getRecentOrders(): Promise<{
    orders: OrderDocument[];
  }> {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();

    return { orders };
  }

  public async getDashboardStatistics() {
    const totalProduct = await Product.countDocuments();
    const totalCategory = await Category.countDocuments();

    const completedOrders = await Order.countDocuments({ status: "completed" });
    const totalOrders = await Order.countDocuments();
    const orderCompletionRate =
      totalOrders === 0 ? 0 : completedOrders / totalOrders;

    const productTypePerCategory = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        },
      },
      {
        $project: {
          _id: 0,
          category: "$name",
          count: { $size: "$products" },
        },
      },
    ]);

    return {
      totalProduct,
      totalCategory,
      orderCompletionRate,
      productTypePerCategory,
    };
  }
}

export default new DashboardService();
