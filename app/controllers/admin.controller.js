import User from "../models/user.models.js";
import sanitize from "mongo-sanitize";
import bcrypt from "bcrypt";


export const adminDashboard = async (req, res) => {
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
      message: "Admin dashboard fetched successfully",
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
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password from the response
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const createNewUser = async (req, res) => {
  try {
    const { name, email, username, password, phone, role } = sanitize(req.body);

    // Validate input data
    if (!name || !email || !username || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }, { phone }],
     });
    if (existingUser) {
      return res.status(409).json({ message: "Email, username or phone already in use" });
    }

    // Validate phone number format
    const phoneRegex = /^\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{4}$/; // Example regex for 10-digit phone number
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      phone,
      isAdmin: true || role === "admin",
      isVerified: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully, account need to be verified before login",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        isVerified: newUser.isVerified,
        role: newUser.isAdmin ? "admin" : "user",
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, username, phone, isVerified, isAdmin } = sanitize(req.body);

    // Prepare an update object with only the provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      updateData.email = email.toLowerCase();
    }
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (username) updateData.username = username.toLowerCase();
    if (phone) {
      const phoneRegex = /^\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{3,4}[-.\s]?\d{4}$/; // Example regex for 10-digit phone number
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      updateData.phone = phone;
    }
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    // Check if username, phone, or email already exists in the database
    if (updateData.username || updateData.phone || updateData.email) {
      const existingUser = await User.findOne({
        $or: [
          { username: updateData.username },
          { phone: updateData.phone },
          { email: updateData.email },
        ],
      });
      if (existingUser && userId !== existingUser._id.toString()) {
        return res.status(409).json({ message: "Username, phone or email already in use" });
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
        email: updatedUser.email,
        username: updatedUser.username,
        phone: updatedUser.phone,
        isVerified: updatedUser.isVerified,
        role: updatedUser.isAdmin ? "admin" : "user",
      },
    });
    
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
      userId,
    });
    
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
};
