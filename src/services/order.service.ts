import { Types } from "mongoose";
import Order from "../models/order.model";
import OrderItem from "../models/order-item.model";
import Product from "../models/product.model";
import {
  IOrder,
  OrderDocument,
  OrderStatus,
  PaymentStatus,
} from "../interfaces/models/order.interface";
import { OrderItemDocument } from "../interfaces/models/order-item.interface";
import { ProductDocument } from "../interfaces/models/product.interface";
import { HttpException } from "../middlewares/error.middleware";

export class OrderService {
  public async createOrder(payload: IOrder): Promise<OrderDocument> {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status,
      paymentMethod,
      paymentStatus,
      subtotal,
      shippingFee,
      discount,
      total,
      notes,
      orderId,
      items,
    } = payload;

    if (!items.length) {
      throw new HttpException(400, "Order must have at least one item");
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new HttpException(
          404,
          `Product with ID ${item.productId} not found`
        );
      }

      const productObj = product.toObject<ProductDocument>();
      if (productObj.stock !== undefined && productObj.stock < item.quantity) {
        throw new HttpException(
          400,
          `Not enough stock for product: ${productObj.name}`
        );
      }
    }

    const order = await Order.create({
      userId: userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      status,
      paymentMethod,
      paymentStatus,
      subtotal,
      shippingFee,
      discount,
      total,
      notes,
      orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items,
    });

    const orderObj = order.toObject<OrderDocument>();

    await Promise.all(
      items.map((item) => {
        return OrderItem.create({
          orderId: orderObj.orderId,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        });
      })
    );

    await Promise.all(
      items.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    return orderObj;
  }

  public async getOrderById(
    orderId: string | Types.ObjectId | number
  ): Promise<{
    order: OrderDocument;
    items: OrderItemDocument[];
  }> {
    // Find by id or _id based on type

    const order =
      typeof orderId === "string"
        ? await Order.findOne({ orderId: orderId })
        : await Order.findById(orderId);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    const orderObj = order.toObject<OrderDocument>();
    const items = await OrderItem.find({ orderId: orderObj.id });
    return {
      order: orderObj,
      items: items.map((item) => item.toObject<OrderItemDocument>()),
    };
  }

  public async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orders: OrderDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      Order.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Order.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      orders: orders.map((order) => order.toObject<OrderDocument>()),
      totalCount,
      totalPages,
    };
  }

  public async getAllOrders(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus
  ): Promise<{
    orders: OrderDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      Order.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      orders: orders.map((order) => order.toObject<OrderDocument>()),
      totalCount,
      totalPages,
    };
  }

  public async updateOrderStatus(
    orderId: string | Types.ObjectId | number,
    status: OrderStatus
  ): Promise<OrderDocument> {
    // Find by id or _id based on type
    const order =
      typeof orderId === "string"
        ? await Order.findOne({ orderId: orderId })
        : await Order.findById(orderId);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    const orderObj = order.toObject<OrderDocument>();

    // Handle cancellation logic
    if (status === "cancelled" && orderObj.status !== "cancelled") {
      // Restore product stock
      const orderItems = await OrderItem.find({ orderId: orderObj.id });

      await Promise.all(
        orderItems.map(async (item) => {
          const itemObj = item.toObject<OrderItemDocument>();
          await Product.findOneAndUpdate(
            { id: itemObj.productId },
            { $inc: { stock: itemObj.quantity } }
          );
        })
      );
    }

    // Update by numeric id if orderId is a number
    const updatedOrder =
      typeof orderId === "string"
        ? await Order.findOneAndUpdate(
            { orderId: orderId },
            {
              status,
              updatedAt: new Date().toISOString(),
            },
            { new: true }
          )
        : await Order.findByIdAndUpdate(
            orderId,
            {
              status,
              updatedAt: new Date().toISOString(),
            },
            { new: true }
          );

    if (!updatedOrder) {
      throw new HttpException(404, "Order not found");
    }

    return updatedOrder.toObject<OrderDocument>();
  }

  public async deleteOrder(
    orderId: string | Types.ObjectId | number
  ): Promise<void> {
    // Find by id or _id based on type
    const order =
      typeof orderId === "number"
        ? await Order.findOne({ id: orderId })
        : await Order.findById(orderId);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    const orderObj = order.toObject<OrderDocument>();

    // Restore product stock if order is not cancelled
    if (orderObj.status !== "cancelled") {
      const orderItems = await OrderItem.find({ orderId: orderObj.id });

      await Promise.all(
        orderItems.map(async (item) => {
          const itemObj = item.toObject<OrderItemDocument>();
          await Product.findOneAndUpdate(
            { id: itemObj.productId },
            { $inc: { stock: itemObj.quantity } }
          );
        })
      );
    }

    // Delete order items
    await OrderItem.deleteMany({ orderId: orderObj.id });

    // Delete order by numeric id if orderId is a number
    typeof orderId === "number"
      ? await Order.findOneAndDelete({ id: orderId })
      : await Order.findByIdAndDelete(orderId);
  }

  public async updatePaymentStatus(
    orderId: string | Types.ObjectId | number,
    paymentStatus: PaymentStatus
  ): Promise<OrderDocument> {
    // Find by id or _id based on type
    const order =
      typeof orderId === "string"
        ? await Order.findOne({ orderId: orderId })
        : await Order.findById(orderId);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    // Update by numeric id if orderId is a number
    const updatedOrder =
      typeof orderId === "string"
        ? await Order.findOneAndUpdate(
            { orderId: orderId },
            {
              paymentStatus,
              updatedAt: new Date().toISOString(),
            },
            { new: true }
          )
        : await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus,
              updatedAt: new Date().toISOString(),
            },
            { new: true }
          );

    if (!updatedOrder) {
      throw new HttpException(404, "Order not found");
    }

    return updatedOrder.toObject<OrderDocument>();
  }
}

export default new OrderService();
