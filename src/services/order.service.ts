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
    let order: OrderDocument | null = null;

    if (typeof orderId === "string") {
      // Kiểm tra xem string có phải ObjectId hợp lệ không
      if (Types.ObjectId.isValid(orderId)) {
        order = await Order.findById(orderId);
      } else {
        // Nếu không phải ObjectId, tìm theo trường orderId (nếu bạn có trường này trong schema)
        order = await Order.findOne({ orderId: orderId });
      }
    } else if (typeof orderId === "number") {
      // Nếu orderId là số, tìm theo trường orderId
      order = await Order.findOne({ orderId: orderId });
    } else {
      // Nếu là ObjectId
      order = await Order.findById(orderId);
    }

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    const orderObj = order.toObject<OrderDocument>();

    // Tìm các item dựa trên order._id (Mongo ObjectId)
    const items = await OrderItem.find({ orderId: order._id });

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
    status?: OrderStatus,
    customerPhone?: string
  ): Promise<{
    orders: OrderDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (customerPhone) {
      query.customerPhone = { $regex: customerPhone, $options: "i" }; // hỗ trợ tìm gần đúng, không phân biệt hoa thường
    }

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
    orderId: string | Types.ObjectId,
    status: OrderStatus
  ): Promise<OrderDocument> {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    const orderObj = order.toObject<OrderDocument>();

    // Nếu đơn hàng bị huỷ, khôi phục tồn kho
    if (status === "cancelled" && orderObj.status !== "cancelled") {
      const orderItems = await OrderItem.find({ orderId: orderObj._id });

      await Promise.all(
        orderItems.map(async (item) => {
          const itemObj = item.toObject<OrderItemDocument>();
          await Product.findByIdAndUpdate(itemObj.productId, {
            $inc: { stock: itemObj.quantity },
          });
        })
      );
    }

    // Chuẩn bị object cập nhật
    const updateFields: Partial<OrderDocument> = { status };

    const isBankTransferAndPaid =
      orderObj.paymentMethod === "bank_transfer" &&
      orderObj.paymentStatus === "paid";

    // Nếu không phải thanh toán chuyển khoản đã thanh toán thì mới cập nhật paymentStatus
    if (!isBankTransferAndPaid) {
      switch (status) {
        case "delivered":
          updateFields.paymentStatus = "paid";
          break;
        case "cancelled":
          updateFields.paymentStatus = "failed";
          break;
        default:
          updateFields.paymentStatus = "pending";
      }
    }

    // Cập nhật đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, {
      new: true,
    });

    if (!updatedOrder) {
      throw new HttpException(500, "Failed to update order");
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
