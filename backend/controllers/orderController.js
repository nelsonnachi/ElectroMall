import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// Create a new order (user)
export const createOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo: {
        ...paymentInfo,
        status: paymentInfo?.status || "Pending",
      },
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
  }
};

// Get single order details (user)
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching order",
      error: error.message,
    });
  }
};

// All my orders
export const allMyOrders = async (req, res) => {
  try {
    // Fetches orders for the user and sorts them by newest first
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Handle case where user has no orders yet
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You have no orders yet",
        count: 0,
        orders: [],
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching your orders",
      error: error.message,
    });
  }
};


// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    // Fetch ALL orders from the database
    // Sorts by newest first (-1) to show recent orders at the top of the list
    const orders = await Order.find().sort({ createdAt: -1 });

    // Calculate total revenue of the entire store
    const totalAmount = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0,
    );

    // 3. Send data and sales calculations back to the Admin Dashboard
    res.status(200).json({
      success: true,
      totalAmount: Number(totalAmount.toFixed(2)), // Keeps decimals clean (e.g., 1450.50)
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching all orders",
      error: error.message,
    });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch the order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }

    // Prevent modifications if already delivered
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order is already delivered",
      });
    }

    // Loop and update product inventory directly in the DB
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Update order status details
    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    // Save order changes
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating order status",
      error: error.message,
    });
  }
};

// Delete order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "This order is under processing!",
      });
    }

    // Loop through the order items and return them to stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // Now it is safe to delete the order record
    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted and stock restored successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting order",
      error: error.message,
    });
  }
};
