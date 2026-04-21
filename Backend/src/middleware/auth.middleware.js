import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";
import Usermodel from "../models/user.model.js";

export const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);

    const user = await Usermodel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "id not found" });
    }

    if (user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "given some error" });
  }
};

export const Authsellermiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);

    const user = await Usermodel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "id not found" });
    }
    if (user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }
 
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "given some error" });
  }
}
