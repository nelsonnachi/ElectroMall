import mongoose from 'mongoose';
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [25, "Your name cannot exceed 30 characters"],
        minLength: [4, "Your name must be at least 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"],    
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Your password must be at least 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);
