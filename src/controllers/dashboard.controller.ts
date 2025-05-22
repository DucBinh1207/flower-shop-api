import { Request, Response, NextFunction } from "express";
import dashboardService from "../services/dashboard.service";
export class DashboardController {
  public getDashboardOverview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { totalOrder, totalPendingOrder } =
        await dashboardService.getOrderCount();
      const { totalIncome, currentMonthIncome } =
        await dashboardService.getIncome();
      const { totalUser } = await dashboardService.getUserCount();

      res.status(200).json({
        status: "success",
        data: {
          totalOrder,
          totalPendingOrder,
          totalIncome,
          currentMonthIncome,
          totalUser,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getRecentOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const recentOrders = await dashboardService.getRecentOrders();
      res.status(200).json({
        orders: recentOrders.orders,
      });
    } catch (error) {
      next(error);
    }
  };

  getDashboardStatistics = async (req: Request, res: Response) => {
    try {
      const data = await dashboardService.getDashboardStatistics();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
}

export default new DashboardController();
