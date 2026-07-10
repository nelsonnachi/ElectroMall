import axios from "axios";
import Order from "../models/orderModel.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// Verify payment and update order
export const verifyPayment = async (req, res) => {
  const { reference, orderId } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } },
    );

    const { status, id } = response.data.data;

    if (status === "success") {
      const order = await Order.findById(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      order.paymentInfo = {
        id,
        status: "success",
        reference,
      };
      order.paidAt = new Date();

      await order.save();
 
      return res.json({ success: true, message: "Payment verified", order });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment not successful" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
