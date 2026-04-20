import ProductModel from "../models/product.model.js";
import { uploadFile } from "../services/storange.service.js";
export const createProduct = async (req, res) => {
  //     try {
  //         const {title,description,priceAmount,priceCurrency}=req.body;
  //         const seller=req.user;

  //             const images=await Promise.all(req.files.map(async(file)=>{
  //                 const response=await uploadFile({
  //                     buffer:file.buffer,
  //                     filename:file.originalname
  //                 })
  //                 return response.Location;
  //             }))

  //         const product=await ProductModel.create({
  //             title,
  //             description,
  //             price:{
  //                 amount:priceAmount,
  //                 currency:priceCurrency || 'INR'
  //             },
  //             images,
  //             seller:seller._id
  //         })

  //         res.status(201).json({
  //             success:true,
  //             message:'Product created successfully',
  //             product
  //         })
  //     }
  //     catch (error) {
  //         console.error('Error creating product:', error);
  //         res.status(500).json({
  //             success:false,
  //             message:'Server error'
  //         })
  //     }
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(
      req.files.map(async (file) => {
        const response = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return response;
      }),
    );

    const product = await ProductModel.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      images,
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
