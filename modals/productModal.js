import mongoose from "mongoose";

const productScheme = mongoose.Schema(
  {
    productname: {
      type: String,
      index: true,
      required: [true, "pls add productname"],
    },
    price: {
      type: String,
      required: [true, "please enter amount in Rupees"],
    },
    category: {
      type: String,
      index: true,
      required: [true, "pls add category"],
    },
    brand: {
      type: String,
      index: true,
      required: [true, "pls add brand name"],
    },
    images: {
      type: Array,
      required: [true, "pls add images"],
    },
    units: {
      type: String,
      required: [true, "pls add units"],
    },
    description: {
      type: String,
      required: [true, "add some description"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Products", productScheme);
