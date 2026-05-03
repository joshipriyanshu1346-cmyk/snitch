import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    const user = req.user;

    let cart = await CartModel.findOne({ user: user._id }).populate({
      path: 'items.product',
      select: 'title description images price seller'
    });

    if (!cart) {
      cart = await CartModel.create({
        user: user._id,
        items: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID or quantity"
      });
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.price || typeof product.price.amount !== 'number') {
      return res.status(400).json({
        success: false,
        message: "Product price information is missing or invalid"
      });
    }

    let cart = await CartModel.findOne({ user: user._id });

    if (!cart) {
      cart = await CartModel.create({
        user: user._id,
        items: [{
          product: productId,
          quantity,
          price: product.price.amount,
          currency: product.price.currency
        }]
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(item =>
        item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
        // Update price to current product price
        existingItem.price = product.price.amount;
        existingItem.currency = product.price.currency;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price.amount,
          currency: product.price.currency
        });
      }
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'title description images price seller'
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    let cart = await CartModel.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(item =>
      item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'title description images price seller'
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }

    let cart = await CartModel.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const cartItem = cart.items.find(item =>
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    // Optional: Sync with current product price when updating quantity
    const product = await ProductModel.findById(productId);
    if (product && product.price) {
      cartItem.price = product.price.amount;
      cartItem.currency = product.price.currency || 'INR';
    }

    cartItem.quantity = Number(quantity);
    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'title description images price seller'
    });

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = req.user;

    let cart = await CartModel.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
