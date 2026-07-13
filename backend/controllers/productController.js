import Product from "../models/productModel.js";
import buildProductQuery from "../utils/buildProductQuery.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Create a new product
export const createProduct = async (req, res) => {
  try {
    // Attach the authenticated user's ID to track ownership
    const userId = req.user.id;

    // Pull out only the specific text fields needed from req.body
    const { name, price, description, category, brand, stock } = req.body;

    // Array to store Cloudinary credentials for the product images
    let uploadedImages = [];

    // Handle multiple file uploads if sent from the frontend
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Convert raw file format from memory buffer to base64
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        // Upload image safely to Cloudinary
        const imageDetails = await cloudinary.uploader.upload(base64Image, {
          folder: "products", // Saves images in a dedicated product folder
        });

        // Push credentials using your exact model schema keys (public_id, url)
        uploadedImages.push({
          public_id: imageDetails.public_id,
          url: imageDetails.secure_url,
        });
      }
    }

    // Pass those fields directly into the creation method
    const product = await Product.create({
      name,
      price: Number(price) || 0,
      description,
      category,
      brand,
      stock: Number(stock) || 0,
      image: uploadedImages, // Maps directly to your schema array
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/products
export const getAllProducts = async (req, res) => {
  try {
    const resultsPerPage = Number(req.query.limit) || 12;
    const productQuery = new buildProductQuery(Product.find(), req.query)
      .search()
      .filter()
      .sort();

    const filteredQuery = productQuery.query.clone();
    const productCount = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(productCount / resultsPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
      return res
        .status(400)
        .json({ success: false, message: "This page doesn't exist" });
    }

    productQuery.pagination(resultsPerPage);
    const products = await productQuery.query;

    res.status(200).json({
      success: true,
      products,
      productCount,
      resultsPerPage,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { name, price, description, category, brand, stock } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (brand) product.brand = brand;
    if (category) product.category = category;

    // Explicitly validate and parse numeric properties if provided
    if (price !== undefined) product.price = Number(price) || 0;
    if (stock !== undefined) product.stock = Number(stock) || 0;

    if (req.files && req.files.length > 0) {
      if (product.image && product.image.length > 0) {
        for (const img of product.image) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }

      let updatedImages = [];

      for (const file of req.files) {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const imageDetails = await cloudinary.uploader.upload(base64Image, {
          folder: "products",
        });

        updatedImages.push({
          public_id: imageDetails.public_id,
          url: imageDetails.secure_url,
        });
      }

      product.image = updatedImages;
    } else if (req.body.remainingImages) {
      const remaining = JSON.parse(req.body.remainingImages);

      for (const oldImg of product.image) {
        const stillExists = remaining.some(
          (r) => r.public_id === oldImg.public_id,
        );

        if (!stillExists && oldImg.public_id) {
          await cloudinary.uploader.destroy(oldImg.public_id);
        }
      }

      product.image = remaining;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Backend Product Update Failure Log Details:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: error.message,
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.image && product.image.length > 0) {
      const deletePromises = product.image
        .filter((img) => img.public_id) 
        .map((img) => cloudinary.uploader.destroy(img.public_id));

      // Execute all Cloudinary deletions at the same time
      await Promise.all(deletePromises);
    }

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single product
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------

// Admin --- Getting all products
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------Review

export const createReviewForProduct = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    // 1. Structure the incoming review data
    const review = {
      user: req.user._id, // Sourced from your verifyUserAuthentication middleware
      name: req.user.name, // Sourced from your verifyUserAuthentication middleware
      rating: Number(rating),
      comment,
    };

    // 2. Find the product receiving the review
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 3. Check if this specific user has already reviewed this product
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString(),
    );

    if (isReviewed) {
      // Scenario A: User already reviewed it -> Update existing review
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.comment = comment;
          rev.rating = Number(rating);
        }
      });
    } else {
      // Scenario B: First time reviewing -> Push new review to array
      product.reviews.push(review);
    }

    // 4. Perform Arithmetic: Recalculate total reviews count
    product.numOfReviews = product.reviews.length;

    // 5. Perform Arithmetic: Recalculate average star rating
    const totalRatingSum = product.reviews.reduce(
      (acc, item) => item.rating + acc,
      0,
    );
    product.ratings = totalRatingSum / product.reviews.length;

    // 6. Save changes safely to the database
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isReviewed
        ? "Review updated successfully"
        : "Review added successfully",
      ratings: product.ratings,
      numOfReviews: product.numOfReviews,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString(),
    );

    let sum = 0;
    reviews.forEach((item) => {
      sum += item.rating;
    });

    const ratings = reviews.length === 0 ? 0 : sum / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
