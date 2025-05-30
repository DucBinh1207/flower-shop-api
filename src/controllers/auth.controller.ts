import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { validate } from "../middlewares/validation.middleware";
import {
  loginSchema,
  createUserSchema,
  updateUserSchema,
  updatePasswordSchema,
} from "../validations/user.validation";

export class AuthController {
  public register = [
    validate(createUserSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { user, tokens } = await userService.createUser(req.body);

        res.status(201).json({
          status: "success",
          data: {
            user,
            tokens,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public login = [
    validate(loginSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { email, password } = req.body;

        const { user, tokens } = await userService.login(email, password);

        res.status(200).json({
          status: "success",
          data: {
            user,
            tokens,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        status: "success",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = [
    validate(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = req.user.id;

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
        const userId = req.user.id;

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
}

export default new AuthController();
