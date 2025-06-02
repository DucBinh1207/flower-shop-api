import { Router } from "express";
import userController from "../../controllers/user.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @route GET /api/v1/users
 * @desc Get all users
 * @access Private (Admin)
 */
router.get("/", authenticate, authorize("admin"), userController.getAllUsers);

/**
 * @route GET /api/v1/users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get("/:id", authenticate, userController.getUserById);

/**
 * @route PUT /api/v1/users/:id
 * @desc Update user
 * @access Private
 */
router.put("/:id", authenticate, userController.updateUser);

/**
 * @route PUT /api/v1/users/:id/password
 * @desc Update user password
 * @access Private
 */
router.put("/:id/password", authenticate, userController.updatePassword);

/**
 * @route DELETE /api/v1/users/:id
 * @desc Delete user
 * @access Private (Admin or self)
 */
router.delete("/:id", authenticate, userController.deleteUser);

/**
 * @route PUT /api/v1/users/:id/status
 * @desc Update user status (admin only)
 * @access Private
 */
router.put("/:id/status", authenticate, userController.updateStatus);

export default router;
