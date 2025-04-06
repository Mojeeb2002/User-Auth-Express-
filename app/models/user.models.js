import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow alphanumeric usernames with underscores and dashes, 3-30 characters
          return /^[a-zA-Z0-9_-]{3,30}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid username!`,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{4}$/,
        "Please fill a valid phone number wth country code",
      ],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
};

const User = mongoose.model("User", userSchema);

export default User;
