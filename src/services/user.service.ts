import { Types } from "mongoose";
import User from "../models/user.model";
import { IUser, UserDocument } from "../interfaces/models/user.interface";
import { HttpException } from "../middlewares/error.middleware";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { generateAuthTokens } from "../utils/jwt.utils";

export class UserService {
  public async createUser(userData: IUser): Promise<{
    user: UserDocument;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new HttpException(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
      avatar: "https://www.svgrepo.com/show/452030/avatar-default.svg",
    });

    // Use a safer way to convert toObject without TS errors
    const userDoc = newUser.toObject<UserDocument>();
    const tokens = generateAuthTokens(userDoc.id.toString(), userDoc.role);

    return { user: userDoc, tokens };
  }

  public async login(
    email: string,
    password: string
  ): Promise<{
    user: UserDocument;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new HttpException(401, "Invalid credentials");
    }

    // Use a safer way to convert toObject without TS errors
    const userDoc = user.toObject<UserDocument>();
    const isPasswordValid = await comparePassword(password, userDoc.password);

    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid credentials");
    }

    const tokens = generateAuthTokens(userDoc.id.toString(), userDoc.role);

    return { user: userDoc, tokens };
  }

  public async getUserById(
    userId: string | Types.ObjectId | number
  ): Promise<UserDocument> {
    // Find user by id or _id based on type
    const user =
      typeof userId === "number"
        ? await User.findOne({ id: userId })
        : await User.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return user.toObject<UserDocument>();
  }

  public async getAllUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
    search?: string
  ): Promise<{
    users: UserDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query.$or = [{ name: regex }, { email: regex }];
    }

    const [users, totalCount] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users: users.map((user) => user.toObject<UserDocument>()),
      totalCount,
      totalPages,
    };
  }

  public async updateUser(
    userId: string | Types.ObjectId | number,
    userData: Partial<IUser>
  ): Promise<UserDocument> {
    // Find user by id or _id based on type
    const user =
      typeof userId === "number"
        ? await User.findOne({ id: userId })
        : await User.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    // Remove password from userData to prevent unauthorized password updates
    if (userData.password) {
      delete userData.password;
    }

    // Update by numeric id if userId is a number
    const updatedUser =
      typeof userId === "number"
        ? await User.findOneAndUpdate({ id: userId }, userData, { new: true })
        : await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return updatedUser.toObject<UserDocument>();
  }

  public async updatePassword(
    userId: string | Types.ObjectId | number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Find user by id or _id based on type
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const userDoc = user.toObject<UserDocument>();
    const isPasswordValid = await comparePassword(
      currentPassword,
      userDoc.password
    );

    if (!isPasswordValid) {
      throw new HttpException(401, "Current password is incorrect");
    }

    const hashedPassword = await hashPassword(newPassword);

    // Update by numeric id if userId is a number
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  public async deleteUser(
    userId: string | Types.ObjectId | number
  ): Promise<void> {
    // Delete by numeric id if userId is a number
    const result =
      typeof userId === "number"
        ? await User.findOneAndDelete({ id: userId })
        : await User.findByIdAndDelete(userId);

    if (!result) {
      throw new HttpException(404, "User not found");
    }
  }

  public async updateStatus(
    userId: string | Types.ObjectId | number,
    status: "active" | "inactive"
  ): Promise<void> {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    await User.findByIdAndUpdate(userId, { status });
  }
}

export default new UserService();
