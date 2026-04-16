import Usermodel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CONFIG from "../config/config.js";

async function sendTokenResponse(user,res,message){
    const token = jwt.sign({ id: user._id }, 
        CONFIG.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token",token)

        res.status(200).json({
            message,
            success:true,
            user:{
                id:user._id,
                email:user.email,
                contact:user.contact,
                fullname:user.fullname,
                role:user.role

            }
        })
}
export const registerUser = async (req, res) => {
   const { email, contact, password, fullname, isseller } = req.body;

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
    role: isseller ? "seller" : "buyer",
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
    await sendTokenResponse(user,res,"user loggin successfuully")
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
