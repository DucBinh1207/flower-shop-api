import Joi from "joi";

export const createUserSchema = Joi.object({
  password: Joi.string().required().min(6),
  name: Joi.string().allow("", null),
  email: Joi.string().email().allow("", null),
  phone: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  avatar: Joi.string().allow("", null),
  role: Joi.string().valid("admin", "customer").default("customer"),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().allow("", null),
  email: Joi.string().email().allow("", null),
  phone: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
  avatar: Joi.string().allow("", null),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive").required(),
});
