import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const profile = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = userSession.id;

    // Fetch user profile from the database
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        role: user.isAdmin ? "admin" : "user",
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = userSession.id;

    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Generate verification token and expiration
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    updatedUser.email = email;
    updatedUser.isVerified = false;
    updatedUser.verificationToken = crypto.randomBytes(32).toString("hex"),
    updatedUser.verificationTokenExpires = verificationTokenExpires;

    await updatedUser.save();

    // Send verification email
    await sendEmail(
      updatedUser.email,
      updatedUser.name,
      updatedUser.verificationToken
    );

    res.status(200).json({
      message:
        "Email changed successfully. Please verify your new email. A verification email has been sent.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = userSession.id;

    const { currentPassword, newPassword } = req.body;

    // Validate new password length
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Fetch user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = userSession.id;
    const { name, username, phone } = req.body;

    // Prepare an update object with only the provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username.toLowerCase();
    if (phone) {
      const phoneRegex = /^\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{4}$/; // Example regex for 10-digit phone number
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      updateData.phone = phone;
    }


    // Check if username, phone, or email already exists in the database
    if (updateData.username || updateData.phone) {
      const existingUser = await User.findOne({
        $or: [
          { username: updateData.username },
          { phone: updateData.phone },
        ],
      });
      if (existingUser && userId !== existingUser._id.toString()) {
        return res
          .status(409)
          .json({ message: "Username already in use" });
      }
    }

    // Update user info in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated user
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User info updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: userId.email,
        username: updatedUser.username,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
