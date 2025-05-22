import { Router } from "express";
import dashboardController from "../../controllers/dashboard.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @route GET /api/v1/orders
 * @desc Get all orders (admin only)
 * @access Private (Admin)
 */
router.get(
  "/overview",
  authenticate,
  authorize("admin"),
  dashboardController.getDashboardOverview
);

router.get(
  "/recent-orders",
  authenticate,
  authorize("admin"),
  dashboardController.getRecentOrders
);

router.get(
  "/statistics",
  authenticate,
  authorize("admin"),
  dashboardController.getDashboardStatistics
);

export default router;
