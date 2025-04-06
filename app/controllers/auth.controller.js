import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import sanitize from "mongo-sanitize";
import crypto from "crypto";
import { sendEmail, sendPasswordResetEmail } from "../utils/sendEmail.js";
import { generateCode } from "../utils/helper.js";

export const register = async (req, res) => {
  try {
    const { name, username, email, phone, password } = sanitize(req.body);

    // Check if user already exists
    const existsUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (existsUser) {
      return res.status(409).json({
        message: "User with this username, email or phone already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // Token expires in 24 hours
    const newUser = new User({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      isVerified: false,
      verificationToken: crypto.randomBytes(32).toString("hex"),
      verificationTokenExpires,
    });

    await newUser.save();

    // Send verification email
    await sendEmail(newUser.email, newUser.name, newUser.verificationToken);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = sanitize(req.body);

    // Check if user exists
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      await sendEmail(user.email, user.name, user.verificationToken);
      return res.status(403).json({
        message:
          "Please verify your email before logging in. A new verification email has been sent.",
      });
    }

    // Create session
    req.session.regenerate((err) => {
      if (err) {
        console.error("Error during session regeneration:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      req.session.user = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.isAdmin ? "admin" : "user",
      };

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({
          message: `Logged in successfully as ${user.username}`,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.isAdmin ? "admin" : "user",
          },
        });
      });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user to verified
    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after verification
    await user.save();

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, username } = sanitize(req.body);

    // Check if user exists
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = generateCode();

    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationToken = code;
    user.verificationTokenExpires = verificationTokenExpires;

    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.username, code);

    res.status(200).json({
      message:
        "Password reset email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = sanitize(req.body);

    // Check if user exists
    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the verification token is valid and not expired
    if (
      user.verificationToken !== code ||
      user.verificationTokenExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }


    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.verificationToken = undefined; // Remove the token after reset
    user.verificationTokenExpires = undefined; // Remove the expiration date

    await user.save();

    res.status(200).json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
