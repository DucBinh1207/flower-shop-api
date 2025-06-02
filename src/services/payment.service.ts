import { HttpException } from "../middlewares/error.middleware";
const moment = require("moment");
const CryptoJS = require("crypto-js");
const axios = require("axios").default;

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

type orderType = {
  app_id: string;
  app_trans_id: string;
  app_user: string;
  app_time: number;
  item: string;
  embed_data: string;
  amount: number;
  description: string;
  bank_code: string;
  callback_url: string;
  mac?: string;
};

export class PaymentService {
  public async payment(orderId: string, total: number): Promise<void> {
    try {
      // Kiểm tra xem orderId và amount có tồn tại hay không
      if (!orderId) {
        throw new HttpException(400, "orderId is required");
      }

      const embed_data = {
        redirecturl: `google.com`,
        orderId: orderId,
      };

      const items = [{}];
      const transID = Math.floor(Math.random() * 1000000);
      const transID_new = `${moment().format("YYMMDD")}_${transID}`;
      const order: orderType = {
        app_id: config.app_id,
        app_trans_id: transID_new, // ID giao dịch duy nhất dựa trên thời gian và transID ngẫu nhiên
        app_user: "user123",
        app_time: Date.now(), // thời gian tạo đơn hàng
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),

        amount: total, // Số tiền được nhận từ yêu cầu
        description: `Pet Shop - Payment for order #${orderId}`, // Mô tả đơn hàng với orderId
        bank_code: "",
        callback_url:
          "https://flower-shop-api-3v1s.onrender.com/api/v1/orders/callback",
      };

      const data =
        config.app_id +
        "|" +
        order.app_trans_id +
        "|" +
        order.app_user +
        "|" +
        order.amount +
        "|" +
        order.app_time +
        "|" +
        order.embed_data +
        "|" +
        order.item;
      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      try {
        const result = await axios.post(config.endpoint, null, {
          params: order,
        });

        return result.data.order_url;
      } catch (error) {
        console.log(error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default new PaymentService();
