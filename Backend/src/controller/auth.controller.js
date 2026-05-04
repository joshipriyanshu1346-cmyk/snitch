import Usermodel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

// async function sendTokenResponse(user, res, message) {
//   const token = jwt.sign({ id: user._id },
//     CONFIG.JWT_SECRET, { expiresIn: "1d" });

//   res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })

//   res.status(200).json({
//     message,
//     success: true,
//     user: {
//       id: user._id,
//       email: user.email,
//       contact: user.contact,
//       fullname: user.fullname,
//       role: user.role,
//       favorites: user.favorites || []

//     }
//   })
// }
async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    { id: user._id },
    CONFIG.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // ✅ REQUIRED for HTTPS (Render + Vercel)
    sameSite: "None",    // ✅ MOST IMPORTANT (cross-origin fix)
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
      favorites: user.favorites || []
    }
  });
}
export const registerUser = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const existingUser = await Usermodel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or contact already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Usermodel.create({
      email,
      contact,
      password: hashedPassword,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    await sendTokenResponse(user, res, "user loggin successfuully")
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await Usermodel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
        favorites: user.favorites || [],
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, contact } = req.body;
    const userId = req.user.id;

    const user = await Usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (contact) user.contact = contact;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
        favorites: user.favorites || [],
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await Usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.favorites.indexOf(productId);
    if (index === -1) {
      user.favorites.push(productId);
      await user.save();
      res.status(200).json({ success: true, message: "Added to favorites", favorites: user.favorites });
    } else {
      user.favorites.splice(index, 1);
      await user.save();
      res.status(200).json({ success: true, message: "Removed from favorites", favorites: user.favorites });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Usermodel.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

