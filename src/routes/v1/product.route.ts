import { Router } from "express";
import productController from "../../controllers/product.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = Router();

/**
 * @route POST /api/v1/products
 * @desc Create a new product
 * @access Private (Admin)
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  productController.createProduct
);

/**
 * @route GET /api/v1/products
 * @desc Get all products with filters
 * @access Public
 */
router.get("/", productController.getAllProducts);

/**
 * @route GET /api/v1/products/slug/:slug
 * @desc Get product by slug
 * @access Public
 */
router.get("/slug/:slug", productController.getProductBySlug);

/**
 * @route POST /api/v1/products/image
 * @desc Get product by image
 * @access Public
 */
router.post(
  "/image",
  upload.single("file"),
  productController.getProductByImage
);

/**
 * @route GET /api/v1/products/:id/variants
 * @desc Get product with its variants
 * @access Public
 */
router.get("/:id/variants", productController.getProductWithVariants);

/**
 * @route GET /api/v1/products/:id
 * @desc Get product by ID
 * @access Public
 */
router.get("/:id", productController.getProductById);

/**
 * @route PUT /api/v1/products/:id
 * @desc Update product
 * @access Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  productController.updateProduct
);

/**
 * @route DELETE /api/v1/products/:id
 * @desc Delete product
 * @access Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  productController.deleteProduct
);

export default router;
