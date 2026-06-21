import Product from "../models/productModel.js";
import buildProductQuery from "../utils/buildProductQuery.js";

// @desc    Create a new product
export const createProduct = async (req, res) => {
  try {
    // Take the authenticated user's id and attach it as the creator of this product
    // (Explaination: req.user.id simply means the mongodb id of the user document that is currently logged in and making this request. This is possible because the verifyUserAuthentication middleware fetches the user document from the database and attaches it to the req object as req.user. So when we do req.user.id, we are accessing the id field of that user document, which is the unique identifier for that user in MongoDB. By assigning this value to req.body.user, we are essentially linking the product being created to the user who created it, allowing us to track ownership and perform authorization checks later on if needed.)
    req.body.user = req.user.id;

    // pull out only the specific fields you need from your body or frontend request
    const { name, price, description, category, brand, stock, image, user } =
      req.body;

    // Pass those exact fields directly into the creation method
    const product = await Product.create({
      name,
      price,
      description,
      category,
      brand,
      stock,
      image,
      user,
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
    const resultsPerPage = Number(req.query.limit) || 2;
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

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
export const deleteProduct = async (req, res) => {
  try {
    // 1. Extract the id variable cleanly
    const { id } = req.params;

    // 2. Look up and delete in a single step
    const product = await Product.findByIdAndDelete(id);

    // 3. If product is null, it means it didn't exist in the database
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 4. Return success response
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
