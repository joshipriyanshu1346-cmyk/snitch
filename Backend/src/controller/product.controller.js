import ProductModel from "../models/product.model.js";
import { uploadImage } from "../services/storange.service.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;
    const amount = Number(req.body.priceAmount);

    console.log("Converted amount:", amount);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priceAmount",
      });
    }
    

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Upload all images
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer)),
    );

    const imageUrls = uploadedImages.map((img) => ({
      url: img.secure_url,
    }));

    // Create product with uploaded images
    const product = await ProductModel.create({
      title,
      description,
      price: {
        amount: amount,
        currency: priceCurrency || "INR",
      },
      images: imageUrls,
      seller: seller._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getProducts = async (req, res) => {
  const seller = req.user;
  try {
    const products = await ProductModel.find({ seller: seller._id });
    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
