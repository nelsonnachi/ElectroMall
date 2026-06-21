import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const verifyUserAuthentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Authentication is required. Please login to continue." });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
 
    if (!decodedData) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Go to MongoDB and fetch the real user document matching that ID
    // req.user = await userModel.findById(decodedData.id);
    const user = await userModel.findById(decodedData.id).select('-password');

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Please register." });
    }

    req.user = user; // Attach the user document to the request object for downstream use

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Authentication error: " + error.message });
  }
};


// Middleware for role-based access control: what it does is that if the current person's role is not anywhere inside the allowed list, kick them out. if the allowed list included [admin, user] and the person trying to get access is guest/realtor then show errro message or if the allowed list included [admin, user] and the person trying to get access is admin or user then allow them to access the route. This is a very powerful middleware that can be used to restrict access to certain routes based on the user's role. For example, you can use this middleware to restrict access to admin routes to only users with the admin role, or you can use it to restrict access to certain features of your application to only users with specific roles.

// This code prevent unauthorised access from the list off allowed access from accessing the routes
export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `You are not allowed to access this resource`,
      });
    }
    next();
  };
};
