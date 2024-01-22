import asyncHandler from "express-async-handler";
import Product from "../modals/productModal.js";

export const getCurrentWeather = asyncHandler((location) => {
  console.log("000o", location);
  if (location.toLowerCase().includes("delhi")) {
    console.log("yes");
    return JSON.stringify({
      location: "delhi",
      temperature: "10",
      unit: "celsius",
    });
  } else if (location.toLowerCase().includes("san francisco")) {
    return JSON.stringify({
      location: "San Francisco",
      temperature: "72",
      unit: "fahrenheit",
    });
  } else if (location.toLowerCase().includes("paris")) {
    return JSON.stringify({
      location: "Paris",
      temperature: "22",
      unit: "fahrenheit",
    });
  } else {
    return JSON.stringify({ location, temperature: "unknown" });
  }
});

export const getProductsByCategoryChat = asyncHandler(
  async (categoryOrSubcategory) => {
    if (!categoryOrSubcategory) {
      throw new Error("Please provide either category or subcategory");
    }

    console.log(categoryOrSubcategory);

    const query = {
      $or: [
        { category: categoryOrSubcategory },
        { subcategory: categoryOrSubcategory },
      ],
    };

    const products = await Product.find(query);
    console.log(query, products);
    return JSON.stringify({
      message: `Products in category or subcategory ${categoryOrSubcategory}`,
      products,
    });
  }
);

export const getProductsByBrandName = asyncHandler(async (name) => {
  console.log(name);
  if (!name) {
    throw new Error("Please provide brand name");
  }

  console.log(name);

  // const query = {
  //   $or: [
  //     { category: categoryOrSubcategory },
  //     { subcategory: categoryOrSubcategory },
  //   ],
  // };

  const products = await Product.find({ brand: name });
  console.log("brandProducts", products);
  return JSON.stringify({
    message: `Products in category or subcategory ${products}`,
    products,
  });
});
