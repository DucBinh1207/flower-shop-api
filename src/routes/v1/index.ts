import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import productRoutes from "./product.route";
import categoryRoutes from "./category.route";
import blogPostRoutes from "./blog-post.route";
import commentRoutes from "./comment.route";
import orderRoutes from "./order.route";
import variantRoutes from "./variant.route";
import supplierRoutes from "./supplier.route";
import dashboardRoutes from "./dashboard.route";
import docsRoutes from "./docs.route";

const router = Router();

/**
 * API Routes
 */
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/blog-posts", blogPostRoutes);
router.use("/comments", commentRoutes);
router.use("/orders", orderRoutes);
router.use("/variants", variantRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/docs", docsRoutes);

/**
 * Health check route
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

export default router;
