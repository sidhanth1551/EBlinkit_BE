import asyncHandler from "express-async-handler";
import Product from "../modals/productModal.js";
import Order from "../modals/orderModal.js";
import jwt from "jsonwebtoken";
import { instance } from "../index.js";
import crypto from "crypto";

export const addProduct = asyncHandler(async (req, res) => {
  console.log("adding product..");

  const { productname } = req.body;

  const existingProduct = await Product.findOne({ productname });

  if (existingProduct) {
    res.status(400);
    throw new Error("Product with the same name already exists");
  }

  const product = new Product(req.body);
  const response = await product.save();

  res.status(201).json({ message: "Product added", product: response });
});

export const removeProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id; // Assuming you pass the product ID in the route
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.remove();

  res.json({ message: "Product removed" });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id; // Assuming you pass the product ID in the route
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const {
    productname,
    category,
    subcategory,
    instock,
    images,
    ingredients,
    units,
    description,
    manufacturedetails,
    returnpolicy,
  } = req.body;

  product.productname = productname;
  product.category = category;
  product.subcategory = subcategory;
  product.instock = instock;
  product.images = images;
  product.ingredients = ingredients;
  product.units = units;
  product.description = description;
  product.manufacturedetails = manufacturedetails;
  product.returnpolicy = returnpolicy;

  const updatedProduct = await product.save();

  res.json({ message: "Product updated", product: updatedProduct });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params; // Assuming you pass the category in the route

  const products = await Product.find({ category });
  console.log("yoo", products);

  res.json({ message: `Products in category ${category}`, products });
});

export const getProductsBySubcategory = asyncHandler(async (req, res) => {
  const { subcategory } = req.params; // Assuming you pass the subcategory in the route

  const products = await Product.find({ subcategory });

  res.json({ message: `Products in subcategory ${subcategory}`, products });
});

export const getProductsByProductName = asyncHandler(async (req, res) => {
  const { productName } = req.params; // Assuming you pass the product name in the route

  const products = await Product.find({ productname: productName });

  res.json({ message: `Products with name ${productName}`, products });
});

export const checkout = async (req, res) => {
  const { amount } = req.body;
  console.log("amount", amount);
  const amountSplit = amount.split(".");
  var options = {
    amount: Number(amountSplit[1] * 100), // amount in the smallest currency unit
    currency: "INR",
  };

  try {
    const orderId = await instance.orders.create(options);
    console.log(orderId);
    //sendResponse(res, 200, true, "order created", orderId);
    res
      .status(201)
      .json({ message: `OrderId created successfully`, orderId: orderId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: `OrderId creation error ${error}` });
  }
};

export const placeOrder = asyncHandler(async (req, res) => {
  const { productId, userId, amountPaid, addressId } = req.params;

  const orderToPlace = new Order({
    productId: productId,
    userId: userId,
    addressId: addressId,
    amountPaid: amountPaid,
  });
  console.log("body", req.body);
  console.log("params", req.params);
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return sendResponse(res, 400, false, "Missing required fields");
    }

    // Generate the expected signature
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "FonPOjOaMXbRZKyBbsV1qoD8")
      .update(body)
      .digest("hex");

    // Compare the provided signature with the expected one
    if (expectedSignature === razorpay_signature) {
      //DB entry is pending

      const savedOrder = await orderToPlace.save();
      console.log(savedOrder);
      res.redirect(`http://localhost:5173/`);
    } else {
      return sendResponse(res, 400, false, "Payment verification failed");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error placing order", details: error.message });
  }
});

// export const getProductsByBrand = asyncHandler(async (req, res) => {
//   const { name } = req.params;
//   console.log("brandname", name, req.param);
//   if (!name) {
//     throw new Error("Please provide brand name");
//   }

//   console.log(name);

//   // const query = {
//   //   $or: [
//   //     { category: categoryOrSubcategory },
//   //     { subcategory: categoryOrSubcategory },
//   //   ],
//   // };

//   const products = await Product.find({ brand: name });
//   console.log("brandProducts", products);
//   return JSON.stringify({
//     message: `Products in category or subcategory ${products}`,
//     products,
//   });
// });

export const getProductsByBrand = asyncHandler(async (req, res) => {
  const { name } = req.params;
  console.log("name", name);
  if (!name) {
    res.status(400).json({ error: "Please provide brand name" });
    return;
  }

  try {
    const products = await Product.find({ brand: name });
    console.log(products);
    if (products.length === 0) {
      res
        .status(404)
        .json({ message: "No products found for the given brand" });
      return;
    }

    res.json({ message: `Products for brand ${name}`, products });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching products by brand",
      details: error.message,
    });
  }
});
