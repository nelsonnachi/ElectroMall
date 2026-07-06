import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  orderStatus: { type: String, default: "Processing" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentInfo: {
    id: { type: String },
    status: { type: String, default: "Pending" },
  },
  paidAt: { type: Date },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
