import express from "express";
import {
  addProduct,
  getProductsByCategory,
  getProductsBySubcategory,
  getProductsByProductName,
  getProductsByBrand,
  placeOrder,
  checkout,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Route to add a new product
productRouter.post("/addProduct", addProduct);

// Route to get products by category
productRouter.get("/getProductsByCategory/:category", getProductsByCategory);

productRouter.get("/getProductsByBrand/:name", getProductsByBrand);
// Route to get products by subcategory
productRouter.get(
  "/getProductsBySubcategory/:subcategory",
  getProductsBySubcategory
);

// Route to get products by product name
productRouter.get(
  "/getProductsByProductName/:productName",
  getProductsByProductName
);
productRouter.post("/payment/checkout", (req, res) => {
  checkout(req, res);
});

productRouter.post(
  "/placeOrder/:productId/:userId/:amountPaid/:addressId",
  placeOrder
);

export default productRouter;
