import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import buildProductQuery from "../utils/buildProductQuery.js";

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

    // Create the order record
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

    // Loop through every purchased item and decrease product stock levels
    for (const item of orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -(item.quantity || 1) }, 
        });
      }
    }

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
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

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

// Get all orders (admin with date filtering & pagination)
export const getAllOrders = async (req, res) => {
  try {
    const limit = 10; // Set display limit per page

    // 1. Instance A: Calculate total matching entries BEFORE applying pagination limits
    const countQueryBuilder = new buildProductQuery(Order.find(), req.query)
      .dateFilter()
      .filter();
    const totalMatchingOrders = await countQueryBuilder.query.countDocuments();

    // 2. Instance B: Fetch chunked page items (Filters -> Sorts -> Limits -> Skips)
    const dataQueryBuilder = new buildProductQuery(Order.find(), req.query)
      .dateFilter()
      .filter()
      .sort()
      .pagination(limit);

    const orders = await dataQueryBuilder.query;
    
    // 3. Mathematical parsing logic to safely determine full available pages matrix
    const totalPages = Math.ceil(totalMatchingOrders / limit) || 1;

    // 4. Calculate dashboard revenue metrics of ONLY the current paginated view selection array
    const totalAmount = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      totalAmount: Number(totalAmount.toFixed(2)),
      count: orders.length,
      totalPages, // 👈 Dispatched safely to the client side
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

    // Convert statuses to uniform lowercase for safe comparisons
    const currentStatus = order.orderStatus?.toLowerCase();
    const newStatus = status?.toLowerCase();

    // Block any edits if the order is already in a terminal state
    if (currentStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order has already been delivered and cannot be modified.",
      });
    }

    if (currentStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is cancelled. Cancelled orders cannot be re-opened or updated.",
      });
    }

    // Return items to stock ONLY when moving to a cancelled state for the first time
    if (newStatus === "cancelled"  && currentStatus !== "cancelled") {
      for (const item of order.orderItems) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity || 1 }, 
          });
        }
      }
    }

    // Update status details on the document object
    order.orderStatus = status;

    if (newStatus === "delivered") {
      order.deliveredAt = Date.now();
    }

    // Save changes to the database
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}" successfully.`,
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

    //  Block modifications on already completed sales history
    if (order.orderStatus?.toLowerCase() === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an order that has already been delivered to the customer!",
      });
    }

    // IDEMPOTENCY CHECK: Block if the order is already cancelled to prevent double-stocking inventory
    if (order.orderStatus?.toLowerCase() === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order has already been cancelled.",
      });
    }

    // INVENTORY RESTORATION: Return the un-shipped items back to the digital shelves safely
    for (const item of order.orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity || 1 },
        });
      }
    }

    // SOFT DELETE INDUSTRY STANDARD: Update the status flag instead of wiping the document
    order.orderStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and warehouse stock restored.",
      order, 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while processing order cancellation",
      error: error.message,
    });
  }
};
