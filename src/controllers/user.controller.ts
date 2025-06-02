import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { validate } from "../middlewares/validation.middleware";
import {
  updateUserSchema,
  updatePasswordSchema,
  updateUserStatusSchema,
} from "../validations/user.validation";
import { HttpException } from "../middlewares/error.middleware";

export class UserController {
  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;
      const search = req.query.search as string;

      const result = await userService.getAllUsers(page, limit, role, search);

      res.status(200).json({
        status: "success",
        data: {
          data: result.users,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;

      const user = await userService.getUserById(userId);

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = [
    validate(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = req.params.id;

        // Check if user is updating their own profile or is an admin
        if (req.user?._id.toString() !== userId && req.user?.role !== "admin") {
          throw new HttpException(
            403,
            "You do not have permission to update this user"
          );
        }

        const updatedUser = await userService.updateUser(userId, req.body);

        res.status(200).json({
          status: "success",
          data: {
            user: updatedUser,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public updatePassword = [
    validate(updatePasswordSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = req.params.id;

        // Check if user is updating their own password
        if (req.user?._id.toString() !== userId) {
          throw new HttpException(403, "You can only update your own password");
        }

        const { currentPassword, newPassword } = req.body;

        await userService.updatePassword(userId, currentPassword, newPassword);

        res.status(200).json({
          status: "success",
          message: "Password updated successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;

      // Only admins can delete users
      if (req.user?.role !== "admin" && req.user?._id.toString() !== userId) {
        throw new HttpException(
          403,
          "You do not have permission to delete this user"
        );
      }

      await userService.deleteUser(userId);

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = [
    validate(updateUserStatusSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = req.params.id;

        // Chỉ cho phép admin cập nhật status
        if (req.user?.role !== "admin") {
          throw new HttpException(403, "Only admin can update user status");
        }

        const { status } = req.body;

        await userService.updateStatus(userId, status);

        res.status(200).json({
          status: "success",
          message: "User status updated successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ];
}

export default new UserController();
