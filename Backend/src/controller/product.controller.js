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

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    // Check if product exists and belongs to the seller
    const product = await ProductModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only edit your own products",
      });
    }

    // Prepare update data
    const updateData = {
      title: title || product.title,
      description: description || product.description,
    };

    if (priceAmount) {
      const amount = Number(priceAmount);
      if (isNaN(amount)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priceAmount",
        });
      }
      updateData.price = {
        amount,
        currency: priceCurrency || product.price.currency,
      };
    }

    // Handle image upload if files are provided
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadImage(file.buffer))
      );

      updateData.images = uploadedImages.map((img) => ({
        url: img.secure_url,
      }));
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const seller = req.user;

    // Check if product exists and belongs to the seller
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own products",
      });
    }

    await ProductModel.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate('seller', 'name email')
      .limit(100);
    
    res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId).populate('seller', 'name email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
