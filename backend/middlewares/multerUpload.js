import multer from "multer";

// Tell Multer to keep files in memory temporary buffers
const storage = multer.memoryStorage();

// Make sure users only upload regular images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images (.jpg, .png, etc.) are allowed!"), false);
  }
};

export const uploadSingleImage = multer({ storage, fileFilter });
